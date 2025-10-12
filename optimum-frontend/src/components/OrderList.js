import React, { useState } from 'react';
import './OrderList.css';

const OrderList = ({ orders, onStatusUpdate }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-preparation', label: 'In Preparation' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const statusLabels = {
    'pending': 'Pending',
    'in-preparation': 'In Preparation',
    'ready': 'Ready',
    'delivered': 'Delivered'
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    onStatusUpdate(orderId, newStatus);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.replace('-', '-')}`;
  };

  return (
    <div className="order-list">
      <div className="page-header">
        <h2>Order Management</h2>
        <p>Manage and track all customer orders</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="deliveryDate">Delivery Date</option>
            <option value="customerName">Customer Name</option>
            <option value="productType">Product Type</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortOrder">Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="filter-select"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="orders-container">
        {sortedOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found matching your criteria.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {sortedOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Order #{order.id}</div>
                  <span className={getStatusClass(order.status)}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="detail-row">
                    <span className="label">Customer:</span>
                    <span className="value">{order.customerName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span className="value">{order.phoneNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Product:</span>
                    <span className="value">{order.productType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Quantity:</span>
                    <span className="value">{order.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Delivery Date:</span>
                    <span className="value">{formatDate(order.deliveryDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Created:</span>
                    <span className="value">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <div className="status-selector">
                    <label htmlFor={`status-${order.id}`}>Update Status:</label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-preparation">In Preparation</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="orders-summary">
        <p>Showing {sortedOrders.length} of {orders.length} orders</p>
      </div>
    </div>
  );
};

export default OrderList;
