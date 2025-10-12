from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone_number', 'email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'phone_number', 'email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']