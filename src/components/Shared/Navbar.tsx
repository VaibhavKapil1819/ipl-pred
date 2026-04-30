import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../Auth/LoginModal';
import { LogOut, Shield } from 'lucide-react';
import NotificationManager from './NotificationManager';

const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getLinkStyle = ({ isActive }: any) => ({
    ...styles.link,
    color: isActive ? '#ff7a18' : '#cbd5f5',
    borderBottom: isActive ? '2px solid #ff7a18' : '2px solid transparent'
  });

  return (
    <>
      <nav style={styles.nav}>
        
        {/* BRAND */}
        <NavLink to="/matches" style={styles.brand}>
          IPL PREDICTIONS <span style={{ color: '#ff7a18' }}>🏏</span>
        </NavLink>

        {/* RIGHT */}
        <div style={styles.right}>

          {/* Prevent overlap issues */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NotificationManager />
          </div>

          <NavLink to="/matches" end style={getLinkStyle}>
            Matches
          </NavLink>

          <NavLink to="/leaderboard" style={getLinkStyle}>
            Leaderboard
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" style={getLinkStyle}>
              <Shield size={14} style={{ marginRight: 4 }} />
              Admin
            </NavLink>
          )}

          {user ? (
            <div style={styles.userPill}>
              <span style={styles.userText}>
                {user.email?.split('@')[0].toUpperCase()}
              </span>

              <button onClick={logout} style={styles.logoutBtn}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={styles.loginBtn}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;


/// 🔥 STYLES
const styles: any = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'linear-gradient(to right, #0f172a, #1e293b)',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 9999
  },

  brand: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer'
  },

  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px'
  },

  link: {
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '6px 4px',
    display: 'flex',           // ✅ important
    alignItems: 'center',
    cursor: 'pointer'
  },

  loginBtn: {
    background: '#ff7a18',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600
  },

  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#1e293b',
    padding: '6px 10px',
    borderRadius: '20px'
  },

  userText: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#ff7a18'
  },

  logoutBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    display: 'flex',
    alignItems: 'center'
  }
};