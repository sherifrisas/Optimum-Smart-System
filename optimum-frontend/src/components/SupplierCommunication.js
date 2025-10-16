import React, { useState } from 'react';
import './SupplierCommunication.css';

const SupplierCommunication = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock suppliers data
  const suppliers = [
    { id: 1, name: 'Tech Solutions Ltd', email: 'orders@techsolutions.com', phone: '+20 100 111 2222', rating: 4.8 },
    { id: 2, name: 'Electronics Hub', email: 'contact@electronicshub.com', phone: '+20 100 333 4444', rating: 4.5 },
    { id: 3, name: 'Digital World', email: 'sales@digitalworld.com', phone: '+20 100 555 6666', rating: 4.2 }
  ];

  const getOrderSupplier = (order) => {
    // Mock logic to assign supplier based on product type
    if (order.productType && order.productType.toLowerCase().includes('laptop')) {
      return suppliers[0];
    } else if (order.productType && order.productType.toLowerCase().includes('iphone')) {
      return suppliers[1];
    } else {
      return suppliers[2];
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    // Initialize messages if not exists
    if (!messages[order.id]) {
      setMessages(prev => ({
        ...prev,
        [order.id]: [
          {
            id: 1,
            type: 'system',
            message: `Order #${order.id} has been sent to ${getOrderSupplier(order).name}`,
            timestamp: new Date().toISOString()
          }
        ]
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const message = {
        id: Date.now(),
        type: 'outgoing',
        message: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => ({
        ...prev,
        [selectedOrder.id]: [...(prev[selectedOrder.id] || []), message]
      }));

      setNewMessage('');
      
      // Simulate supplier response
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          type: 'incoming',
          message: 'Thank you for your order. We will process it within 24 hours.',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => ({
          ...prev,
          [selectedOrder.id]: [...(prev[selectedOrder.id] || []), response]
        }));
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
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
    <div className="supplier-communication">
      <div className="page-header">
        <h2>Supplier Communication</h2>
        <p>Communicate with suppliers about orders</p>
      </div>

      <div className="communication-layout">
        <div className="orders-panel">
          <div className="panel-header">
            <h3>Orders</h3>
            <span className="order-count">{orders.length} orders</span>
          </div>
          
          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders available</p>
              </div>
            ) : (
              orders.map(order => {
                const supplier = getOrderSupplier(order);
                const orderMessages = messages[order.id] || [];
                const lastMessage = orderMessages[orderMessages.length - 1];
                
                return (
                  <div
                    key={order.id}
                    className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="order-header">
                      <div className="order-id">Order #{order.id}</div>
                      <span className={getStatusClass(order.status)}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    
                    <div className="order-details">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="product-type">{order.productType}</div>
                      <div className="supplier-info">
                        <span className="supplier-name">{supplier.name}</span>
                        <span className="supplier-rating">⭐ {supplier.rating}</span>
                      </div>
                    </div>
                    
                    {lastMessage && (
                      <div className="last-message">
                        <span className="message-preview">
                          {lastMessage.type === 'system' ? 'System: ' : 
                           lastMessage.type === 'outgoing' ? 'You: ' : 
                           'Supplier: '}
                          {lastMessage.message.substring(0, 50)}
                          {lastMessage.message.length > 50 ? '...' : ''}
                        </span>
                        <span className="message-time">
                          {formatTimestamp(lastMessage.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="chat-panel">
          {selectedOrder ? (
            <>
              <div className="chat-header">
                <div className="chat-order-info">
                  <h3>Order #{selectedOrder.id}</h3>
                  <p>{selectedOrder.customerName} - {selectedOrder.productType}</p>
                </div>
                <div className="supplier-info">
                  <div className="supplier-name">{getOrderSupplier(selectedOrder).name}</div>
                  <div className="supplier-contact">
                    <span>{getOrderSupplier(selectedOrder).email}</span>
                    <span>{getOrderSupplier(selectedOrder).phone}</span>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages[selectedOrder.id]?.map(message => (
                  <div key={message.id} className={`message ${message.type}`}>
                    <div className="message-content">
                      <div className="message-text">{message.message}</div>
                      <div className="message-time">{formatTimestamp(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <div className="input-container">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to the supplier..."
                    rows="3"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="send-button"
                    aria-label={isLoading ? "Sending message" : "Send message to supplier"}
                    title={isLoading ? "Sending message" : "Send message to supplier"}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <div className="no-selection-icon">💬</div>
                <h3>Select an Order</h3>
                <p>Choose an order from the list to start communicating with the supplier</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCommunication;