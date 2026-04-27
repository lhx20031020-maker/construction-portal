import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { THEME } from '../constants/theme';

const Header = ({ activeTab, currentProject, username }) => {
  return (
    <header style={{ 
      height: '70px', 
      backgroundColor: 'white', 
      borderBottom: `1px solid ${THEME.border}`,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 60px',
      paddingLeft: '90px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ fontWeight: '700', fontSize: '18px' }}>
        {activeTab} / <span style={{ color: THEME.primary }}>{currentProject}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Bell size={20} style={{ cursor: 'pointer', color: THEME.muted }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
            {username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{username}</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;