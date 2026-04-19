import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { THEME } from '../constants/theme';

const Metrics = ({
  delayMetrics,       // array: [{ id, type, dailyCost }] — from App.js state
  setDelayMetrics,    // setter — from App.js
  overrunDays         // number — computed in App.js, passed down
}) => {

  const [newDescription, setNewDescription] = useState('');
  const [newDailyCost, setNewDailyCost]     = useState('');

  const addPenalty = () => {
    if (!newDescription.trim() || !newDailyCost) return;
    const newEntry = {
      id: Date.now(),
      type: newDescription.trim(),
      dailyCost: parseFloat(newDailyCost) || 0
    };
    setDelayMetrics([...delayMetrics, newEntry]);
    setNewDescription('');
    setNewDailyCost('');
  };

  const removePenalty = (id) => {
    setDelayMetrics(delayMetrics.filter(m => m.id !== id));
  };

  const dailyExposure = delayMetrics.reduce(
    (sum, m) => sum + (parseFloat(m.dailyCost) || 0), 0
  );

  const totalRiskCost = overrunDays > 0
    ? overrunDays * dailyExposure
    : 0;

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '32px',
    border: `1px solid ${THEME.border}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

      <div style={cardStyle}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3 style={{ fontWeight: '900', fontSize: '18px', color: THEME.sidebar }}>
            Risk Management
          </h3>
          <button
            onClick={() => {/* opens inline add row — see below */}}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: THEME.danger, color: 'white',
              border: 'none', borderRadius: '20px',
              padding: '12px 22px', fontWeight: '800',
              fontSize: '14px', cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add Penalty
          </button>
        </div>

        {/* ── Column headers ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: '20px', paddingBottom: '12px',
          borderBottom: `1px solid ${THEME.border}`,
          fontSize: '11px', fontWeight: '800',
          color: THEME.muted, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <span>Risk Description</span>
          <span style={{ minWidth: '140px', textAlign: 'center' }}>Daily Cost (€)</span>
          <span style={{ minWidth: '60px', textAlign: 'right' }}>Action</span>
        </div>

        {/* ── Rows ── */}
        {delayMetrics.map((metric) => (
          <div
            key={metric.id}
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto',
              gap: '20px', alignItems: 'center',
              padding: '18px 0',
              borderBottom: `1px solid ${THEME.border}`
            }}
          >
            <span style={{ fontWeight: '800', fontSize: '15px', color: THEME.text }}>
              {metric.type}
            </span>
            <span style={{
              minWidth: '140px', textAlign: 'center',
              color: THEME.danger, fontWeight: '800', fontSize: '16px'
            }}>
              {parseFloat(metric.dailyCost).toLocaleString()}
            </span>
            <div style={{ minWidth: '60px', textAlign: 'right' }}>
              <button
                onClick={() => removePenalty(metric.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: THEME.muted, padding: '4px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* ── Inline add row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: '20px', alignItems: 'center', paddingTop: '18px'
        }}>
          <input
            type="text"
            placeholder="Risk description..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '10px',
              border: `1px solid ${THEME.border}`,
              fontSize: '14px', fontWeight: '600', outline: 'none'
            }}
          />
          <input
            type="number"
            placeholder="Daily €"
            value={newDailyCost}
            onChange={(e) => setNewDailyCost(e.target.value)}
            style={{
              width: '120px', padding: '10px 14px', borderRadius: '10px',
              border: `1px solid ${THEME.border}`,
              fontSize: '14px', fontWeight: '600',
              textAlign: 'center', outline: 'none'
            }}
          />
          <button
            onClick={addPenalty}
            style={{
              padding: '10px 18px', borderRadius: '10px',
              backgroundColor: THEME.danger, color: 'white',
              border: 'none', fontWeight: '800',
              fontSize: '13px', cursor: 'pointer'
            }}
          >
            + Add
          </button>
        </div>

        {/* ── Projected Daily Exposure summary ── */}
        <div style={{
          marginTop: '28px', borderRadius: '16px',
          backgroundColor: '#fff0f0',
          border: '1px solid #fecaca',
          padding: '28px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '900', color: THEME.danger, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Projected Daily Exposure:
          </span>
          <span style={{ fontSize: '32px', fontWeight: '900', color: THEME.danger }}>
            €{dailyExposure.toLocaleString()} / Day
          </span>
          {overrunDays > 0 && (
            <span style={{ fontSize: '13px', fontWeight: '700', color: THEME.muted, marginTop: '4px' }}>
              At {overrunDays} day overrun → Total risk: €{totalRiskCost.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;