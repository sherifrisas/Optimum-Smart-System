import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import OrderReception from './components/OrderReception';
import OrderList from './components/OrderList';
import SupplierCommunication from './components/SupplierCommunication';
import Dashboard from './components/Dashboard';
import Accounting from './components/Accounting';
import { ordersAPI } from './services/api';

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
        setOrders(response.data.results || response.data);
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
      
      setOrders([response.data, ...orders]);
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
          <button onClick={() => window.location.reload()}>Retry</button>
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
