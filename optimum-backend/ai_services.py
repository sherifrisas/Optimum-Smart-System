"""
AI Services for Optimum Smart System
Phase 2: AI-powered order analysis and insights
"""

import openai
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from django.conf import settings
import os
from dotenv import load_dotenv

load_dotenv()

class OrderAnalysisAI:
    """AI-powered order analysis and insights"""
    
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.getenv('OPENAI_API_KEY', 'demo_key')
        )
    
    def analyze_order_text(self, order_text: str) -> Dict[str, Any]:
        """
        Analyze unstructured order text and extract structured information
        """
        if not order_text.strip():
            return self._get_default_analysis()
        
        try:
            # Use OpenAI to analyze the order text
            prompt = f"""
            Analyze this customer order text and extract structured information:
            
            Order Text: "{order_text}"
            
            Please extract and return a JSON object with the following structure:
            {{
                "customer_name": "extracted name or null",
                "product_type": "extracted product name",
                "quantity": "extracted number or 1",
                "delivery_date": "extracted date in YYYY-MM-DD format or null",
                "urgency": "high/medium/low based on text analysis",
                "sentiment": "positive/neutral/negative",
                "confidence": "0.0 to 1.0 confidence score",
                "suggested_supplier": "best supplier category based on product",
                "estimated_price": "estimated price range or null",
                "notes": "any additional insights"
            }}
            
            Rules:
            - If information is not clear, use null
            - For quantity, default to 1 if not specified
            - For urgency, analyze words like "urgent", "asap", "rush"
            - For sentiment, analyze overall tone
            - For supplier, suggest: "Electronics Hub", "Tech Solutions Ltd", or "Digital World"
            - Return only valid JSON, no additional text
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"AI Analysis Error: {e}")
            return self._get_fallback_analysis(order_text)
    
    def get_smart_recommendations(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate smart recommendations based on order data
        """
        try:
            prompt = f"""
            Based on this order data, provide smart recommendations:
            
            Order Data: {json.dumps(order_data, indent=2)}
            
            Provide recommendations in JSON format:
            {{
                "supplier_recommendation": "best supplier with reasoning",
                "pricing_insight": "pricing analysis and suggestions",
                "delivery_optimization": "delivery timing recommendations",
                "upsell_opportunities": "suggested additional products",
                "risk_assessment": "potential risks and mitigation",
                "profit_optimization": "ways to improve profit margin"
            }}
            
            Return only valid JSON, no additional text.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.4
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Recommendations Error: {e}")
            return self._get_default_recommendations()
    
    def analyze_customer_sentiment(self, messages: List[str]) -> Dict[str, Any]:
        """
        Analyze customer-supplier conversation sentiment
        """
        if not messages:
            return {"sentiment": "neutral", "confidence": 0.0, "insights": []}
        
        try:
            conversation = " ".join(messages)
            prompt = f"""
            Analyze the sentiment and provide insights for this customer-supplier conversation:
            
            Conversation: "{conversation}"
            
            Return JSON with:
            {{
                "sentiment": "positive/neutral/negative",
                "confidence": "0.0 to 1.0",
                "customer_satisfaction": "high/medium/low",
                "key_issues": ["list of any issues mentioned"],
                "suggested_actions": ["recommended actions to take"],
                "escalation_needed": "true/false"
            }}
            
            Return only valid JSON.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Sentiment Analysis Error: {e}")
            return {"sentiment": "neutral", "confidence": 0.0, "insights": []}
    
    def predict_demand(self, historical_data: List[Dict]) -> Dict[str, Any]:
        """
        Predict future demand based on historical order data
        """
        try:
            # Simple demand prediction based on patterns
            if not historical_data:
                return {"prediction": "insufficient_data", "confidence": 0.0}
            
            # Analyze patterns in the data
            product_counts = {}
            monthly_trends = {}
            
            for order in historical_data:
                product = order.get('product_type', 'Unknown')
                product_counts[product] = product_counts.get(product, 0) + 1
                
                # Simple monthly trend analysis
                month = order.get('created_at', '')[:7]  # YYYY-MM
                monthly_trends[month] = monthly_trends.get(month, 0) + 1
            
            # Generate predictions
            top_products = sorted(product_counts.items(), key=lambda x: x[1], reverse=True)[:3]
            
            return {
                "top_products": top_products,
                "monthly_trend": monthly_trends,
                "predicted_demand": "increasing" if len(monthly_trends) > 1 else "stable",
                "recommendations": [
                    f"Focus on {product} - high demand" for product, count in top_products[:2]
                ]
            }
            
        except Exception as e:
            print(f"Demand Prediction Error: {e}")
            return {"prediction": "error", "confidence": 0.0}
    
    def _get_default_analysis(self) -> Dict[str, Any]:
        """Default analysis when no text is provided"""
        return {
            "customer_name": None,
            "product_type": "General Product",
            "quantity": 1,
            "delivery_date": None,
            "urgency": "medium",
            "sentiment": "neutral",
            "confidence": 0.0,
            "suggested_supplier": "Tech Solutions Ltd",
            "estimated_price": None,
            "notes": "No text provided for analysis"
        }
    
    def _get_fallback_analysis(self, order_text: str) -> Dict[str, Any]:
        """Fallback analysis using simple text processing"""
        text_lower = order_text.lower()
        
        # Simple keyword extraction
        urgency = "low"
        if any(word in text_lower for word in ["urgent", "asap", "rush", "immediately"]):
            urgency = "high"
        elif any(word in text_lower for word in ["soon", "quickly", "fast"]):
            urgency = "medium"
        
        # Extract quantity
        quantity_match = re.search(r'(\d+)', order_text)
        quantity = int(quantity_match.group(1)) if quantity_match else 1
        
        # Simple product detection
        product_type = "General Product"
        if any(word in text_lower for word in ["laptop", "computer", "pc"]):
            product_type = "Laptop"
        elif any(word in text_lower for word in ["phone", "mobile", "iphone", "samsung"]):
            product_type = "Mobile Phone"
        elif any(word in text_lower for word in ["tablet", "ipad"]):
            product_type = "Tablet"
        
        return {
            "customer_name": None,
            "product_type": product_type,
            "quantity": quantity,
            "delivery_date": None,
            "urgency": urgency,
            "sentiment": "neutral",
            "confidence": 0.3,
            "suggested_supplier": "Tech Solutions Ltd",
            "estimated_price": None,
            "notes": "Fallback analysis used"
        }
    
    def _get_default_recommendations(self) -> Dict[str, Any]:
        """Default recommendations when AI fails"""
        return {
            "supplier_recommendation": "Tech Solutions Ltd - Reliable general supplier",
            "pricing_insight": "Standard pricing expected",
            "delivery_optimization": "Standard delivery timeline",
            "upsell_opportunities": "Consider accessories or extended warranty",
            "risk_assessment": "Low risk - standard order",
            "profit_optimization": "Standard margin expected"
        }


