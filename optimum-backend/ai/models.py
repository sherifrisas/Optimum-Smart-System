"""
AI Models for Optimum Smart System
"""

from django.db import models
from django.contrib.auth.models import User
from orders.models import Order


class AIAnalysis(models.Model):
    """Store AI analysis results for orders"""
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='ai_analysis')
    analysis_data = models.JSONField(default=dict)
    recommendations = models.JSONField(default=dict)
    confidence_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "AI Analysis"
        verbose_name_plural = "AI Analyses"
    
    def __str__(self):
        return f"AI Analysis for Order #{self.order.id}"


class CustomerSentiment(models.Model):
    """Store customer sentiment analysis"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='sentiment_analyses')
    sentiment = models.CharField(max_length=20, choices=[
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative')
    ])
    confidence = models.FloatField(default=0.0)
    analysis_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Customer Sentiment"
        verbose_name_plural = "Customer Sentiments"
    
    def __str__(self):
        return f"Sentiment: {self.sentiment} for Order #{self.order.id}"


class DemandPrediction(models.Model):
    """Store demand predictions"""
    
    product_type = models.CharField(max_length=100)
    predicted_demand = models.CharField(max_length=50)
    confidence = models.FloatField(default=0.0)
    prediction_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Demand Prediction"
        verbose_name_plural = "Demand Predictions"
    
    def __str__(self):
        return f"Demand prediction for {self.product_type}"



