import React from 'react';
import { Truck, Settings } from 'lucide-react';
import { THEME } from '../constants/theme';

const EquipmentPortal = ({ cardStyle }) => {
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={cardStyle}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={24} color={THEME.primary} /> 
          Equipment Inventory
        </h2>
        <p style={{ color: THEME.muted }}>Fleet tracking is online.</p>
      </div>
    </div>
  );
};

export default EquipmentPortal;