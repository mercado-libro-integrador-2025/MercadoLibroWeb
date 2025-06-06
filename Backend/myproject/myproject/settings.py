from pathlib import Path
from datetime import timedelta  
import os 
import cloudinary
import cloudinary.uploader
import cloudinary.api

BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-u2cy_*yur-^)a-069jr*k^ap0lz!07%iqlm_sc*+3mcwf8-)iw'

DEBUG = False

ALLOWED_HOSTS = ['192.168.0.244', 'localhost', '127.0.0.1', '.onrender.com']
CORS_ALLOW_ALL_ORIGINS = True


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_filters',
    'ecommerce',
    'corsheaders',
    'rest_framework',
    'cloudinary',
    'cloudinary_storage',
]

AUTH_USER_MODEL = 'ecommerce.CustomUser'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'), 
            os.path.join(BASE_DIR, 'venv/Lib/site-packages/django_filters/rest_framework'),  
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bvtg6iunh4mr860neeyz', 
        'USER': 'uvo9ixg777tut6cu',       
        'PASSWORD': '6EdVRlTKW8Dzi8QvpeAs',
        'HOST': 'bvtg6iunh4mr860neeyz-mysql.services.clever-cloud.com', 
        'PORT': '3306',                     
    }
}
CLOUDINARY_URL = "cloudinary://131957877534325:dzjK2jRBeSh6dR2k_jGvVLkzN5U@dags2c12e"

CLOUDINARY_STORAGE  = {
    'cloud_name': 'dags2c12e',
    'api_key': '131957877534325',
    'api_secret': 'dzjK2jRBeSh6dR2k_jGvVLkzN5U',
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,  
    'BLACKLIST_AFTER_ROTATION': True, 
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = '/opt/render/project/src/staticfiles'  

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MERCADOPAGO_ACCESS_TOKEN = os.getenv('MERCADOPAGO_ACCESS_TOKEN', 'TEST-8172258200747869-051120-3beb4a6a51e00538722eefca692fc36e-128356048')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING', 
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO', 
            'propagate': False,
        },
        'ecommerce': { 
            'handlers': ['console'],
            'level': 'INFO', 
            'propagate': False,
        },
        '': { 
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'), 
            'propagate': False,
        }
    },
}