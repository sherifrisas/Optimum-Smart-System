import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import OrderReception from './components/OrderReception';
import OrderList from './components/OrderList';
import SupplierCommunication from './components/SupplierCommunication';
import Dashboard from './components/Dashboard';
import Accounting from './components/Accounting';
import AIDashboard from './components/AIDashboard';
import { ordersAPI } from './services/api';

// Helper function to transform snake_case to camelCase
const transformOrderData = (order) => {
  return {
    id: order.id,
    customerName: order.customer_name,
    phoneNumber: order.customer_phone,
    supplierName: order.supplier_name,
    productType: order.product_type,
    quantity: order.quantity,
    totalAmount: order.total_amount,
    deliveryDate: order.delivery_date,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getOrders();
        // Transform the data to match frontend expectations
        const ordersData = response.data.results || response.data;
        const transformedOrders = Array.isArray(ordersData) ? ordersData.map(transformOrderData) : [];
        setOrders(transformedOrders);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleNewOrder = async (orderData) => {
    try {
      const response = await ordersAPI.createOrder({
        customer: {
          name: orderData.customerName,
          phone_number: orderData.phoneNumber
        },
        product_type: orderData.productType,
        quantity: orderData.quantity,
        unit_price: 10000, // Default price, should be calculated
        delivery_date: orderData.deliveryDate
      });
      
      // Transform the new order data
      const transformedOrder = transformOrderData(response.data);
      setOrders([transformedOrder, ...orders]);
      setCurrentView('orders');
    } catch (err) {
      setError('Failed to create order');
      console.error('Error creating order:', err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status');
      console.error('Error updating order status:', err);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} aria-label="Retry loading orders" title="Retry loading orders">
            Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      case 'new-order':
        return <OrderReception onSubmit={handleNewOrder} />;
      case 'orders':
        return <OrderList orders={orders} onStatusUpdate={handleStatusUpdate} />;
      case 'suppliers':
        return <SupplierCommunication orders={orders} />;
      case 'accounting':
        return <Accounting orders={orders} />;
      case 'ai-dashboard':
        return <AIDashboard />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="app-container">
        <Navigation currentView={currentView} onNavigate={setCurrentView} />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;