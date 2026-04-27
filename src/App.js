import React, { useState, useMemo } from 'react';
import { HardHat } from 'lucide-react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Dashboard from './pages/dashboard';
import ProjectHub from './pages/projecthub';
import EquipmentPortal from './pages/equipment';
import Login from './components/login';
import libraryData from './constants/master_dataset.json';
import { getInitialQuantities } from './constants/projectemplate'; // ← FIXED: named import
import Metrics from './pages/riskmetric';
import { THEME } from './constants/theme';

const inputStyle = { width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '12px', paddingLeft: '12px', borderRadius: '8px', border: `1px solid ${THEME.border}`, backgroundColor: '#f1f5f9', fontWeight: '600', color: THEME.sidebar, outline: 'none' };
const cardStyle = { backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: `1px solid ${THEME.border}`, position: 'relative', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const addBtn = { backgroundColor: THEME.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };

// PROJECT_MAP mirrors ProjectHub — single source of truth in App.js
const PROJECT_MAP = {
  "Substructure": ["Excavation","Piling & Shoring","Foundations","Water Proofing","Retaining Wall"],
  "Superstructure": ["Columns & Beams","Floor Slab","Core Construction","Roof structure"],
  "Building Envelope": ["External Wall","Roofing","Glazing","Windows & Doors"],
  "First Install": ["Fire-Stopping","Internal Partitioning","MEP Rough-in","Fire Sprinklers","Elevators"],
  "Second Install": ["Internal Plastering","Ceiling Installation","Bathroom Installation","Kitchen & Appliances","Second Fix MEP","Joinery","Flooring","Electrical Installation","Internal Finishes"],
  "External Works": ["Landscaping"],
  "Testing, Commissioning & Handover": ["Testing & Balancing","Electrical Certification","Snagging","Final Inspection","Practical Completion"]
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [projectData, setProjectData] = useState({
    gia: 2450.75, storeys: 2, wallArea: 450, windowArea: 80, unitSystem: 'metric'
  });
  const [currentProject, setCurrentProject] = useState('Project A');
  const [viewMode, setViewMode] = useState('list');
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);
  const [phases] = useState([
    { id: 1, name: "Substructure" },
    { id: 2, name: "Superstructure" },
    { id: 3, name: "Building Envelope" },
    { id: 4, name: "First Install" },
    { id: 5, name: "Second Install" },
    { id: 6, name: "External Works" },
    { id: 7, name: "Testing, Commissioning & Handover" }
  ]);

  const handleLogin = () => {
    if (username.trim() !== '' && password === 'Group4') {
      setIsLoggedIn(true); setError('');
    } else if (password !== 'Group4') {
      setError('Access Denied: Incorrect Password');
    } else {
      setError('Please enter a username');
    }
  };
  const [delayMetrics, setDelayMetrics] = useState([
    { id: 1, type: 'Site Overheads', dailyCost: 200 }
  ]);
  // ─── SINGLE SOURCE OF TRUTH: all cost calculations live here ───────────────

  // quantities derived from projectData (shared with ProjectHub)
  const quantities = useMemo(() => getInitialQuantities(projectData), [projectData]);

  // helper: cost for a single task name
  const getTaskCost = (taskName) =>
    libraryData
      .filter(i => i.Task === taskName && i.Category === 'Product')
      .reduce((sum, item) => sum + (quantities[item.Code] || 0) * item["Price (€)"], 0);

  // grand total across all phases/tasks
  const grandTotal = useMemo(() =>
    Object.values(PROJECT_MAP).flat().reduce((t, task) => t + getTaskCost(task), 0),
  [quantities]);

  // ← NEW: phasesWithCosts — each phase now carries its totalCost
  const phasesWithCosts = useMemo(() =>
    phases.map(phase => ({
      ...phase,
      totalCost: (PROJECT_MAP[phase.name] || []).reduce(
        (sum, task) => sum + getTaskCost(task), 0
      )
    })),
  [quantities]);

  const currentPhase = phasesWithCosts.find(p => p.id === selectedPhaseId) || phasesWithCosts[0];

  // Labour items from master_dataset.json, filtered by current phase
  const labourItems = useMemo(() =>
    libraryData
      .filter(i => i.Category === 'Labor' && i.Phase === currentPhase?.name)
      .reduce((acc, i) => {
        // Group by Identifier (job role), sum up hours via quantities
        const existing = acc.find(x => x.identifier === i.Identifier);
        const hours = 1;
        if (existing) {
          existing.hours += hours;
          existing.cost += hours * i["Price (€)"];
        } else {
          acc.push({
            task: i.Task,
            identifier: i.Identifier,
            unit: i["U.M."],
            hours,
            unitPrice: i["Price (€)"],
            cost: hours * i["Price (€)"]
          });
        }
        return acc;
      }, []),
  [quantities, currentPhase]);

  // ───────────────────────────────────────────────────────────────────────────
const dailyRiskSum = delayMetrics.reduce((sum, m) => sum + (parseFloat(m.dailyCost) || 0), 0);
const overrunDays = 0; // replace with your forecast logic if needed

  if (!isLoggedIn) {
    return (
      <Login
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        handleLogin={handleLogin} error={error}
      />
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: THEME.bg }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} setViewMode={setViewMode} />
      <main style={{ marginLeft: '200px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header activeTab={activeTab} currentProject={currentProject} username={username} />
        <div style={{ padding: '30px 30px 30px 80px' }}>
          {activeTab === 'Dashboard' && (
            <Dashboard
              phases={phasesWithCosts}        // ← pass enriched phases
              currentPhase={currentPhase}     // ← now has .totalCost populated
              setSelectedPhaseId={setSelectedPhaseId}
              setActiveTab={setActiveTab}
              cardStyle={cardStyle}
              inputStyle={inputStyle}
              addBtn={addBtn}
              projectData={projectData}
              setProjectData={setProjectData}
              grandTotal={grandTotal}
              labourItems={labourItems}       // ← real Labor data from master_dataset.json
            />
          )}
          {activeTab === 'Project Hub' && (
            <ProjectHub
              viewMode={viewMode} setViewMode={setViewMode}
              cardStyle={cardStyle}
              setCurrentProject={setCurrentProject}
              currentProject={currentProject}
              projectData={projectData}
              setProjectData={setProjectData}
              quantities={quantities}         // ← pass shared quantities
              grandTotal={grandTotal}         // ← pass computed grandTotal
            />
          )}
          {activeTab === 'Equipment' && <EquipmentPortal cardStyle={cardStyle} />}

          {activeTab === 'Metrics' && (
          <Metrics
            delayMetrics={delayMetrics}
            setDelayMetrics={setDelayMetrics}
            overrunDays={overrunDays}
            />
          )}

        </div>
      </main>
    </div>
  );
}