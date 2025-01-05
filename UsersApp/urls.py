from django.urls import path
from UsersApp.views import *

urlpatterns = [
    path('', index, name='index'),
    path('register/', register, name='register'),
    path('login/', loginview, name='login'),
    path('verify-otp/', verify_otp, name='verify-otp'),
]
