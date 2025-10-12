from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Supplier(models.Model):
    name = models.CharField(max_length=200, help_text="Supplier's company name")
    contact_person = models.CharField(max_length=200, help_text="Primary contact person")
    email = models.EmailField(help_text="Supplier's email address")
    phone_number = models.CharField(max_length=20, help_text="Supplier's phone number")
    address = models.TextField(help_text="Supplier's address")
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        default=0.0,
        help_text="Supplier rating (0.0 to 5.0)"
    )
    is_active = models.BooleanField(default=True, help_text="Whether supplier is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']
        verbose_name = 'Supplier'
        verbose_name_plural = 'Suppliers'

    def __str__(self):
        return f"{self.name} (Rating: {self.rating})"