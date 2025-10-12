from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        queryset = Customer.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(phone_number__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search customers by name, phone, or email"""
        search_term = request.query_params.get('q', '')
        if not search_term:
            return Response({'error': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        customers = Customer.objects.filter(
            Q(name__icontains=search_term) |
            Q(phone_number__icontains=search_term) |
            Q(email__icontains=search_term)
        )[:10]  # Limit to 10 results
        
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)