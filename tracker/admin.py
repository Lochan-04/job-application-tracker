from django.contrib import admin

from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'company_name',
        'role',
        'status',
        'priority',
        'job_type',
        'source',
        'date_applied',
        'follow_up_date',
    )
    list_filter = ('status', 'priority', 'job_type', 'source', 'date_applied')
    search_fields = ('company_name', 'role', 'location', 'source', 'contact_name', 'resume_version')
