"""
AI Admin for Optimum Smart System
"""

from django.contrib import admin
from .models import AIAnalysis, CustomerSentiment, DemandPrediction


@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ('order', 'confidence_score', 'created_at', 'updated_at')
    list_filter = ('confidence_score', 'created_at')
    search_fields = ('order__customer_name', 'order__product_type')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order')


@admin.register(CustomerSentiment)
class CustomerSentimentAdmin(admin.ModelAdmin):
    list_display = ('order', 'sentiment', 'confidence', 'created_at')
    list_filter = ('sentiment', 'confidence', 'created_at')
    search_fields = ('order__customer_name', 'order__product_type')
    readonly_fields = ('created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order')


@admin.register(DemandPrediction)
class DemandPredictionAdmin(admin.ModelAdmin):
    list_display = ('product_type', 'predicted_demand', 'confidence', 'created_at')
    list_filter = ('predicted_demand', 'confidence', 'created_at')
    search_fields = ('product_type',)
    readonly_fields = ('created_at',)



