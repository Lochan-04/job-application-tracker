from collections import defaultdict

from django.db.models import Count
from django.utils import timezone

from .models import JobApplication


def build_dashboard_data(user):
    applications = JobApplication.objects.filter(user=user)
    today = timezone.localdate()
    total_count = applications.count()
    interviews = applications.filter(status=JobApplication.STATUS_INTERVIEW)
    offers = applications.filter(status=JobApplication.STATUS_OFFER)
    follow_ups = applications.filter(follow_up_date__isnull=False)

    status_counts = {
        item["status"]: item["count"]
        for item in applications.values("status").annotate(count=Count("id"))
    }
    source_breakdown = applications.values("source").annotate(count=Count("id")).order_by("-count", "source")

    month_groups = defaultdict(int)
    for application in applications.order_by("date_applied"):
        month_groups[application.date_applied.strftime("%b %Y")] += 1

    return {
        "applications": applications,
        "status_choices": JobApplication.STATUS_CHOICES,
        "status_counts": status_counts,
        "safe_total_count": max(total_count, 1),
        "total_count": total_count,
        "active_count": applications.exclude(status=JobApplication.STATUS_REJECTED).count(),
        "offer_count": offers.count(),
        "interview_count": interviews.count(),
        "response_rate": round(((interviews.count() + offers.count()) / max(total_count, 1)) * 100),
        "due_follow_up_count": follow_ups.filter(follow_up_date__lte=today).count(),
        "high_priority_count": applications.filter(priority=JobApplication.PRIORITY_HIGH).count(),
        "recent_applications": applications[:6],
        "upcoming_follow_ups": follow_ups.filter(follow_up_date__gte=today).order_by("follow_up_date")[:6],
        "overdue_follow_ups": follow_ups.filter(follow_up_date__lt=today).order_by("follow_up_date")[:6],
        "interview_pipeline": interviews.order_by("follow_up_date", "-updated_at")[:6],
        "source_breakdown": [item for item in source_breakdown if item["source"]][:5],
        "monthly_activity": list(month_groups.items())[-4:],
    }
