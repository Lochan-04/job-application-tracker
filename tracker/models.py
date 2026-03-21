from django.conf import settings
from django.db import models
from django.urls import reverse
from django.utils import timezone


class JobApplication(models.Model):
    STATUS_WISHLIST = 'wishlist'
    STATUS_APPLIED = 'applied'
    STATUS_SCREENING = 'screening'
    STATUS_INTERVIEW = 'interview'
    STATUS_OFFER = 'offer'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = [
        (STATUS_WISHLIST, 'Wishlist'),
        (STATUS_APPLIED, 'Applied'),
        (STATUS_SCREENING, 'Screening'),
        (STATUS_INTERVIEW, 'Interview'),
        (STATUS_OFFER, 'Offer'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    JOB_TYPE_FULL_TIME = 'full-time'
    JOB_TYPE_PART_TIME = 'part-time'
    JOB_TYPE_CONTRACT = 'contract'
    JOB_TYPE_INTERN = 'internship'
    JOB_TYPE_REMOTE = 'remote'

    JOB_TYPE_CHOICES = [
        (JOB_TYPE_FULL_TIME, 'Full Time'),
        (JOB_TYPE_PART_TIME, 'Part Time'),
        (JOB_TYPE_CONTRACT, 'Contract'),
        (JOB_TYPE_INTERN, 'Internship'),
        (JOB_TYPE_REMOTE, 'Remote'),
    ]

    PRIORITY_HIGH = 'high'
    PRIORITY_MEDIUM = 'medium'
    PRIORITY_LOW = 'low'

    PRIORITY_CHOICES = [
        (PRIORITY_HIGH, 'High'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_LOW, 'Low'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    company_name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    location = models.CharField(max_length=120, blank=True)
    salary_range = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_APPLIED)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default=JOB_TYPE_FULL_TIME)
    source = models.CharField(max_length=120, blank=True, help_text='LinkedIn, referral, careers page, etc.')
    application_link = models.URLField(blank=True)
    contact_name = models.CharField(max_length=120, blank=True)
    contact_email = models.EmailField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    resume_version = models.CharField(max_length=120, blank=True)
    next_step = models.CharField(max_length=180, blank=True)
    last_contacted_on = models.DateField(blank=True, null=True)
    date_applied = models.DateField()
    follow_up_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-date_applied']

    def __str__(self):
        return f'{self.company_name} - {self.role}'

    def get_absolute_url(self):
        return reverse('application-detail', args=[self.pk])

    @property
    def is_follow_up_due(self):
        return bool(self.follow_up_date and self.follow_up_date <= timezone.localdate())
