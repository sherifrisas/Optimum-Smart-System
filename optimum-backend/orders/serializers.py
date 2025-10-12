from rest_framework import serializers
from .models import Order, OrderMessage
from customers.serializers import CustomerSerializer
from suppliers.serializers import SupplierSerializer

class OrderMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderMessage
        fields = ['id', 'message_type', 'content', 'sender', 'created_at']
        read_only_fields = ['id', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.IntegerField(write_only=True)
    supplier = SupplierSerializer(read_only=True)
    supplier_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    messages = OrderMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_id', 'supplier', 'supplier_id',
            'product_type', 'quantity', 'unit_price', 'total_amount',
            'delivery_date', 'status', 'notes', 'created_at', 'updated_at',
            'messages'
        ]
        read_only_fields = ['id', 'total_amount', 'created_at', 'updated_at']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value

    def validate_unit_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Unit price must be greater than 0")
        return value

    def validate_delivery_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Delivery date cannot be in the past")
        return value

class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order lists"""
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_phone', 'supplier_name',
            'product_type', 'quantity', 'total_amount', 'delivery_date',
            'status', 'created_at'
        ]
