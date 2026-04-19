import React, { useState, useEffect } from 'react';
import { CloudSun, Users, Maximize, Layers, Warehouse, Box } from 'lucide-react';
import { THEME } from '../constants/theme';

const selectStyle = {
  width: '100%', padding: '12px', borderRadius: '10px',
  border: `1px solid ${THEME.border}`, backgroundColor: '#f8fafc',
  fontWeight: '600', outline: 'none'
};

const Dashboard = ({
  cardStyle, inputStyle, projectData, setProjectData,
  grandTotal, setActiveTab,
  phases, currentPhase, setSelectedPhaseId
}) => {
  const [weather, setWeather] = useState({ temp: "24", condition: "Partly Cloudy" });
  const [projectStatus, setProjectStatus] = useState('Active');

  // ← These now read real data — currentPhase.totalCost is populated by App.js
  const selectedPhaseCost = currentPhase?.totalCost || 0;
  const phaseLabel = currentPhase?.name ? currentPhase.name.toUpperCase() : "PHASE";

  const mockTasks = [
    { task: "Clearing Forests/Debris", type: "Laborers", count: 6 },
    { task: "Excavation", type: "Excavator Operators", count: 8 },
    { task: "Ground Slab", type: "Equipment Operators", count: 4 },
    { task: "External Walls", type: "Bricklayers", count: 8 },
    { task: "Floor Finishes", type: "Interior Installers", count: 18 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1.2fr', gap: '25px', alignItems: 'stretch' }}>
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

          {/* Phase selector */}
          <div style={{ ...cardStyle, borderLeft: `6px solid ${THEME.primary}`, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '10px', color: THEME.muted, textTransform: 'uppercase' }}>
              Current Project Phase
            </h3>
            <div style={{ backgroundColor: '#f1f5f9', borderRadius: '12px', padding: '2px 8px', border: '1px solid #e2e8f0', marginTop: '8px' }}>
              <select
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '15px', fontWeight: '800', color: THEME.sidebar, outline: 'none', cursor: 'pointer', padding: '8px 0' }}
                value={currentPhase?.id}
                onChange={(e) => setSelectedPhaseId(parseInt(e.target.value))}
              >
                {phases.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: THEME.muted, fontWeight: '700' }}>Project Status:</span>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                style={{
                  fontSize: '10px', fontWeight: '900', border: 'none', background: 'none',
                  cursor: 'pointer', outline: 'none', textAlign: 'right',
                  color: projectStatus === 'Active' ? '#10b981' : projectStatus === 'On Hold' ? '#f59e0b' : '#ef4444'
                }}
              >
                <option value="Active">● ACTIVE</option>
                <option value="On Hold">● ON HOLD</option>
                <option value="Work Stopped">● WORK STOPPED</option>
              </select>
            </div>
          </div>

          {/* Acceleration widget (unchanged) */}
          <div style={{ ...cardStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              {[1,2,3,4,5,6,7].map(i => <Users key={i} size={18} color={i <= 2 ? THEME.primary : '#e2e8f0'} />)}
            </div>
            <h2 style={{ margin: 0, color: '#059669', fontSize: '24px', fontWeight: '800' }}>2.5 Days Saved</h2>
            <p style={{ margin: 0, fontSize: '12px', color: THEME.muted, fontWeight: '700' }}>Extra Worker Cost: €1,920</p>
          </div>
        </div>

        {/* Labor table (unchanged) */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Resource Manager</h3>
            <button style={{ border: `1px solid ${THEME.border}`, background: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>+ Import resource schedule .xlsx</button>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {mockTasks.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '15px', padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <input type="text" defaultValue={item.task} style={inputStyle} />
                <select style={inputStyle}><option>{item.type}</option></select>
                <input type="number" defaultValue={item.count} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: financials */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ ...cardStyle, background: THEME.primary, color: 'white', border: 'none', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', opacity: 0.7 }}>ESTIMATED PROJECT COST</p>
          <div style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>€{grandTotal.toLocaleString()}</div>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', opacity: 0.7 }}>{phaseLabel} COST</p>
          {/* ← Now shows real phase cost from phasesWithCosts in App.js */}
          <div style={{ fontSize: '20px', fontWeight: '900' }}>€{selectedPhaseCost.toLocaleString()}</div>
          <button
            onClick={() => setActiveTab('Project Hub')}
            style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '11px' }}
          >VIEW BREAKDOWN →</button>
        </div>

        {/* Parameters widget (unchanged) */}
        <div style={{ ...cardStyle, borderTop: `4px solid ${THEME.primary}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>Parameters</h3>
            <select value={projectData.unitSystem} onChange={(e) => setProjectData({...projectData, unitSystem: e.target.value})} style={{ fontSize: '10px', padding: '4px' }}>
              <option value="metric">m²</option>
              <option value="imperial">sq ft</option>
            </select>
          </div>
          {[{ label: 'GIA', key: 'gia', icon: <Maximize size={14}/> }, { label: 'Storeys', key: 'storeys', icon: <Layers size={14}/> }, { label: 'Wall Area', key: 'wallArea', icon: <Warehouse size={14}/> }, { label: 'Window Area', key: 'windowArea', icon: <Box size={14}/> }].map(field => (
            <div key={field.key} style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
                {field.icon} {field.label.toUpperCase()}
              </label>
              <input type="number" value={projectData[field.key]} onChange={(e) => setProjectData({...projectData, [field.key]: parseFloat(e.target.value) || 0})} style={{ ...selectStyle, padding: '8px', marginTop: '4px' }} />
            </div>
          ))}
        </div>

        {/* Weather (unchanged) */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <CloudSun size={20} color="#1e40af" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Weather Today</h3>
            <div style={{ marginLeft: 'auto', backgroundColor: '#ffedd5', color: '#9a3412', padding: '4px 10px', borderRadius: '15px', fontSize: '13px', fontWeight: '700' }}>{weather.temp}°C</div>
          </div>
          <div style={{ fontSize: '15px', color: '#475569' }}>{weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;