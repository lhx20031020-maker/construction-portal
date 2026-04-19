import React, { useState, useMemo } from 'react';
import { Box, ChevronLeft, FileUp, Settings2, Warehouse, Layout, Layers } from 'lucide-react';
import { THEME } from '../constants/theme';
import libraryData from '../constants/master_dataset.json';

// ← quantities and grandTotal are now received as props from App.js
// No local recalculation — App.js is the single source of truth

const ProjectHub = ({
  projectData, setProjectData,
  viewMode, setViewMode,
  cardStyle, setCurrentProject, currentProject,
  quantities,   // ← NEW prop from App.js
  grandTotal    // ← already existed, now consistently computed upstream
}) => {
  const [activeTaskView, setActiveTaskView] = useState(null);

  const PROJECT_MAP = {
    "Substructure": ["Excavation","Piling & Shoring","Foundations","Water Proofing","Retaining Wall"],
    "Superstructure": ["Columns & Beams","Floor Slab","Core Construction","Roof structure"],
    "Building Envelope": ["External Wall","Roofing","Glazing","Windows & Doors"],
    "First Install": ["Fire-Stopping","Internal Partitioning","MEP Rough-in","Fire Sprinklers","Elevators"],
    "Second Install": ["Internal Plastering","Ceiling Installation","Bathroom Installation","Kitchen & Appliances","Second Fix MEP","Joinery","Flooring","Electrical Installation","Internal Finishes"],
    "External Works": ["Landscaping"],
    "Testing, Commissioning & Handover": ["Testing & Balancing","Electrical Certification","Snagging","Final Inspection","Practical Completion"]
  };

  const getTaskItems = (taskName) => libraryData.filter(i => i.Task === taskName && i.Category === 'Product');

  // Uses quantities prop — no local state drift
  const getTaskTotal = (taskName) =>
    getTaskItems(taskName).reduce((sum, item) => sum + (quantities[item.Code] || 0) * item["Price (€)"], 0);

  // grandTotal is passed in — no useMemo needed here
  
  const renderSettingsBar = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '16px', marginBottom: '25px', border: `1px solid ${THEME.border}` }}>
      {[
        { label: `GIA (${projectData.unitSystem === 'metric' ? 'm²' : 'sq ft'})`, key: 'gia', icon: <Layout size={14}/> },
        { label: 'STOREYS', key: 'storeys', icon: <Layers size={14}/> },
        { label: `WALL AREA (${projectData.unitSystem === 'metric' ? 'm²' : 'sq ft'})`, key: 'wallArea', icon: <Warehouse size={14}/> },
        { label: `WINDOW AREA (${projectData.unitSystem === 'metric' ? 'm²' : 'sq ft'})`, key: 'windowArea', icon: <Box size={14}/> }
      ].map(field => (
        <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '10px', fontWeight: '800', color: THEME.muted, display: 'flex', alignItems: 'center', gap: '5px' }}>
            {field.icon} {field.label}
          </label>
          <input
            type="number"
            value={projectData[field.key]}
            onChange={(e) => setProjectData({...projectData, [field.key]: parseFloat(e.target.value) || 0})}
            style={{ border: `1px solid ${THEME.border}`, borderRadius: '8px', padding: '8px', fontWeight: '700', outline: 'none' }}
          />
        </div>
      ))}
    </div>
  );

  if (activeTaskView) {
    const taskItems = getTaskItems(activeTaskView);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={() => setActiveTaskView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.primary, fontWeight: '700', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20}/> Back to Project Overview
        </button>
        <div style={cardStyle}>
          <h2>Managing Products: {activeTaskView}</h2>
          <p style={{ fontSize: '13px', color: THEME.muted, marginTop: '8px' }}>
            Quantities here update the shared state in App.js — Dashboard costs update in real time.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: THEME.muted, borderBottom: `2px solid ${THEME.border}` }}>
                <th style={{ padding: '12px' }}>Identifier</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Quantity</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {taskItems.map(item => (
                <tr key={item.Code} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: '15px 12px', fontSize: '13px' }}>{item.Identifier}</td>
                  <td>{item["U.M."]}</td>
                  <td>€{item["Price (€)"]}</td>
                  <td>
                    {/* Note: to make quantity edits reflect in Dashboard, lift
                        quantities state to App.js and pass setQuantities down */}
                    <input
                      type="number"
                      style={{ width: '60px', padding: '5px', borderRadius: '6px', border: `1px solid ${THEME.border}` }}
                      value={quantities[item.Code] || 0}
                      readOnly
                    />
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800' }}>€{((quantities[item.Code] || 0) * item["Price (€)"]).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {viewMode === 'list' ? (
        <>
          <div style={cardStyle}>
            <h3 style={{ margin: 0, marginBottom: '20px' }}>Existing Projects</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {['Viale Mugello','Porta Nuova Center','Navigli Waterfront','CityLife Tower'].map(proj => (
                <div key={proj} onClick={() => { setCurrentProject(proj); setViewMode('detail'); }} style={{ padding: '10px 20px', borderRadius: '16px', border: `1px solid ${THEME.border}`, backgroundColor: 'white', cursor: 'pointer' }}>
                  <div style={{ fontWeight: '800', color: THEME.text }}>{proj}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: THEME.primary, fontWeight: '700' }}>Open Architecture →</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, borderLeft: `8px solid ${THEME.primary}` }}>
            <h3>Start New Project Tracking</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '20px' }}>
              {['Steel','Concrete','Timber','Scratch'].map(type => (
                <div key={type} style={{ padding: '20px', border: `2px solid ${THEME.border}`, borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                  <Box size={24} style={{ marginBottom: '10px', margin: '0 auto' }}/>
                  <div style={{ fontWeight: '800' }}>{type}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FileUp size={22} color={THEME.primary} />
              <h3 style={{ margin: 0 }}>Import from Gantt Chart</h3>
            </div>
            <div style={{ border: `2px dashed ${THEME.border}`, padding: '30px', textAlign: 'center', borderRadius: '15px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
              <p style={{ color: THEME.muted, fontSize: '14px' }}>Drag and drop your MPP or CSV schedule here</p>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: THEME.muted }}>
            <ChevronLeft size={20}/> Back to Project Hub
          </button>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
              <div>
                <h1 style={{ margin: 0 }}>{currentProject}</h1>
                <p style={{ margin: 0, color: THEME.muted }}>Project Phase and Task Overview</p>
              </div>
              <div style={{ textAlign: 'right', padding: '10px', background: THEME.primary, color: 'white', borderRadius: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.8 }}>ESTIMATED PROJECT COST</div>
                <div style={{ fontSize: '20px', fontWeight: '900' }}>€{grandTotal.toLocaleString()}</div>
              </div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px', marginBottom: '20px', borderLeft: `4px solid ${THEME.primary}` }}>
              <p style={{ margin: 0, fontSize: '13px', color: THEME.muted }}>Click on each phase to see tasks, then manage specific products.</p>
            </div>
            {renderSettingsBar()}
            {Object.entries(PROJECT_MAP).map(([phaseName, tasks]) => (
              <details key={phaseName} style={{ marginBottom: '15px', border: `1px solid ${THEME.border}`, borderRadius: '16px' }}>
                <summary style={{ padding: '20px', backgroundColor: '#fcfcfd', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{phaseName}</span>
                  <span style={{ color: THEME.primary }}>€{tasks.reduce((acc, t) => acc + getTaskTotal(t), 0).toLocaleString()}</span>
                </summary>
                <div style={{ padding: '10px 20px 20px 20px' }}>
                  {tasks.map(taskName => (
                    <div key={taskName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: '700' }}>{taskName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ fontWeight: '800' }}>€{getTaskTotal(taskName).toLocaleString()}</div>
                        <button onClick={() => setActiveTaskView(taskName)} style={{ padding: '8px 16px', backgroundColor: 'white', border: `1px solid ${THEME.primary}`, color: THEME.primary, borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Settings2 size={16} /> Manage Products
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHub;