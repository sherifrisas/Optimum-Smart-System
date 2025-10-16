"""
AI Views for Optimum Smart System
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
import json

from .models import AIAnalysis, CustomerSentiment, DemandPrediction
from .serializers import (
    AIAnalysisSerializer, 
    CustomerSentimentSerializer, 
    DemandPredictionSerializer,
    OrderAnalysisRequestSerializer,
    BusinessInsightsSerializer
)
from orders.models import Order
from orders.serializers import OrderSerializer
from ai_services import OrderAnalysisAI, AIInsights
from .file_analysis import FileAnalysisAI


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_order_text(request):
    """
    Analyze unstructured order text using AI
    """
    try:
        serializer = OrderAnalysisRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        order_text = serializer.validated_data.get('order_text', '')
        order_id = serializer.validated_data.get('order_id')
        
        # Initialize AI service
        ai_service = OrderAnalysisAI()
        
        # Analyze the text
        analysis_result = ai_service.analyze_order_text(order_text)
        
        # If order_id is provided, save the analysis
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                ai_analysis, created = AIAnalysis.objects.get_or_create(
                    order=order,
                    defaults={
                        'analysis_data': analysis_result,
                        'confidence_score': analysis_result.get('confidence', 0.0)
                    }
                )
                if not created:
                    ai_analysis.analysis_data = analysis_result
                    ai_analysis.confidence_score = analysis_result.get('confidence', 0.0)
                    ai_analysis.save()
            except Order.DoesNotExist:
                pass
        
        return Response({
            'success': True,
            'analysis': analysis_result,
            'message': 'Order text analyzed successfully'
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to analyze order text'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_order_recommendations(request, order_id):
    """
    Get AI-powered recommendations for a specific order
    """
    try:
        order = get_object_or_404(Order, id=order_id)
        order_data = OrderSerializer(order).data
        
        # Initialize AI service
        ai_service = OrderAnalysisAI()
        
        # Get recommendations
        recommendations = ai_service.get_smart_recommendations(order_data)
        
        # Save recommendations to AI analysis
        ai_analysis, created = AIAnalysis.objects.get_or_create(
            order=order,
            defaults={'analysis_data': {}, 'recommendations': recommendations}
        )
        if not created:
            ai_analysis.recommendations = recommendations
            ai_analysis.save()
        
        return Response({
            'success': True,
            'order_id': order_id,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to get recommendations'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_conversation_sentiment(request):
    """
    Analyze sentiment of customer-supplier conversation
    """
    try:
        messages = request.data.get('messages', [])
        order_id = request.data.get('order_id')
        
        if not messages:
            return Response({
                'success': False,
                'message': 'No messages provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Initialize AI service
        ai_service = OrderAnalysisAI()
        
        # Analyze sentiment
        sentiment_result = ai_service.analyze_customer_sentiment(messages)
        
        # Save sentiment analysis
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                CustomerSentiment.objects.create(
                    order=order,
                    sentiment=sentiment_result.get('sentiment', 'neutral'),
                    confidence=sentiment_result.get('confidence', 0.0),
                    analysis_data=sentiment_result
                )
            except Order.DoesNotExist:
                pass
        
        return Response({
            'success': True,
            'sentiment_analysis': sentiment_result
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to analyze sentiment'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_demand_predictions(request):
    """
    Get AI-powered demand predictions
    """
    try:
        # Get historical order data
        orders = Order.objects.all()
        historical_data = [OrderSerializer(order).data for order in orders]
        
        # Initialize AI service
        ai_service = OrderAnalysisAI()
        
        # Get predictions
        predictions = ai_service.predict_demand(historical_data)
        
        # Save predictions
        for product, count in predictions.get('top_products', []):
            DemandPrediction.objects.create(
                product_type=product,
                predicted_demand=predictions.get('predicted_demand', 'stable'),
                confidence=0.8,  # Simple confidence based on data availability
                prediction_data=predictions
            )
        
        return Response({
            'success': True,
            'predictions': predictions
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to get demand predictions'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_business_insights(request):
    """
    Get comprehensive business insights using AI
    """
    try:
        # Get all orders
        orders = Order.objects.all()
        orders_data = [OrderSerializer(order).data for order in orders]
        
        # Initialize AI insights service
        insights_service = AIInsights()
        
        # Generate insights
        insights = insights_service.generate_business_insights(orders_data)
        
        return Response({
            'success': True,
            'insights': insights
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to generate business insights'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_ai_dashboard_data(request):
    """
    Get comprehensive AI dashboard data
    """
    try:
        # Get all orders
        orders = Order.objects.all()
        orders_data = [OrderSerializer(order).data for order in orders]
        
        # Initialize services
        ai_service = OrderAnalysisAI()
        insights_service = AIInsights()
        
        # Generate all AI data
        business_insights = insights_service.generate_business_insights(orders_data)
        demand_predictions = ai_service.predict_demand(orders_data)
        
        # Get recent AI analyses
        recent_analyses = AIAnalysis.objects.select_related('order').order_by('-created_at')[:5]
        analyses_data = [AIAnalysisSerializer(analysis).data for analysis in recent_analyses]
        
        # Get sentiment summaries
        sentiment_summaries = CustomerSentiment.objects.values('sentiment').distinct()
        sentiment_counts = {}
        for sentiment in sentiment_summaries:
            count = CustomerSentiment.objects.filter(sentiment=sentiment['sentiment']).count()
            sentiment_counts[sentiment['sentiment']] = count
        
        return Response({
            'success': True,
            'dashboard_data': {
                'business_insights': business_insights,
                'demand_predictions': demand_predictions,
                'recent_analyses': analyses_data,
                'sentiment_summary': sentiment_counts,
                'ai_metrics': {
                    'total_analyses': AIAnalysis.objects.count(),
                    'total_sentiment_analyses': CustomerSentiment.objects.count(),
                    'total_predictions': DemandPrediction.objects.count()
                }
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to get AI dashboard data'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_uploaded_file(request):
    """
    Analyze uploaded file (image or document) using AI
    """
    try:
        if 'file' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No file uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        
        # Check file size (max 10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({
                'success': False,
                'message': 'File too large. Maximum size is 10MB'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Initialize file analysis AI
        file_ai = FileAnalysisAI()
        
        # Analyze the file
        result = file_ai.analyze_uploaded_file(uploaded_file)
        
        return Response(result)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to analyze uploaded file'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_supported_file_types(request):
    """
    Get list of supported file types for upload
    """
    try:
        file_ai = FileAnalysisAI()
        supported_types = file_ai.get_supported_file_types()
        
        return Response({
            'success': True,
            'supported_types': supported_types
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to get supported file types'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
