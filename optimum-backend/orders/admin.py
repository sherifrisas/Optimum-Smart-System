from django.contrib import admin
from .models import Order, OrderMessage

class OrderMessageInline(admin.TabularInline):
    model = OrderMessage
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'product_type', 'quantity', 'total_amount', 'status', 'delivery_date', 'created_at']
    list_filter = ['status', 'delivery_date', 'created_at']
    search_fields = ['customer__name', 'product_type', 'customer__phone_number']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']
    inlines = [OrderMessageInline]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('customer', 'supplier', 'product_type', 'quantity', 'unit_price', 'total_amount')
        }),
        ('Delivery & Status', {
            'fields': ('delivery_date', 'status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(OrderMessage)
class OrderMessageAdmin(admin.ModelAdmin):
    list_display = ['order', 'message_type', 'sender', 'created_at']
    list_filter = ['message_type', 'created_at']
    search_fields = ['order__id', 'content', 'sender']
    readonly_fields = ['created_at']
    ordering = ['-created_at']