class AIInsights:
    """AI-powered business insights and analytics"""
    
    def __init__(self):
        self.order_ai = OrderAnalysisAI()
    
    def generate_business_insights(self, orders_data: List[Dict]) -> Dict[str, Any]:
        """
        Generate comprehensive business insights from order data
        """
        if not orders_data:
            return {"insights": [], "recommendations": []}
        
        try:
            # Analyze order patterns
            total_orders = len(orders_data)
            total_revenue = sum(float(order.get('total_amount', 0)) for order in orders_data)
            
            # Status distribution
            status_counts = {}
            for order in orders_data:
                status = order.get('status', 'unknown')
                status_counts[status] = status_counts.get(status, 0) + 1
            
            # Product popularity
            product_counts = {}
            for order in orders_data:
                product = order.get('product_type', 'Unknown')
                product_counts[product] = product_counts.get(product, 0) + 1
            
            # Generate insights
            insights = []
            recommendations = []
            
            # Revenue insights
            avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
            insights.append(f"Average order value: ${avg_order_value:.2f}")
            
            # Status insights
            pending_orders = status_counts.get('pending', 0)
            if pending_orders > total_orders * 0.3:
                insights.append(f"High pending orders: {pending_orders}/{total_orders}")
                recommendations.append("Consider increasing processing capacity")
            
            # Product insights
            top_product = max(product_counts.items(), key=lambda x: x[1]) if product_counts else None
            if top_product:
                insights.append(f"Most popular product: {top_product[0]} ({top_product[1]} orders)")
                recommendations.append(f"Stock more {top_product[0]} inventory")
            
            return {
                "insights": insights,
                "recommendations": recommendations,
                "metrics": {
                    "total_orders": total_orders,
                    "total_revenue": total_revenue,
                    "avg_order_value": avg_order_value,
                    "status_distribution": status_counts,
                    "product_popularity": product_counts
                }
            }
            
        except Exception as e:
            print(f"Business Insights Error: {e}")
            return {"insights": ["Error generating insights"], "recommendations": []}



