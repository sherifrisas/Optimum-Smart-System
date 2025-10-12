from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone_number', 'email', 'address', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_phone_number(self, value):
        # Additional phone number validation
        if len(value.replace('+', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '')) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")
        return value
