from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from customers.models import Customer
from suppliers.models import Supplier
from orders.models import Order, OrderMessage

class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')
        
        # Create customers
        customers_data = [
            {
                'name': 'Ahmed Hassan',
                'phone_number': '+20 100 123 4567',
                'email': 'ahmed.hassan@email.com',
                'address': 'Cairo, Egypt'
            },
            {
                'name': 'Fatima Mohamed',
                'phone_number': '+20 111 234 5678',
                'email': 'fatima.mohamed@email.com',
                'address': 'Alexandria, Egypt'
            },
            {
                'name': 'Omar Ali',
                'phone_number': '+20 122 345 6789',
                'email': 'omar.ali@email.com',
                'address': 'Giza, Egypt'
            },
            {
                'name': 'Nour Ibrahim',
                'phone_number': '+20 133 456 7890',
                'email': 'nour.ibrahim@email.com',
                'address': 'Sharm El Sheikh, Egypt'
            }
        ]
        
        customers = []
        for customer_data in customers_data:
            customer, created = Customer.objects.get_or_create(
                phone_number=customer_data['phone_number'],
                defaults=customer_data
            )
            customers.append(customer)
            if created:
                self.stdout.write(f'Created customer: {customer.name}')
        
        # Create suppliers
        suppliers_data = [
            {
                'name': 'Tech Solutions Ltd',
                'contact_person': 'Mohamed Tech',
                'email': 'orders@techsolutions.com',
                'phone_number': '+20 100 111 2222',
                'address': 'New Cairo, Egypt',
                'rating': 4.8
            },
            {
                'name': 'Electronics Hub',
                'contact_person': 'Ahmed Electronics',
                'email': 'contact@electronicshub.com',
                'phone_number': '+20 100 333 4444',
                'address': 'Nasr City, Egypt',
                'rating': 4.5
            },
            {
                'name': 'Digital World',
                'contact_person': 'Sara Digital',
                'email': 'sales@digitalworld.com',
                'phone_number': '+20 100 555 6666',
                'address': 'Maadi, Egypt',
                'rating': 4.2
            }
        ]
        
        suppliers = []
        for supplier_data in suppliers_data:
            supplier, created = Supplier.objects.get_or_create(
                email=supplier_data['email'],
                defaults=supplier_data
            )
            suppliers.append(supplier)
            if created:
                self.stdout.write(f'Created supplier: {supplier.name}')
        
        # Create orders
        orders_data = [
            {
                'customer': customers[0],
                'supplier': suppliers[0],
                'product_type': 'Laptop Dell XPS 15',
                'quantity': 2,
                'unit_price': 15000.00,
                'delivery_date': date.today() + timedelta(days=10),
                'status': 'pending'
            },
            {
                'customer': customers[1],
                'supplier': suppliers[1],
                'product_type': 'iPhone 15 Pro',
                'quantity': 1,
                'unit_price': 25000.00,
                'delivery_date': date.today() + timedelta(days=5),
                'status': 'in-preparation'
            },
            {
                'customer': customers[2],
                'supplier': suppliers[2],
                'product_type': 'Desktop Gaming PC',
                'quantity': 1,
                'unit_price': 12000.00,
                'delivery_date': date.today() + timedelta(days=7),
                'status': 'ready'
            },
            {
                'customer': customers[3],
                'supplier': suppliers[0],
                'product_type': 'iPad Pro 12.9',
                'quantity': 1,
                'unit_price': 8000.00,
                'delivery_date': date.today() + timedelta(days=3),
                'status': 'delivered'
            }
        ]
        
        for order_data in orders_data:
            order, created = Order.objects.get_or_create(
                customer=order_data['customer'],
                product_type=order_data['product_type'],
                defaults=order_data
            )
            if created:
                self.stdout.write(f'Created order: #{order.id} - {order.customer.name}')
                
                # Create initial system message
                OrderMessage.objects.create(
                    order=order,
                    message_type='system',
                    content=f'Order #{order.id} has been created and sent to {order.supplier.name}'
                )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database!')
        )
