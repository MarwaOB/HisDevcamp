from django.urls import path, include
from .views import *

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', include([
        path('auth/', include([
            path('register/', UserRegistrationView.as_view(), name='register'),
            path('login/', UserLoginView.as_view(), name='login'),
            path('logout/', UserLogoutView.as_view(), name='logout'),
        ])),
    ])),
    path('predict/', PredictFromCSV.as_view(), name='predict-from-csv'),
    path('choose-plan/', ChooseSubscriptionPlanView.as_view(), name='choose-plan'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
  ]