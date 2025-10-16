"""
AI URLs for Optimum Smart System
"""

from django.urls import path
from . import views

urlpatterns = [
    # AI Analysis endpoints
    path('analyze-order-text/', views.analyze_order_text, name='analyze_order_text'),
    path('recommendations/<int:order_id>/', views.get_order_recommendations, name='get_order_recommendations'),
    path('analyze-sentiment/', views.analyze_conversation_sentiment, name='analyze_sentiment'),
    path('demand-predictions/', views.get_demand_predictions, name='demand_predictions'),
    path('business-insights/', views.get_business_insights, name='business_insights'),
    path('dashboard-data/', views.get_ai_dashboard_data, name='ai_dashboard_data'),
    path('analyze-file/', views.analyze_uploaded_file, name='analyze_uploaded_file'),
    path('supported-file-types/', views.get_supported_file_types, name='supported_file_types'),
]
