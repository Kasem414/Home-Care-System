# urls.py
from django.urls import path
from ..views import user_views as views

urlpatterns = [
    path('users/', views.ListUsersView.as_view()),
    path('users_page/', views.ListUsersNoPaginationView.as_view()),
    path('users/<int:user_id>/update/', views.UpdateUserView.as_view()),
    path('users/<int:user_id>/delete/', views.DeleteUserView.as_view()),
    path('users/<int:user_id>/', views.SearchUserView.as_view()),
    path('account/<int:user_id>/update/', views.UpdateAccountView.as_view()),
    path('account/<int:user_id>/delete/', views.DeleteAccountView.as_view()),
    path('users/<int:user_id>/activate/', views.ActivateUserView.as_view()),
    path('users/<int:user_id>/deactivate/', views.DeactivateUserView.as_view()),
    path('users/<int:user_id>/update-work-state/', views.UpdateWorkStateView.as_view()), 
    path('me/<int:user_id>/', views.GetMeView.as_view()),
    path('me/<int:user_id>/payment/', views.GetMyPaymentStateView.as_view()),
]
