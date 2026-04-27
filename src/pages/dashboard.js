import React, { useState, useEffect } from 'react';
import { CloudSun, Users, Maximize, Layers, Warehouse, Box } from 'lucide-react';
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';

const selectStyle = {
  width: '90%', padding: '12px', borderRadius: '10px',
  border: `1px solid ${THEME.border}`, backgroundColor: '#f8fafc',
  fontWeight: '600', outline: 'none'
};

const LABOR_PRICE_MAP = libraryData
  .filter(i => i.Category === 'Labor')
  .reduce((acc, i) => {
    const key = `${i.Task}||${i.Identifier}`;
    if (!acc[key]) acc[key] = i['Price (€)'];
    return acc;
  }, {});

const ROLE_PRICE_MAP = libraryData
  .filter(i => i.Category === 'Labor')
  .reduce((acc, i) => {
    if (!acc[i.Identifier]) acc[i.Identifier] = i['Price (€)'];
    return acc;
  }, {});

const getWage = (task, role) =>
  LABOR_PRICE_MAP[`${task}||${role}`] ?? ROLE_PRICE_MAP[role] ?? 0;

const HOURS_PER_DAY = 6;

const Dashboard = ({
  cardStyle, inputStyle, projectData, setProjectData,
  grandTotal, setActiveTab,
  phases, currentPhase, setSelectedPhaseId,
  labourItems
}) => {
  const [weather, setWeather] = useState({ temp: "24", condition: "Partly Cloudy" });
  const [projectStatus, setProjectStatus] = useState('Active');
  const [resourceRows, setResourceRows] = useState([]);
  
  // State for the new Variation Bar
  const [variationInput, setVariationInput] = useState({
    task: '',
    type: '',
    count: 1,
    number: 1
  });

  const selectedPhaseCost = currentPhase?.totalCost || 0;
  const phaseLabel = currentPhase?.name ? currentPhase.name.toUpperCase() : "PHASE";
  const allRoles = labourItems ? [...new Set(labourItems.map(i => i.identifier))] : [];
  const allTasks = labourItems ? [...new Set(labourItems.map(i => i.task))] : [];

  useEffect(() => {
    if (labourItems && labourItems.length > 0) {
      const seen = new Set();
      const rows = labourItems
        .filter(i => {
          const key = `${i.task}||${i.identifier}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map(i => ({
          task: i.task,
          type: i.identifier,
          count: i.hours || 1,
          number: 1,
          wage: getWage(i.task, i.identifier)
        }));
      setResourceRows(rows);
    } else {
      setResourceRows([{ task: '', type: '', count: 1, number: 1, wage: 0 }]);
    }
    
    // Set default role for variation bar
    if (allRoles.length > 0) {
        setVariationInput(prev => ({ ...prev, type: allRoles[0] }));
    }
  }, [currentPhase?.id]);

  const updateRow = (idx, field, value) =>
    setResourceRows(prev => {
      const updated = prev.map((r, i) => {
        if (i !== idx) return r;
        const u = { ...r, [field]: value };
        if (field === 'task' || field === 'type') {
          u.wage = getWage(field === 'task' ? value : r.task, field === 'type' ? value : r.type);
        }
        return u;
      });
      return updated;
    });

  const handleAddVariation = () => {
    if (!variationInput.task) return;
    const newRow = { 
      ...variationInput, 
      wage: getWage(variationInput.task, variationInput.type) 
    };
    setResourceRows(prev => [newRow, ...prev]); // Adds to top of list
    setVariationInput({ task: '', type: allRoles[0] || '', count: 1, number: 1 });
  };

  const removeRow = (idx) =>
    setResourceRows(prev => prev.filter((_, i) => i !== idx));

  const RESOURCE_GRID_LAYOUT = {
    display: 'grid',
    gridTemplateColumns: '150px 210px 60px 60px 60px 75px 70px',
    gap: '30px', // This creates the uniform buffer between every box
    alignItems: 'left',
    width: '100%'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '3fr 2fr 1fr', 
      gap: '30px', 
      alignItems: 'stretch', 
      height: 'calc(100vh - 14px)',
      boxSizing: 'border-box'
    }}>
      
      {/* LEFT & MIDDLE COLUMNS */}
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '25px', minHeight: 0 }}>
        
        {/* TOP ROW WIDGETS */}
        <div style={{ display: 'flex', gap: '25px', flexShrink: 0 }}>
          <div style={{ ...cardStyle, flex: 1, borderLeft: `6px solid ${THEME.primary}`, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '10px', color: THEME.muted, textTransform: 'uppercase' }}>Current Project Phase</h3>
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
              <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} style={{ fontSize: '10px', fontWeight: '900', border: 'none', background: 'none', cursor: 'pointer', outline: 'none', textAlign: 'right', color: projectStatus === 'Active' ? '#10b981' : '#ef4444' }}>
                <option value="Active">● ACTIVE</option>
                <option value="On Hold">● ON HOLD</option>
              </select>
            </div>
          </div>

          <div style={{ ...cardStyle, flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              {[1,2,3,4,5,6,7].map(i => <Users key={i} size={18} color={i <= 2 ? THEME.primary : '#e2e8f0'} />)}
            </div>
            <h2 style={{ margin: 0, color: '#059669', fontSize: '24px', fontWeight: '800' }}>2.5 Days Saved</h2>
            <p style={{ margin: 0, fontSize: '12px', color: THEME.muted, fontWeight: '700' }}>Extra Worker Cost: €1,920</p>
          </div>
        </div>

        {/* RESOURCE MANAGER */}
        <div style={{ ...cardStyle, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 10px', flexShrink: 0 }}>
            <h3 style={{ margin: 0 }}>Resource Manager</h3>
            <button style={{ border: `1px solid ${THEME.border}`, background: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>+ Import .xlsx</button>
          </div>

          {/* HEADINGS */}
          <div style={{ ...RESOURCE_GRID_LAYOUT, padding: '4px 20px 8px', borderBottom: '10px solid #f1f5f9', flexShrink: 0 }}>
            {['Task', 'Role', 'Days', 'Number', 'Rate', 'Total', ''].map((h, i) => (
              <span key={i} style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, textTransform: 'uppercase', textAlign: 'center' }}>{h}</span>
            ))}
          </div>
{/* THE VARIATION INPUT BAR */}
<div style={{ 
  ...RESOURCE_GRID_LAYOUT, 
  padding: '12px 20px', 
  backgroundColor: '#eff6ff', 
  borderBottom: '2px solid #bfdbfe',
  alignItems: 'center'
}}>
  {/* TASK DROPDOWN (Replaced the text input) */}
  <select 
      value={variationInput.task} 
      onChange={(e) => setVariationInput({...variationInput, task: e.target.value})} 
      style={{ ...inputStyle, background: 'white', border: `1px solid ${THEME.primary}` }}
  >
    <option value="">Select Task...</option>
    {allTasks.map(task => <option key={task} value={task}>{task}</option>)}
  </select>
  
  <select 
      value={variationInput.type} 
      onChange={(e) => setVariationInput({...variationInput, type: e.target.value})} 
      style={{ ...inputStyle, background: 'white' }}
  >
    {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
  </select>
  
  <input type="number" value={variationInput.count} onChange={(e) => setVariationInput({...variationInput, count: e.target.value})} style={inputStyle} />
  <input type="number" value={variationInput.number} onChange={(e) => setVariationInput({...variationInput, number: e.target.value})} style={inputStyle} />
  
  <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: '700', color: '#1e40af' }}>
     €{getWage(variationInput.task, variationInput.type)}/h
  </div>
  
  <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>—</div>
  
  <button 
      onClick={handleAddVariation} 
      style={{ backgroundColor: THEME.primary, color: 'white', border: '8px', borderRadius: '6px', padding: '8px 15px', fontWeight: '800', cursor: 'pointer' }}
  >
    ADD
  </button>
</div>

          {/* SCROLLABLE CONTENT */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
            {resourceRows.map((item, idx) => (
              <div key={idx} style={{ ...RESOURCE_GRID_LAYOUT, padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <input type="text" value={item.task} onChange={(e) => updateRow(idx, 'task', e.target.value)} style={inputStyle} />
                <select value={item.type} onChange={(e) => updateRow(idx, 'type', e.target.value)} style={inputStyle}>
                  {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <input type="number" value={item.count} min={0} onChange={(e) => updateRow(idx, 'count', parseInt(e.target.value) || 0)} style={inputStyle} />
                <input type="number" value={item.number} min={1} onChange={(e) => updateRow(idx, 'number', parseInt(e.target.value) || 1)} style={inputStyle} />
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#065f46', fontWeight: '700', fontSize: '11px' }}>€{(item.wage || 0).toFixed(0)}/h</div>
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', fontWeight: '700', fontSize: '11px' }}>€{((item.number || 1) * (item.count || 0) * HOURS_PER_DAY * (item.wage || 0)).toLocaleString()}</div>
                <button onClick={() => removeRow(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', fontWeight: '700' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <div style={{ ...cardStyle, background: THEME.primary, color: 'white', border: 'none', padding: '24px' }}>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', opacity: 0.7 }}>ESTIMATED PROJECT COST</p>
          <div style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>€{grandTotal.toLocaleString()}</div>
          <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', opacity: 0.7 }}>{phaseLabel} COST</p>
          <div style={{ fontSize: '20px', fontWeight: '900' }}>€{selectedPhaseCost.toLocaleString()}</div>
          <button onClick={() => setActiveTab('Project Hub')} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '11px' }}>VIEW BREAKDOWN →</button>
        </div>

        <div style={{ ...cardStyle, borderTop: `4px solid ${THEME.primary}`, padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Parameters</h3>
          {[
            { label: 'GIA', key: 'gia', icon: <Maximize size={14}/> },
            { label: 'Storeys', key: 'storeys', icon: <Layers size={14}/> },
            { label: 'Wall Area', key: 'wallArea', icon: <Warehouse size={14}/> },
            { label: 'Window Area', key: 'windowArea', icon: <Box size={14}/> }
          ].map(field => (
            <div key={field.key} style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>{field.icon} {field.label.toUpperCase()}</label>
              <input type="number" value={projectData[field.key]} onChange={(e) => setProjectData({...projectData, [field.key]: parseFloat(e.target.value) || 0})} style={{ ...selectStyle, padding: '8px', marginTop: '4px' }} />
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <CloudSun size={20} color="#1e40af" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Weather</h3>
            <div style={{ marginLeft: 'auto', backgroundColor: '#ffedd5', color: '#9a3412', padding: '4px 10px', borderRadius: '15px', fontSize: '13px', fontWeight: '700' }}>{weather.temp}°C</div>
          </div>
          <div style={{ fontSize: '15px', color: '#475569' }}>{weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;