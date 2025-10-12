from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Supplier
from .serializers import SupplierSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.filter(is_active=True)
    serializer_class = SupplierSerializer

    def get_queryset(self):
        queryset = Supplier.objects.filter(is_active=True)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(contact_person__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset.order_by('-rating', 'name')

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top-rated suppliers"""
        limit = int(request.query_params.get('limit', 5))
        suppliers = Supplier.objects.filter(is_active=True).order_by('-rating')[:limit]
        serializer = self.get_serializer(suppliers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search suppliers by name, contact person, or email"""
        search_term = request.query_params.get('q', '')
        if not search_term:
            return Response({'error': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        suppliers = Supplier.objects.filter(
            Q(name__icontains=search_term) |
            Q(contact_person__icontains=search_term) |
            Q(email__icontains=search_term),
            is_active=True
        )[:10]  # Limit to 10 results
        
        serializer = self.get_serializer(suppliers, many=True)
        return Response(serializer.data)