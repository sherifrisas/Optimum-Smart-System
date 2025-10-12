from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Order, OrderMessage
from .serializers import OrderSerializer, OrderListSerializer, OrderMessageSerializer
from customers.models import Customer
from suppliers.models import Supplier

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('customer', 'supplier').prefetch_related('messages')
    serializer_class = OrderSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.select_related('customer', 'supplier').prefetch_related('messages')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(customer__name__icontains=search) |
                Q(product_type__icontains=search) |
                Q(customer__phone_number__icontains=search)
            )
        
        return queryset.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """Create a new order with automatic customer creation if needed"""
        data = request.data.copy()
        
        # Handle customer creation/retrieval
        customer_data = data.get('customer', {})
        if customer_data:
            customer, created = Customer.objects.get_or_create(
                phone_number=customer_data.get('phone_number'),
                defaults={
                    'name': customer_data.get('name'),
                    'email': customer_data.get('email', ''),
                    'address': customer_data.get('address', '')
                }
            )
            data['customer_id'] = customer.id
        
        # Auto-assign supplier based on product type (mock logic)
        if not data.get('supplier_id'):
            product_type = data.get('product_type', '').lower()
            if 'laptop' in product_type:
                supplier = Supplier.objects.filter(name__icontains='Tech Solutions').first()
            elif 'iphone' in product_type:
                supplier = Supplier.objects.filter(name__icontains='Electronics').first()
            else:
                supplier = Supplier.objects.filter(is_active=True).order_by('-rating').first()
            
            if supplier:
                data['supplier_id'] = supplier.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Create initial system message
        OrderMessage.objects.create(
            order=order,
            message_type='system',
            content=f'Order #{order.id} has been created and sent to {order.supplier.name if order.supplier else "supplier"}'
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = order.status
        order.status = new_status
        order.save()
        
        # Create status update message
        OrderMessage.objects.create(
            order=order,
            message_type='system',
            content=f'Order status updated from {old_status} to {new_status}'
        )
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message for an order"""
        order = self.get_object()
        content = request.data.get('content')
        message_type = request.data.get('type', 'outgoing')
        
        if not content:
            return Response(
                {'error': 'Message content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message = OrderMessage.objects.create(
            order=order,
            message_type=message_type,
            content=content,
            sender=request.data.get('sender', '')
        )
        
        serializer = OrderMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard statistics"""
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        in_preparation_orders = Order.objects.filter(status='in-preparation').count()
        ready_orders = Order.objects.filter(status='ready').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        
        # Calculate total revenue and profit
        total_revenue = Order.objects.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        # Mock profit calculation (20% margin)
        total_profit = total_revenue * 0.2
        
        # Upcoming deliveries (next 7 days)
        upcoming_date = timezone.now().date() + timedelta(days=7)
        upcoming_deliveries = Order.objects.filter(
            delivery_date__lte=upcoming_date,
            delivery_date__gte=timezone.now().date()
        ).count()
        
        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'in_preparation_orders': in_preparation_orders,
            'ready_orders': ready_orders,
            'delivered_orders': delivered_orders,
            'total_revenue': total_revenue,
            'total_profit': total_profit,
            'upcoming_deliveries': upcoming_deliveries
        })

    @action(detail=False, methods=['get'])
    def recent_orders(self, request):
        """Get recent orders for dashboard"""
        limit = int(request.query_params.get('limit', 5))
        orders = Order.objects.select_related('customer', 'supplier').order_by('-created_at')[:limit]
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)