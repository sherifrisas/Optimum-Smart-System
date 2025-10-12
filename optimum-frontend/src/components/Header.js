import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Optimum Smart System</h1>
          <p>AI-Powered Order Management</p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <div className="user-avatar">AU</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
