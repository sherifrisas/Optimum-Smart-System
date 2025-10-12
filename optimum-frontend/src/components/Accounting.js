import React, { useState } from 'react';
import './Accounting.css';

const Accounting = ({ orders }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showDetails, setShowDetails] = useState(false);

  // Mock pricing data (in real app, this would come from backend)
  const getOrderValue = (order) => {
    const basePrices = {
      'laptop': 15000,
      'iphone': 25000,
      'desktop': 12000,
      'tablet': 8000
    };
    
    const productType = order.productType.toLowerCase();
    let basePrice = 10000; // default price
    
    for (const [key, price] of Object.entries(basePrices)) {
      if (productType.includes(key)) {
        basePrice = price;
        break;
      }
    }
    
    return basePrice * order.quantity;
  };

  const getSupplierCost = (order) => {
    // Mock supplier cost (80% of order value)
    return getOrderValue(order) * 0.8;
  };

  const getProfit = (order) => {
    return getOrderValue(order) - getSupplierCost(order);
  };

  const calculateFinancials = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + getOrderValue(order), 0);
    const totalCosts = orders.reduce((sum, order) => sum + getSupplierCost(order), 0);
    const totalProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      profitMargin,
      orderCount: orders.length
    };
  };

  const getOrdersByStatus = () => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  };

  const getTopProducts = () => {
    const productCounts = orders.reduce((acc, order) => {
      acc[order.productType] = (acc[order.productType] || 0) + order.quantity;
      return acc;
    }, {});

    return Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([product, count]) => ({ product, count }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const financials = calculateFinancials();
  const ordersByStatus = getOrdersByStatus();
  const topProducts = getTopProducts();

  const statusLabels = {
    'pending': 'Pending',
    'in-preparation': 'In Preparation',
    'ready': 'Ready',
    'delivered': 'Delivered'
  };

  return (
    <div className="accounting">
      <div className="page-header">
        <h2>Accounting & Financials</h2>
        <p>Track revenue, costs, and profitability</p>
      </div>

      <div className="period-selector">
        <label htmlFor="period">Time Period:</label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="financial-overview">
        <div className="financial-card revenue">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(financials.totalRevenue)}</div>
            <div className="card-label">Total Revenue</div>
          </div>
        </div>

        <div className="financial-card costs">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(financials.totalCosts)}</div>
            <div className="card-label">Total Costs</div>
          </div>
        </div>

        <div className="financial-card profit">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(financials.totalProfit)}</div>
            <div className="card-label">Net Profit</div>
          </div>
        </div>

        <div className="financial-card margin">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-value">{financials.profitMargin.toFixed(1)}%</div>
            <div className="card-label">Profit Margin</div>
          </div>
        </div>
      </div>

      <div className="accounting-content">
        <div className="accounting-section">
          <div className="section-header">
            <h3>Order Status Distribution</h3>
          </div>
          <div className="status-breakdown">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="status-item">
                <div className="status-info">
                  <span className="status-label">{statusLabels[status]}</span>
                  <span className="status-count">{count} orders</span>
                </div>
                <div className="status-bar">
                  <div 
                    className="status-fill"
                    style={{ 
                      width: `${(count / financials.orderCount) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="accounting-section">
          <div className="section-header">
            <h3>Top Products by Quantity</h3>
          </div>
          <div className="top-products">
            {topProducts.length === 0 ? (
              <p className="no-data">No products data available</p>
            ) : (
              topProducts.map((item, index) => (
                <div key={item.product} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{item.product}</div>
                    <div className="product-quantity">{item.count} units sold</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="detailed-view">
        <div className="section-header">
          <h3>Detailed Order Analysis</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="toggle-button"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDetails && (
          <div className="orders-table">
            <div className="table-header">
              <div className="table-cell">Order #</div>
              <div className="table-cell">Customer</div>
              <div className="table-cell">Product</div>
              <div className="table-cell">Qty</div>
              <div className="table-cell">Revenue</div>
              <div className="table-cell">Cost</div>
              <div className="table-cell">Profit</div>
              <div className="table-cell">Status</div>
            </div>
            
            {orders.map(order => (
              <div key={order.id} className="table-row">
                <div className="table-cell">#{order.id}</div>
                <div className="table-cell">{order.customerName}</div>
                <div className="table-cell">{order.productType}</div>
                <div className="table-cell">{order.quantity}</div>
                <div className="table-cell revenue">{formatCurrency(getOrderValue(order))}</div>
                <div className="table-cell cost">{formatCurrency(getSupplierCost(order))}</div>
                <div className="table-cell profit">{formatCurrency(getProfit(order))}</div>
                <div className="table-cell">
                  <span className={`status-badge status-${order.status.replace('-', '-')}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="export-section">
        <button className="export-button">
          📄 Export to Excel
        </button>
        <button className="export-button">
          📊 Generate Report
        </button>
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

export default Accounting;
