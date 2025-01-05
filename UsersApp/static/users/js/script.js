let alertDiv = document.getElementById('alert')
if (alertDiv) {
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

function popAlert(status,message) {
    let alertContainer = document.getElementById('alertContainer');
    let alert = document.createElement('div');
    let icon;
    
    if (status === 'success'){
        icon = "fa-check"
    }
    else{
        icon = 'fa-triangle-exclamation'
    }

    alertContainer.innerHTML = '';
    alert.id = 'alert'
    alert.className =  `alert alert-${status}`
    alert.innerHTML = `
            <div class="alert-icon icon-${status}">
                <i class="fa-solid ${icon}"></i>
            </div>
            <p class="alert-message">${message}</p>
            <button class="alert-btn" type="button"><i class="fa-solid fa-xmark"></i></button>
    `
    setTimeout(() =>{
        alertContainer.appendChild(alert)
        setTimeout(() =>{
            alert.style.display = 'none';
        },5000)
    },200)
}

function startTimer() {
    let countdown;
    let countdownTime = 30;
    let timerElement = document.getElementById('resendTimer');
    timerElement.textContent = countdownTime;
    resendButton.disabled = true;
    countdown = setInterval(() => {
        countdownTime--;
        timerElement.textContent = countdownTime;
        if (countdownTime <= 0) {
            clearInterval(countdown);
            resendButton.disabled = false;
        }
    }, 1000);  
}

function showOtpSection(){
    let otpSection = document.getElementById('otpSection')
    let loginBtn =document.getElementById('loginBtn')
    let verifyBtn = document.getElementById('verifyBtn')
    let otpCodeInput = document.getElementById('otpCode')
    let email = document.querySelector('input[name="email"]')
    let password = document.querySelector('input[name="password"]')

    otpSection.style.display = 'block'
    otpCodeInput.disabled = false
    loginBtn.style.display = 'none'
    loginBtn.disabled = true
    verifyBtn.style.display = 'block'
    verifyBtn.disabled = false
    email.disabled = true
    password.disabled = true
    startTimer();
}

function register(){

    fetch('/register/',{
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'X-CSRFToken':document.querySelector('input[name="csrfmiddlewaretoken"]').value
        },
        body:new URLSearchParams(
            {
                'first_name':document.querySelector('input[name="first_name"]').value,
                'middle_name':document.querySelector('input[name="middle_name"]').value,
                'last_name':document.querySelector('input[name="last_name"]').value,
                'email':document.querySelector('input[name="email"]').value,
                'password':document.querySelector('input[name="password"]').value,
                'confirm_password':document.querySelector('input[name="confirm_password"]').value,
            }
        ),
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success'){
            registerForm.reset();
            window.location.href = '/login/';
        }
        else{
            popAlert(data.status,data.message)
        }
    })
    .catch(error => {
        popAlert('error',error);
    });
}

function login(){
    fetch('/login/',{
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'X-CSRFToken':document.querySelector('input[name="csrfmiddlewaretoken"]').value
        },
        body:new URLSearchParams(
            {
                'email':document.querySelector('input[name="email"]').value,
                'password':document.querySelector('input[name="password"]').value,
            }
        ),     
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success'){
            showOtpSection()
            popAlert(data.status,data.message)
        }
        else{
            popAlert(data.status,data.message)
        }
    })
    .catch(error => {
        popAlert('error',error);
    });
}

function verifyOtp(){
    fetch('/verify-otp/',{
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'X-CSRFToken':document.querySelector('input[name="csrfmiddlewaretoken"]').value
        },
        body:new URLSearchParams(
            {
                'email':document.querySelector('input[name="email"]').value,
                'password':document.querySelector('input[name="password"]').value,
                'otp_code':document.querySelector('input[name="otp_code"]').value,
            }
        ),     
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success'){
            loginForm.reset();
            window.location.href = '/';
        }
        else{
            popAlert(data.status,data.message)
        }
    })
    .catch(error => {
        popAlert('error',error);
    });
}

let registerForm = document.getElementById('registerForm');
if(registerForm) {
    registerForm.addEventListener('submit',function(event){
        event.preventDefault();
        register()
    })
}

let loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit',function(event){
        event.preventDefault();
        if(event.submitter.id === 'loginBtn'){
            login()
        }
        else{
            verifyOtp()
        }
    })
}

const resendButton = document.getElementById('resendBtn');
if (resendButton){
    resendButton.addEventListener('click', function() {
        if (!resendButton.disabled) {
            login();
        }
    });
}

