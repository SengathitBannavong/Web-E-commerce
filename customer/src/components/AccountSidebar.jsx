import React from 'react';
import './AccountSidebar.css';

export const AccountSidebar = ({ user, menuItems }) => {
  if (!user) return null;

  const avatarSrc = user.avatar;

  return (
    <div className="account-sidebar">
      <div className="sidebar-user-info">
        <img src={avatarSrc} alt="User Avatar" className="sidebar-user-info__avatar" />
        <p className="sidebar-user-info__name">{user.name}</p>
        <p className="sidebar-user-info__email">{user.email}</p>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-nav__list">
          {menuItems.map((item, index) => (
            <li key={index} className={`sidebar-nav__item ${item.active ? 'sidebar-nav__item--active' : ''}`}>
              <a 
                href="#" 
                className="sidebar-nav__link"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__text">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
