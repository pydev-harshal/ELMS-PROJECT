import random
from django.utils import timezone
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from UsersApp.models import User
# Create your views here.

def index(request):
    return render(request,'Users/index.html')

def register(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name').title()
        middle_name = request.POST.get('middle_name').title()
        last_name = request.POST.get('last_name').title()
        email = request.POST.get('email').lower()
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if User.objects.filter(email=email).exists():
            return JsonResponse({'status':'error','message':'Email already exists.Try Logging in.'})
        
        if password != confirm_password:
            return JsonResponse({'status':'error','message':'Passwords does not match.'})
        
        User.objects.create_user(first_name=first_name,middle_name=middle_name,last_name=last_name,
                                 email=email,password=password,role='Student')
        messages.success(request,f'{first_name} {last_name[0]} registered successfully.')
        return JsonResponse({'status':'success'})
    else:
        return render(request,'Users/register.html')

def loginview(request):
    if request.method == 'POST':
        email = request.POST.get('email').lower()
        password = request.POST.get('password')
        user = authenticate(request,email=email,password=password)
        if user is not None:
            otp_code = random.randint(1000, 9999)
            request.session['otp_code'] = otp_code
            request.session['otp_expiry'] = (timezone.now() + timezone.timedelta(seconds= 30)).timestamp()
            print("OTP",otp_code) #REPLACE BY SENDING EMAIL
            return JsonResponse({'status': 'success','message':f'OTP send to {user.email}'})
        else:
            return JsonResponse({'status':'error','message':'Invalid Email or Password.'})
    else:
        return render(request,'Users/login.html')

def verify_otp(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        otp_code = request.POST.get('otp_code')
        otp_expiry = request.session.get('otp_expiry', 0)
        if timezone.now().timestamp() > otp_expiry:
            return JsonResponse({'status': 'error', 'message': 'OTP expired.Try Again.'})
        if str(otp_code) == str(request.session.get('otp_code')):
            user = authenticate(request, email=email, password=password)
            if user:
                login(request, user)
                messages.success(request,f'{user.first_name} {user.last_name[0]} Logged in successfully.')
                return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'message': 'Invalid OTP.Try Again.'})
    return redirect('index')