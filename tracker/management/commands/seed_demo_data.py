from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from tracker.models import JobApplication


class Command(BaseCommand):
    help = "Create a demo user and realistic sample job application data."

    def handle(self, *args, **options):
        today = timezone.localdate()
        user, _ = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@example.com"},
        )
        user.set_password("demo12345")
        user.save()

        JobApplication.objects.filter(user=user).delete()

        samples = [
            {
                "company_name": "Google",
                "role": "Software Engineer Intern",
                "location": "Bengaluru",
                "salary_range": "₹70k/month stipend",
                "status": JobApplication.STATUS_INTERVIEW,
                "job_type": JobApplication.JOB_TYPE_INTERN,
                "source": "Careers Page",
                "application_link": "https://careers.google.com/",
                "contact_name": "Priya Sharma",
                "contact_email": "priya.sharma@google.example",
                "priority": JobApplication.PRIORITY_HIGH,
                "resume_version": "Internship Resume v3",
                "next_step": "Prepare DSA revision and review past projects",
                "last_contacted_on": today - timedelta(days=1),
                "date_applied": today - timedelta(days=9),
                "follow_up_date": today + timedelta(days=2),
                "notes": "Strong match for backend and problem-solving rounds.",
            },
            {
                "company_name": "Microsoft",
                "role": "Frontend Developer",
                "location": "Hyderabad",
                "salary_range": "₹14-18 LPA",
                "status": JobApplication.STATUS_SCREENING,
                "job_type": JobApplication.JOB_TYPE_FULL_TIME,
                "source": "LinkedIn",
                "application_link": "https://careers.microsoft.com/",
                "contact_name": "Aarav Mehta",
                "contact_email": "aarav.mehta@microsoft.example",
                "priority": JobApplication.PRIORITY_HIGH,
                "resume_version": "Frontend Resume v2",
                "next_step": "Send portfolio and JavaScript project links",
                "last_contacted_on": today - timedelta(days=3),
                "date_applied": today - timedelta(days=7),
                "follow_up_date": today + timedelta(days=1),
                "notes": "UI-heavy role. Mention the tracker project and responsive layout work.",
            },
            {
                "company_name": "Amazon",
                "role": "SDE I",
                "location": "Chennai",
                "salary_range": "₹16-22 LPA",
                "status": JobApplication.STATUS_APPLIED,
                "job_type": JobApplication.JOB_TYPE_FULL_TIME,
                "source": "Referral",
                "application_link": "https://www.amazon.jobs/",
                "contact_name": "Neha Kapoor",
                "contact_email": "neha.kapoor@amazon.example",
                "priority": JobApplication.PRIORITY_MEDIUM,
                "resume_version": "General SDE Resume",
                "next_step": "Wait for OA invite and prepare aptitude practice",
                "last_contacted_on": today - timedelta(days=5),
                "date_applied": today - timedelta(days=5),
                "follow_up_date": today + timedelta(days=4),
                "notes": "Referral submitted through alumni contact.",
            },
            {
                "company_name": "Infosys",
                "role": "Systems Engineer",
                "location": "Pune",
                "salary_range": "₹4.5-6.5 LPA",
                "status": JobApplication.STATUS_OFFER,
                "job_type": JobApplication.JOB_TYPE_FULL_TIME,
                "source": "Campus Placement",
                "application_link": "https://www.infosys.com/careers/",
                "contact_name": "Rahul Verma",
                "contact_email": "rahul.verma@infosys.example",
                "priority": JobApplication.PRIORITY_HIGH,
                "resume_version": "Placement Resume Final",
                "next_step": "Compare offer with current interview pipeline",
                "last_contacted_on": today,
                "date_applied": today - timedelta(days=18),
                "follow_up_date": today + timedelta(days=3),
                "notes": "Offer received. Waiting for deadline details from HR.",
            },
            {
                "company_name": "TCS",
                "role": "Digital Role",
                "location": "Remote",
                "salary_range": "₹7-9 LPA",
                "status": JobApplication.STATUS_REJECTED,
                "job_type": JobApplication.JOB_TYPE_REMOTE,
                "source": "Campus Placement",
                "application_link": "https://www.tcs.com/careers",
                "contact_name": "Sneha Iyer",
                "contact_email": "sneha.iyer@tcs.example",
                "priority": JobApplication.PRIORITY_LOW,
                "resume_version": "Placement Resume v1",
                "next_step": "Review OA mistakes and improve MCQ speed",
                "last_contacted_on": today - timedelta(days=10),
                "date_applied": today - timedelta(days=20),
                "follow_up_date": today - timedelta(days=6),
                "notes": "Rejected after online assessment. Useful feedback for prep strategy.",
            },
            {
                "company_name": "Adobe",
                "role": "UI Engineer Intern",
                "location": "Noida",
                "salary_range": "₹85k/month stipend",
                "status": JobApplication.STATUS_WISHLIST,
                "job_type": JobApplication.JOB_TYPE_INTERN,
                "source": "LinkedIn",
                "application_link": "https://careers.adobe.com/",
                "contact_name": "Karan Malhotra",
                "contact_email": "karan.malhotra@adobe.example",
                "priority": JobApplication.PRIORITY_MEDIUM,
                "resume_version": "Design + Frontend Resume",
                "next_step": "Tailor resume and add motion-heavy portfolio examples",
                "last_contacted_on": None,
                "date_applied": today,
                "follow_up_date": today + timedelta(days=7),
                "notes": "Dream internship. Needs stronger visual portfolio packaging.",
            },
        ]

        for sample in samples:
            JobApplication.objects.create(user=user, **sample)

        self.stdout.write(self.style.SUCCESS("Demo account ready: username=demo password=demo12345"))
