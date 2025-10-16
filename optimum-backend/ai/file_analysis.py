"""
File and Image Analysis for Optimum Smart System
Advanced AI features for file processing
"""

import os
import base64
import magic
from PIL import Image
import io
from typing import Dict, Any, Optional
from django.core.files.uploadedfile import UploadedFile
from ai_services import OrderAnalysisAI


class FileAnalysisAI:
    """AI-powered file and image analysis"""
    
    def __init__(self):
        self.order_ai = OrderAnalysisAI()
        self.supported_image_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        self.supported_document_types = ['application/pdf', 'text/plain', 'application/msword', 
                                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    def analyze_uploaded_file(self, uploaded_file: UploadedFile) -> Dict[str, Any]:
        """
        Analyze uploaded file and extract order information
        """
        try:
            # Get file type
            file_type = magic.from_buffer(uploaded_file.read(1024), mime=True)
            uploaded_file.seek(0)  # Reset file pointer
            
            if file_type in self.supported_image_types:
                return self._analyze_image(uploaded_file)
            elif file_type in self.supported_document_types:
                return self._analyze_document(uploaded_file)
            else:
                return self._get_unsupported_file_response(file_type)
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to analyze file'
            }
    
    def _analyze_image(self, image_file: UploadedFile) -> Dict[str, Any]:
        """
        Analyze image using OCR and AI vision
        """
        try:
            # Convert image to base64 for AI processing
            image_data = image_file.read()
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            # Use AI to analyze image content
            analysis_prompt = f"""
            Analyze this image and extract any order-related information:
            
            Image Data: {image_base64[:100]}... (base64 encoded)
            
            Look for:
            - Product names or descriptions
            - Quantities mentioned
            - Customer information
            - Delivery dates
            - Any text or labels visible
            
            Return JSON format:
            {{
                "product_type": "extracted product name or null",
                "quantity": "extracted number or 1",
                "customer_name": "extracted name or null",
                "delivery_date": "extracted date or null",
                "urgency": "high/medium/low based on visual cues",
                "sentiment": "positive/neutral/negative",
                "confidence": "0.0 to 1.0",
                "image_analysis": "description of what you see in the image",
                "extracted_text": "any text found in the image"
            }}
            """
            
            # For now, use fallback analysis since we don't have vision API
            return self._fallback_image_analysis(image_file)
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to analyze image'
            }
    
    def _analyze_document(self, document_file: UploadedFile) -> Dict[str, Any]:
        """
        Analyze document content for order information
        """
        try:
            # Read document content
            content = document_file.read().decode('utf-8', errors='ignore')
            
            # Use AI to analyze document content
            analysis_result = self.order_ai.analyze_order_text(content)
            
            # Add document-specific information
            analysis_result.update({
                'file_type': 'document',
                'content_length': len(content),
                'extracted_text': content[:500] + '...' if len(content) > 500 else content
            })
            
            return {
                'success': True,
                'analysis': analysis_result,
                'message': 'Document analyzed successfully'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to analyze document'
            }
    
    def _fallback_image_analysis(self, image_file: UploadedFile) -> Dict[str, Any]:
        """
        Fallback image analysis using basic image processing
        """
        try:
            # Basic image analysis
            image = Image.open(image_file)
            width, height = image.size
            
            # Simple analysis based on image properties
            analysis = {
                'product_type': 'Product from Image',
                'quantity': 1,
                'customer_name': None,
                'delivery_date': None,
                'urgency': 'medium',
                'sentiment': 'neutral',
                'confidence': 0.2,
                'image_analysis': f'Image dimensions: {width}x{height} pixels',
                'extracted_text': 'No text extraction available',
                'file_type': 'image',
                'image_size': f'{width}x{height}'
            }
            
            return {
                'success': True,
                'analysis': analysis,
                'message': 'Image analyzed (basic analysis)'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to analyze image'
            }
    
    def _get_unsupported_file_response(self, file_type: str) -> Dict[str, Any]:
        """
        Handle unsupported file types
        """
        return {
            'success': False,
            'error': f'Unsupported file type: {file_type}',
            'message': 'Please upload an image (JPG, PNG, GIF) or document (PDF, TXT, DOC)',
            'supported_types': self.supported_image_types + self.supported_document_types
        }
    
    def get_supported_file_types(self) -> Dict[str, Any]:
        """
        Get list of supported file types
        """
        return {
            'images': self.supported_image_types,
            'documents': self.supported_document_types,
            'max_size_mb': 10,
            'formats': {
                'images': 'JPG, PNG, GIF, WebP',
                'documents': 'PDF, TXT, DOC, DOCX'
            }
        }
