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
from django.contrib.auth import get_user_model
from django.utils import timezone




class UserRegistrationView(APIView):
    permission_classes = [AllowAny]  # Changed from IsAuthenticated
    
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
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']
            user = None

            # Try to find user by email or username
            User = get_user_model()
            try:
                user_obj = User.objects.get(email=identifier)
            except User.DoesNotExist:
                try:
                    user_obj = User.objects.get(username=identifier)
                except User.DoesNotExist:
                    return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Authenticate using the user's actual username
            user = authenticate(username=user_obj.username, password=password)

            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': SafeCustomUserSerializer(user).data
                }, status=status.HTTP_200_OK)

            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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
import io
from django.http import FileResponse
import csv
import io
import csv
import os
import traceback
import pandas as pd
import joblib
from django.core.cache import cache
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

import base64

def encode_image_to_base64(filepath):
    with open(filepath, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"


class PredictFromCSV(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        user = request.user

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

            dashboard_data = []
            result_rows = []
            for i, pred in enumerate(y_pred):
                row = {
                    "record_ID": int(test_df.loc[i, "record_ID"]),
                    "sku_id": test_df.loc[i, "sku_id"],
                    "week": test_df.loc[i, "week"],
                    "units_sold": int(round(pred))
                }
                result_rows.append(row)
                dashboard_data.append({
                    "product_id": test_df.loc[i, "sku_id"],
                    "date": pd.to_datetime(test_df.loc[i, "week"]),
                    "is_featured": bool(test_df.loc[i, "is_featured_sku"]),
                    "is_display_sku": bool(test_df.loc[i, "is_display_sku"]),
                    "units_sold": int(round(pred)),
                })

            # Store dashboard data in cache
            cache_key = f'dashboard_data_user_{user.id}'
            cache.set(cache_key, dashboard_data, timeout=3600)

            # Update user prediction count
            user.predictions_count += 1
            user.save()

            # Generate backend graphs
            generate_critical_products_graph(user)
            generate_seasonal_products_graph(user)
            generate_product_status_graph(user)

            # Write CSV to binary buffer
            text_buffer = io.StringIO()
            writer = csv.DictWriter(text_buffer, fieldnames=["record_ID", "sku_id", "week", "units_sold"])
            writer.writeheader()
            writer.writerows(result_rows)

            # Convert to BytesIO for FileResponse
            bytes_buffer = io.BytesIO()
            bytes_buffer.write(text_buffer.getvalue().encode('utf-8'))
            bytes_buffer.seek(0)

            return FileResponse(bytes_buffer, as_attachment=True, filename="predictions.csv")

        except Exception as e:
            traceback.print_exc()  # Logs full error to console for debugging
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardGraphsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        graph_names = [
            f'critical_products_user_{user.id}.png',
            f'seasonal_products_user_{user.id}.png',
            f'product_status_user_{user.id}.png',
        ]
        graph_paths = [os.path.join('media/graphs', name) for name in graph_names]

        graphs_encoded = {}
        for name, path in zip(['critical', 'seasonal', 'status'], graph_paths):
            try:
                with open(path, "rb") as img_file:
                    b64 = base64.b64encode(img_file.read()).decode("utf-8")
                    graphs_encoded[name] = f"data:image/png;base64,{b64}"
            except FileNotFoundError:
                graphs_encoded[name] = None

        return Response({"graphs": graphs_encoded})


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



