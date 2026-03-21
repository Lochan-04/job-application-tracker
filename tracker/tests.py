from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import JobApplication


class TrackerSmokeTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='strong-pass-123')

    def test_dashboard_requires_authentication(self):
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 302)

    def test_logged_in_user_can_create_application(self):
        self.client.login(username='tester', password='strong-pass-123')
        response = self.client.post(
            reverse('application-create'),
            {
                'company_name': 'OpenAI',
                'role': 'Frontend Engineer',
                'location': 'Remote',
                'salary_range': '$120k-$150k',
                'status': JobApplication.STATUS_APPLIED,
                'job_type': JobApplication.JOB_TYPE_REMOTE,
                'source': 'Referral',
                'application_link': 'https://example.com/jobs/frontend',
                'contact_name': 'Alex Recruiter',
                'contact_email': 'alex@example.com',
                'priority': JobApplication.PRIORITY_HIGH,
                'resume_version': 'Frontend Resume v4',
                'next_step': 'Prepare interview examples',
                'last_contacted_on': '2026-03-20',
                'date_applied': '2026-03-21',
                'follow_up_date': '2026-03-28',
                'notes': 'Strong product sense.',
            },
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(JobApplication.objects.count(), 1)
        self.assertEqual(JobApplication.objects.get().resume_version, 'Frontend Resume v4')
