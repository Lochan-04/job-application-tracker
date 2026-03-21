from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone

from .forms import JobApplicationForm, LoginForm, SignUpForm
from .models import JobApplication
from .services import build_dashboard_data


class CustomLoginView(LoginView):
    template_name = 'registration/login.html'
    authentication_form = LoginForm


class CustomLogoutView(LogoutView):
    def get_default_redirect_url(self):
        return f"{reverse('login')}?logged_out=1"


def logout_view(request):
    logout(request)
    return redirect(f"{reverse('login')}?logged_out=1")


def signup(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Welcome aboard. Your tracker is ready.')
            return redirect('dashboard')
    else:
        form = SignUpForm()

    return render(request, 'registration/signup.html', {'form': form})


@login_required
def dashboard(request):
    return render(request, 'tracker/dashboard.html', build_dashboard_data(request.user))


@login_required
def application_list(request):
    query = request.GET.get('q', '').strip()
    status_filter = request.GET.get('status', '').strip()
    sort = request.GET.get('sort', 'updated')

    applications = JobApplication.objects.filter(user=request.user)

    if query:
        applications = applications.filter(
            Q(company_name__icontains=query)
            | Q(role__icontains=query)
            | Q(location__icontains=query)
            | Q(notes__icontains=query)
        )

    if status_filter:
        applications = applications.filter(status=status_filter)

    sort_map = {
        'updated': '-updated_at',
        'applied': '-date_applied',
        'company': 'company_name',
        'followup': 'follow_up_date',
    }

    context = {
        'applications': applications.order_by(sort_map.get(sort, '-updated_at')),
        'query': query,
        'status_filter': status_filter,
        'sort': sort,
        'status_choices': JobApplication.STATUS_CHOICES,
    }
    return render(request, 'tracker/application_list.html', context)


@login_required
def application_detail(request, pk):
    application = get_object_or_404(JobApplication, pk=pk, user=request.user)
    return render(request, 'tracker/application_detail.html', {'application': application})


@login_required
def application_create(request):
    if request.method == 'POST':
        form = JobApplicationForm(request.POST)
        if form.is_valid():
            application = form.save(commit=False)
            application.user = request.user
            application.save()
            messages.success(request, 'Application added to your pipeline.')
            return redirect(application.get_absolute_url())
    else:
        form = JobApplicationForm(initial={'date_applied': timezone.localdate()})

    return render(request, 'tracker/application_form.html', {'form': form, 'page_title': 'Add application'})


@login_required
def application_update(request, pk):
    application = get_object_or_404(JobApplication, pk=pk, user=request.user)

    if request.method == 'POST':
        form = JobApplicationForm(request.POST, instance=application)
        if form.is_valid():
            form.save()
            messages.success(request, 'Application updated.')
            return redirect(application.get_absolute_url())
    else:
        form = JobApplicationForm(instance=application)

    return render(
        request,
        'tracker/application_form.html',
        {'form': form, 'page_title': f'Edit {application.company_name}'},
    )


@login_required
def application_delete(request, pk):
    application = get_object_or_404(JobApplication, pk=pk, user=request.user)

    if request.method == 'POST':
        application.delete()
        messages.success(request, 'Application removed.')
        return redirect('application-list')

    return render(request, 'tracker/application_confirm_delete.html', {'application': application})
