"""
AI Serializers for Optimum Smart System
"""

from rest_framework import serializers
from .models import AIAnalysis, CustomerSentiment, DemandPrediction


class AIAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for AI Analysis"""
    
    class Meta:
        model = AIAnalysis
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class CustomerSentimentSerializer(serializers.ModelSerializer):
    """Serializer for Customer Sentiment"""
    
    class Meta:
        model = CustomerSentiment
        fields = '__all__'
        read_only_fields = ('created_at',)


class DemandPredictionSerializer(serializers.ModelSerializer):
    """Serializer for Demand Prediction"""
    
    class Meta:
        model = DemandPrediction
        fields = '__all__'
        read_only_fields = ('created_at',)


class OrderAnalysisRequestSerializer(serializers.Serializer):
    """Serializer for order analysis requests"""
    order_text = serializers.CharField(max_length=1000, required=False)
    order_id = serializers.IntegerField(required=False)


class BusinessInsightsSerializer(serializers.Serializer):
    """Serializer for business insights"""
    insights = serializers.ListField(child=serializers.CharField())
    recommendations = serializers.ListField(child=serializers.CharField())
    metrics = serializers.DictField()



