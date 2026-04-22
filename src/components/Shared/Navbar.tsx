import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../Auth/LoginModal';
import { LogOut, Shield } from 'lucide-react';
import NotificationManager from './NotificationManager';

const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <nav>
      <NavLink to="/matches" className="nav-brand" style={{ textDecoration: 'none' }}>
        IPL PREDICTIONS <span style={{ color: 'var(--orange)' }}>🏏</span>
      </NavLink>
      
      <div className="nav-right">
        <NotificationManager />
        
        <NavLink to="/matches" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Matches
        </NavLink>
        
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Leaderboard
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Shield size={14} /> Admin
          </NavLink>
        )}

        {user ? (
          <div className="user-pill">
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--orange)' }}>
              {user.email?.split('@')[0].toUpperCase()}
            </span>
            <button className="btn-logout" onClick={() => logout()} style={{ padding: '6px' }}>
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={() => setIsLoginModalOpen(true)} style={{ marginLeft: '8px' }}>
            Login
          </button>
        )}
      </div>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
