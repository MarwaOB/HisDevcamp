#  app users.url

from django.urls import path
from .views import *

urlpatterns = [
    path('', api_root, name='api-root'),
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('auth/predict/', PredictFromCSV.as_view(), name='predict-from-csv'),
    path('auth/choose-plan/', ChooseSubscriptionPlanView.as_view(), name='choose-plan'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/dashboard_graphs/', DashboardGraphsView.as_view(), name='dashboard-graphs'),

]
