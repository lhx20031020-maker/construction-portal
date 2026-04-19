import React from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { THEME } from '../constants/theme';

const Login = ({ username, setUsername, password, setPassword, handleLogin, error }) => {
  
  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '20px',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '12px',
    border: `1.5px solid ${THEME.border}`,
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: THEME.text,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: THEME.muted
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f1f5f9',
      fontFamily: "'Inter', sans-serif" 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '28px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${THEME.border}`
      }}>
        
        {/* LOGO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '12px', 
            borderRadius: '14px', 
            backgroundColor: '#eef2ff', 
            marginBottom: '15px' 
          }}>
            <ShieldCheck size={32} color={THEME.primary} />
          </div>
          <h1 style={{ 
            color: THEME.primary, 
            fontWeight: '900', 
            fontSize: '32px', 
            margin: 0,
            letterSpacing: '-1px' 
          }}>
            BUILD<span style={{ color: '#1e293b' }}>OS</span>
          </h1>
          <p style={{ color: THEME.muted, fontWeight: '600', marginTop: '8px', fontSize: '14px' }}>
            Project Management Portal
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fff1f2', 
            color: '#e11d48', 
            borderRadius: '10px', 
            marginBottom: '20px', 
            fontSize: '13px', 
            fontWeight: '700',
            textAlign: 'center',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        {/* INPUTS */}
        <div style={inputContainerStyle}>
          <User size={18} style={iconStyle} />
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle} 
            onFocus={(e) => e.target.style.borderColor = THEME.primary}
            onBlur={(e) => e.target.style.borderColor = THEME.border}
          />
        </div>

        <div style={inputContainerStyle}>
          <Lock size={18} style={iconStyle} />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} 
            onFocus={(e) => e.target.style.borderColor = THEME.primary}
            onBlur={(e) => e.target.style.borderColor = THEME.border}
          />
        </div>

        {/* LOGIN BUTTON */}
        <button 
          onClick={handleLogin}
          style={{ 
            width: '100%', 
            padding: '16px', 
            backgroundColor: THEME.primary, 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: '800', 
            fontSize: '16px', 
            cursor: 'pointer',
            boxShadow: `0 4px 14px 0 rgba(37, 99, 235, 0.39)`,
            marginTop: '10px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Sign In
        </button>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <span style={{ color: THEME.muted, fontSize: '13px' }}>
            Protected by BuildOS Security
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;