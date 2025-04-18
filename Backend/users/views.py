from datetime import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import *
from .models import CustomUser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
import pandas as pd
import joblib
import os
from ai.data_preprocessing import preprocess_train_data  
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from dashboard.utils import generate_critical_products_graph, generate_seasonal_products_graph, generate_product_status_graph
from django.core.cache import cache



class UserRegistrationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return Response({
                'token': token.key,
                'user': SafeCustomUserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                token, created = Token.objects.get_or_create(user=user)
                if not created:  # Rotate token if it already existed
                    token.delete()
                    token = Token.objects.create(user=user)
                
                return Response({
                    'token': token.key,
                    'user': SafeCustomUserSerializer(user).data
                }, status=status.HTTP_200_OK)
            
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {'message': 'Successfully logged out'},
            status=status.HTTP_200_OK
        )

@api_view(['GET'])
@permission_classes([AllowAny])  
def api_root(request):
    return Response({
        'message': 'Welcome to the Inventory Management API',
        'endpoints': {
            'register': '/register/',
            'login': '/login/',
            'logout': '/logout/',
            'admin': '/admin/',
        }
    })    

class PredictFromCSV(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        user = request.user
        user.save()

        if not user.is_subscription_active():
            return Response({
                "error": "Your subscription is inactive or you have reached your prediction limit."
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            csv_file = request.FILES.get('file')
            if not csv_file:
                return Response({"error": "CSV file is required."}, status=status.HTTP_400_BAD_REQUEST)

            test_df = pd.read_csv(csv_file)
            X_test = preprocess_train_data(test_df)
            X_test = X_test.fillna(0)

            model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../notebooks/model.pkl'))
            if not os.path.exists(model_path):
                return Response({"error": "Model file not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            model = joblib.load(model_path)
            y_pred = model.predict(X_test)

            # Stockage local des infos pour les graphiques
            dashboard_data = []
            for i, pred in enumerate(y_pred):
                dashboard_data.append({
                    "product_id": test_df.loc[i, "sku_id"],
                    "date": pd.to_datetime(test_df.loc[i, "week"]),
                    "is_featured": bool(test_df.loc[i, "is_featured_sku"]),
                    "is_display_sku": bool(test_df.loc[i, "is_display_sku"]),
                    "units_sold": int(round(pred)),
                })

            # Sauvegarder les données pour usage futur (ex: cache ou base)
            cache_key = f'dashboard_data_user_{user.id}'
            cache.set(cache_key, dashboard_data, timeout=3600)  # 1h de validité (modifiable)

            # Compte l’usage
            user.predictions_count += 1
            user.save()

            # Generate the graphs directly using the utils
            generate_critical_products_graph(user)
            generate_seasonal_products_graph(user)
            generate_product_status_graph(user)  


            return Response({
                "predictions": [
                    {"record_ID": int(record_id), "units_sold": int(round(pred))}
                    for record_id, pred in zip(test_df['record_ID'], y_pred)
                ],
               
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = SafeCustomUserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(SafeCustomUserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(SafeCustomUserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChooseSubscriptionPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        selected_plan = request.data.get('plan')
        user = request.user

        if selected_plan not in CustomUser.SUBSCRIPTION_PLANS:
            return Response(
                {'error': 'Invalid subscription plan selected.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if user.subscription_type != 'FREE' and selected_plan == 'FREE':
         return Response({'error': 'You cannot downgrade to a free plan.'}, status=403)


        # Update user's subscription
        user.subscription_type = selected_plan
        user.subscription_start_date = timezone.now()
        user.predictions_count = 0  # reset count on new subscription
        user.save()

        return Response({
            'message': f'Subscription updated to {selected_plan}',
            'subscription': SafeCustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)
