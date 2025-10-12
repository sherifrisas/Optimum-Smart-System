from django.contrib import admin
from .models import Supplier

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_person', 'email', 'rating', 'is_active', 'created_at']
    list_filter = ['is_active', 'rating', 'created_at']
    search_fields = ['name', 'contact_person', 'email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-rating', 'name']