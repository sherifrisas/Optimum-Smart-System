from rest_framework import serializers
from .models import Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            'id', 'name', 'contact_person', 'email', 'phone_number', 
            'address', 'rating', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Rating must be between 0.0 and 5.0")
        return value
