from django.urls import path

from . import views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('applications/', views.application_list, name='application-list'),
    path('applications/new/', views.application_create, name='application-create'),
    path('applications/<int:pk>/', views.application_detail, name='application-detail'),
    path('applications/<int:pk>/edit/', views.application_update, name='application-update'),
    path('applications/<int:pk>/delete/', views.application_delete, name='application-delete'),
    path('signup/', views.signup, name='signup'),
]
