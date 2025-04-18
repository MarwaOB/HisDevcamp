# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import  RegexValidator
from django.utils import timezone
from datetime import timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        if not phone:
            raise ValueError('Users must have a phone number')
        
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            phone=phone,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, phone, password, **extra_fields)
class CustomUser(AbstractUser):
    """Custom user model with additional fields for business clients"""
    objects = CustomUserManager()
    
    company_name = models.CharField(max_length=255, blank=True)
    business_type = models.CharField(max_length=100, blank=True)
    
    phone_regex = RegexValidator(
        regex=r'^(05|06|07)\d{8}$',
        message="Phone number must start with 05, 06, or 07 and contain exactly 10 digits."
    )
    phone = models.CharField(
        max_length=10,
        validators=[phone_regex],
        unique=True
    )
    
    SUBSCRIPTION_PLANS = {
        'FREE': {
            'duration': None,  # No time limit (trial)
            'predictions_limit': 3,
            'features': ['basic_predictions']
        },
        'BASIC_MONTHLY': {
            'duration': timedelta(days=30),
            'predictions_limit': 5,
            'price_dzd': 15000,  # ~180 USD (2 mois gratuits)
            'features': [  'dashboard']
        },
        'PREMIUM_MONTHLY': {
            'duration': timedelta(days=30),
            'predictions_limit': 8,
            'price_dzd': 20000,  # ~180 USD (2 mois gratuits)
            'features': ['report_generation', 'dashboard']
        },
        'BASIC_ANNUAL': {
            'duration': timedelta(days=365),
            'predictions_limit': 60,
            'price_dzd': 70000,  # ~180 USD (2 mois gratuits)
            'features': ['email_support', 'annual_discount', 'dashboard']
        },
        'PREMIUM_ANNUAL': {
            'duration': timedelta(days=365),
            'predictions_limit': None,  # Unlimited
            'price_dzd': 100000,  # ~180 USD (2 mois gratuits)
            'features': ['all_features', 'unlimited_predictions', 'report_generation', 'annual_discount', 'dashboard']
        }
    }

    subscription_type = models.CharField(
        max_length=50,
        choices=[
            ('FREE', 'Free Trial (3 predictions)'),
            ('BASIC_MONTHLY', 'Basic Monthly (100 predictions)'),
            ('PREMIUM_MONTHLY', 'Premium Monthly (500 predictions)'),
            ('BASIC_ANNUAL', 'Basic Annual (1500 predictions)'),
            ('PREMIUM_ANNUAL', 'Premium Annual (Unlimited)'),
        ],
        default='FREE'
    )
    
    subscription_start_date = models.DateTimeField(null=True, blank=True)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    notified_before_expiry = models.BooleanField(default=False)
    predictions_count = models.IntegerField(default=0)
    can_generate_reports = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.company_name} ({self.username})"

    def save(self, *args, **kwargs):
        now = timezone.now()
        plan = self.SUBSCRIPTION_PLANS.get(self.subscription_type, {})

        # If no start date, set it now
        if not self.subscription_start_date:
            self.subscription_start_date = now

        # Set or update end date if duration exists
        if plan.get('duration'):
            self.subscription_end_date = self.subscription_start_date + plan['duration']

        # Auto downgrade to FREE if expired
        if self.subscription_end_date and self.subscription_end_date < now:
            if self.subscription_type != 'FREE':
                # Notify on expiration
                Notification.objects.create(
                    user=self,
                    title="Subscription Expired",
                    message="Your subscription has expired and was downgraded to the Free plan.",
                    notification_type="SUBSCRIPTION"
                )
            self.subscription_type = 'FREE'
            self.subscription_start_date = now
            self.subscription_end_date = None
            self.predictions_count = 0
            self.notified_before_expiry = False  # Reset flag on downgrade

        # Check for "about to expire" notifications
        elif self.subscription_end_date:
            days_left = (self.subscription_end_date - now).days
            if days_left <= 7 and not self.notified_before_expiry and self.subscription_type != 'FREE':
                Notification.objects.create(
                    user=self,
                    title="Subscription Expiring Soon",
                    message=f"Your {self.get_subscription_type_display()} plan will expire in {days_left} day(s). Renew to avoid losing premium features.",
                    notification_type="SUBSCRIPTION"
                )
                self.notified_before_expiry = True

        # Check features again in case plan changed
        self.can_generate_reports = 'report_generation' in plan.get('features', [])

        super().save(*args, **kwargs)

    def is_subscription_active(self):
        """Check if subscription is valid"""
        plan = self.SUBSCRIPTION_PLANS.get(self.subscription_type, {})
        
        # Free trial check
        if self.subscription_type == 'FREE':
            return self.predictions_count < plan.get('predictions_limit', 0)
        
        # Paid subscription checks
        time_valid = (
            self.subscription_end_date and 
            self.subscription_end_date > timezone.now()
        )
        
        if plan.get('predictions_limit'):
            return time_valid and (self.predictions_count < plan['predictions_limit'])
        return time_valid
    
    def get_remaining_predictions(self):
        """Return remaining predictions or None if unlimited"""
        plan = self.SUBSCRIPTION_PLANS.get(self.subscription_type, {})
        if plan.get('predictions_limit') is None:
            return None
        return max(0, plan['predictions_limit'] - self.predictions_count)
    
    def has_feature(self, feature_name):
        """Check if user has access to a specific feature"""
        plan = self.SUBSCRIPTION_PLANS.get(self.subscription_type, {})
        return feature_name in plan.get('features', [])

class Product(models.Model):
    """Product model for inventory items"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_stock = models.IntegerField(default=0)
    minimum_stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def is_low_stock(self):
        return self.current_stock <= self.minimum_stock


class Report(models.Model):
    """Automated reports for premium users"""
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    generated_on = models.DateTimeField(auto_now_add=True)
    period_start = models.DateField()
    period_end = models.DateField()
    pdf_file = models.FileField(upload_to='reports/')    
    def __str__(self):
        return f"{self.get_report_type_display()} report for {self.user.company_name}"
    

class Notification(models.Model):
    """Model for user notifications"""
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(
        max_length=50,
        choices=[
            ('STOCK_ALERT', 'Stock Alert'),
            ('SUBSCRIPTION', 'Subscription Notification'),
            ('REPORT', 'Report Ready'),
            ('SYSTEM', 'System Notification'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"    