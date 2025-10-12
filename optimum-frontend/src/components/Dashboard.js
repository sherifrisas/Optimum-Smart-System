import React from 'react';
import './Dashboard.css';

const Dashboard = ({ orders }) => {
  const getStatusCounts = () => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  };

  const getTotalQuantity = () => {
    return orders.reduce((total, order) => total + order.quantity, 0);
  };

  const getRecentOrders = () => {
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getUpcomingDeliveries = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return orders.filter(order => {
      const deliveryDate = new Date(order.deliveryDate);
      return deliveryDate >= today && deliveryDate <= nextWeek;
    }).sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
  };

  const statusCounts = getStatusCounts();
  const totalQuantity = getTotalQuantity();
  const recentOrders = getRecentOrders();
  const upcomingDeliveries = getUpcomingDeliveries();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.replace('-', '-')}`;
  };

  const statusLabels = {
    'pending': 'Pending',
    'in-preparation': 'In Preparation',
    'ready': 'Ready',
    'delivered': 'Delivered'
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your order management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{totalQuantity}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{statusCounts.pending || 0}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-number">{upcomingDeliveries.length}</div>
            <div className="stat-label">Upcoming Deliveries</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Order Status Distribution</h3>
          </div>
          <div className="status-distribution">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="status-item">
                <div className="status-info">
                  <span className={getStatusClass(status)}>
                    {statusLabels[status]}
                  </span>
                  <span className="status-count">{count}</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-fill"
                    style={{ 
                      width: `${(count / orders.length) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Orders</h3>
          </div>
          <div className="recent-orders">
            {recentOrders.length === 0 ? (
              <p className="no-data">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="recent-order-item">
                  <div className="order-info">
                    <div className="order-customer">{order.customerName}</div>
                    <div className="order-product">{order.productType}</div>
                    <div className="order-time">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="order-status">
                    <span className={getStatusClass(order.status)}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Upcoming Deliveries</h3>
          </div>
          <div className="upcoming-deliveries">
            {upcomingDeliveries.length === 0 ? (
              <p className="no-data">No upcoming deliveries</p>
            ) : (
              upcomingDeliveries.map(order => (
                <div key={order.id} className="delivery-item">
                  <div className="delivery-info">
                    <div className="delivery-customer">{order.customerName}</div>
                    <div className="delivery-product">{order.productType}</div>
                    <div className="delivery-quantity">Qty: {order.quantity}</div>
                  </div>
                  <div className="delivery-date">
                    {formatDate(order.deliveryDate)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    'pending': '#ffc107',
    'in-preparation': '#17a2b8',
    'ready': '#28a745',
    'delivered': '#6c757d'
  };
  return colors[status] || '#6c757d';
};

export default Dashboard;
