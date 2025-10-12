import React, { useState } from 'react';
import './OrderReception.css';

const OrderReception = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    productType: '',
    quantity: '',
    deliveryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.productType.trim()) {
      newErrors.productType = 'Product type is required';
    }
    
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else if (new Date(formData.deliveryDate) < new Date()) {
      newErrors.deliveryDate = 'Delivery date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        customerName: formData.customerName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        productType: formData.productType.trim(),
        quantity: parseInt(formData.quantity),
        deliveryDate: formData.deliveryDate
      });
      
      // Reset form
      setFormData({
        customerName: '',
        phoneNumber: '',
        productType: '',
        quantity: '',
        deliveryDate: ''
      });
      
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-reception">
      <div className="page-header">
        <h2>New Order Reception</h2>
        <p>Enter customer order details below</p>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={errors.customerName ? 'error' : ''}
                placeholder="Enter customer full name"
              />
              {errors.customerName && <span className="error-message">{errors.customerName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={errors.phoneNumber ? 'error' : ''}
                placeholder="+20 100 123 4567"
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="productType">Product Type *</label>
            <input
              type="text"
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className={errors.productType ? 'error' : ''}
              placeholder="e.g., Laptop Dell XPS 15, iPhone 15 Pro"
            />
            {errors.productType && <span className="error-message">{errors.productType}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={errors.quantity ? 'error' : ''}
                min="1"
                placeholder="1"
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="deliveryDate">Delivery Date *</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className={errors.deliveryDate ? 'error' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderReception;
