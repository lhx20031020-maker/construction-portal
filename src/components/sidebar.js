import React from 'react';
import { LayoutGrid, Globe, Truck, TriangleAlert } from 'lucide-react';
import { THEME } from '../constants/theme';

const Sidebar = ({ activeTab, setActiveTab, setViewMode }) => {
  const btnStyle = (tab) => ({
    background: activeTab === tab ? 'rgba(255,255,255,0.15)' : 'transparent',
    border: 'none', color: 'white', padding: '14px 18px', textAlign: 'left',
    cursor: 'pointer', borderRadius: '12px', display: 'flex', alignItems: 'center',
    gap: '12px', width: '100%', fontWeight: '600', transition: '0.2s'
  });

  return (
    <aside style={{ 
      width: '200px', backgroundColor: THEME.sidebar, color: 'white', 
      height: '100vh', position: 'fixed', left: 0, top: 0, padding: '20px', zIndex: 100 
    }}>
      <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '40px', paddingLeft: '10px' }}>
        BUILD<span style={{ color: THEME.primary }}>OS</span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setActiveTab('Dashboard')} style={btnStyle('Dashboard')}>
          <LayoutGrid size={18}/> Dashboard
        </button>

        <button onClick={() => { setActiveTab('Project Hub'); setViewMode('list'); }} style={btnStyle('Project Hub')}>
          <Globe size={18}/> Project Hub
        </button>

        <button onClick={() => setActiveTab('Equipment')} style={btnStyle('Equipment')}>
          <Truck size={18}/> Equipment Portal
        </button>

        <button onClick={() => setActiveTab('Metrics')} style={btnStyle('Metrics')}>
          <TriangleAlert size={18}/> Risk Metrics
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;