from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# Create your models here.

class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(('The Email field must be set'))
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        for key, value in extra_fields.items():
            extra_fields[key] = value.title() if value else value
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    #------ USERS PERSONAL INFORMATION -----
    id = models.AutoField(primary_key=True)
    profile_pic = models.ImageField(upload_to='UserProfileImages/', null=True, blank=True)
    first_name = models.CharField(max_length=50, null=False, blank=False)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=False, blank=False)
    role = models.CharField(max_length=10, null=False, blank=False,default="Admin")

    #------ USERS AUTHENTICATION INFORMATION -----
    email = models.EmailField(unique=True, null=False, blank=False)
    password = models.CharField(max_length=50, null=False, blank=False)

    #------ ACCOUNT INFORMATION -----
    is_active = models.BooleanField(default=True)
    date_created = models.DateField(auto_now_add=True)

    #------ META DATA -----
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','middle_name','last_name','role']

    objects = UserManager()

    def __str__(self):
        return self.email