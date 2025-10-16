# Optimum Smart System

An AI-powered order management platform built with React and Django.

## 🚀 Features

- **Order Management**: Create, track, and manage customer orders
- **Customer Management**: Store and manage customer information
- **Supplier Communication**: Real-time messaging with suppliers
- **Financial Dashboard**: Track revenue, costs, and profitability
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live order status updates

## 🛠️ Technology Stack

### Frontend
- React 19.2.0
- Axios for API calls
- CSS3 with modern styling
- Responsive design

### Backend
- Django 5.2.7
- Django REST Framework
- SQLite database (development)
- PostgreSQL ready (production)

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.9+
- Git

## 🚀 Quick Start

> **Note**: If you encounter a "Failed to load orders" error, please check the [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md) for solutions. This is typically caused by data structure mismatches between the frontend and backend that have been addressed in recent updates.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Optimum_Smart-System
```

### 2. Backend Setup
```bash
cd optimum-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed initial data
python manage.py seed_data

# Start development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd optimum-frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
Optimum_Smart-System/
├── optimum-backend/          # Django backend
│   ├── customers/           # Customer management
│   ├── suppliers/           # Supplier management
│   ├── orders/              # Order management
│   └── optimum_system/      # Django settings
├── optimum-frontend/        # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   └── public/
└── docs/                    # Documentation
```

## 🔧 API Endpoints

### Orders
- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/` - Update order
- `PATCH /api/orders/{id}/update_status/` - Update order status
- `POST /api/orders/{id}/send_message/` - Send message
- `GET /api/orders/dashboard_stats/` - Get dashboard statistics

### Customers
- `GET /api/customers/` - List all customers
- `POST /api/customers/` - Create new customer
- `GET /api/customers/{id}/` - Get customer details
- `PATCH /api/customers/{id}/` - Update customer
- `GET /api/customers/search/` - Search customers

### Suppliers
- `GET /api/suppliers/` - List all suppliers
- `POST /api/suppliers/` - Create new supplier
- `GET /api/suppliers/{id}/` - Get supplier details
- `PATCH /api/suppliers/{id}/` - Update supplier
- `GET /api/suppliers/top_rated/` - Get top-rated suppliers

## 🎯 Usage

1. **Dashboard**: View order statistics and recent activity
2. **New Order**: Create new customer orders
3. **Orders**: Manage and track existing orders
4. **Suppliers**: Communicate with suppliers
5. **Accounting**: View financial reports and analytics

## 🔐 Admin Access

Access the Django admin panel at `http://localhost:8000/admin/`

Default credentials:
- Username: `admin`
- Password: `admin123`

## 🧪 Testing

### Troubleshooting Common Issues

If you encounter a "Failed to load orders" error:

1. Check that both backend and frontend servers are running
2. Verify the backend is accessible at `http://localhost:8000/api/orders/`
3. Check browser console for any error messages
4. Refer to [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md) for detailed solutions

You can also use the [restart_system.bat](restart_system.bat) script to easily restart both servers.

### Backend Tests
```bash
cd optimum-backend
python manage.py test
```

### Frontend Tests
```bash
cd optimum-frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations
4. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 🗺️ Roadmap

- [ ] AI/NLP integration for order analysis
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment integration
