import React from 'react';
import './Navigation.css';

const Navigation = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'new-order', label: 'New Order', icon: '➕' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
    { id: 'accounting', label: 'Accounting', icon: '💰' },
    { id: 'ai-dashboard', label: 'AI Insights', icon: '🤖' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        <ul className="nav-menu">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                title={item.label}
              >
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;