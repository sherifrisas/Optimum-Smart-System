from django.db import models
from django.core.validators import MinValueValidator
from customers.models import Customer
from suppliers.models import Supplier

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in-preparation', 'In Preparation'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='orders',
        help_text="Customer who placed the order"
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        help_text="Supplier assigned to fulfill the order"
    )
    product_type = models.CharField(max_length=200, help_text="Type of product ordered")
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Quantity of products ordered"
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Price per unit"
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Total order amount"
    )
    delivery_date = models.DateField(help_text="Expected delivery date")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current order status"
    )
    notes = models.TextField(blank=True, null=True, help_text="Additional order notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order #{self.id} - {self.customer.name} ({self.product_type})"

    def save(self, *args, **kwargs):
        # Calculate total amount before saving
        self.total_amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)

class OrderMessage(models.Model):
    MESSAGE_TYPES = [
        ('system', 'System'),
        ('outgoing', 'Outgoing'),
        ('incoming', 'Incoming'),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='messages',
        help_text="Order this message belongs to"
    )
    message_type = models.CharField(
        max_length=10,
        choices=MESSAGE_TYPES,
        help_text="Type of message"
    )
    content = models.TextField(help_text="Message content")
    sender = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Message sender (if not system)"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Order Message'
        verbose_name_plural = 'Order Messages'

    def __str__(self):
        return f"Message for Order #{self.order.id} - {self.message_type}"