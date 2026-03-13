import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SafetyPanel() {
  const [sosActive, setSosActive] = useState(false);

  const alerts = [
    { type: 'success', icon: '✅', title: 'Fall Detection', desc: 'Active — accelerometer + gyroscope monitoring continuously. No falls detected today.', status: 'Active' },
    { type: 'success', icon: '✅', title: 'Crash Detection', desc: 'Active — high-g impact sensor enabled. Will auto-trigger emergency services.', status: 'Active' },
    { type: 'info', icon: 'ℹ️', title: 'Abnormal HR Alert', desc: 'Triggers if HR exceeds 150 bpm at rest or drops below 40 bpm. None triggered today.', status: 'Armed' },
    { type: 'info', icon: 'ℹ️', title: 'Low Oxygen Alert', desc: 'Triggers if SpO₂ drops below 90% for >30 seconds. None triggered today.', status: 'Armed' },
  ];

  const emergencyContacts = [
    { name: 'Dr. Sharma', relation: 'Primary Care', phone: '+91-98xxx-xxxxx' },
    { name: 'Family Contact', relation: 'Emergency', phone: '+91-87xxx-xxxxx' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🛡️</span>
        <h2>Safety & Emergency Health</h2>
      </div>
      <p className="wear-section-subtitle">
        Fall detection, crash detection, abnormal heart rate alerts, and emergency SOS
      </p>

      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Safety Status */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="card-title">Safety Monitoring Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((a, i) => (
              <motion.div key={i}
                className={`wear-alert-card alert-${a.type === 'success' ? 'success' : 'info'}`}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}>
                <span className="wear-alert-icon">{a.icon}</span>
                <div className="wear-alert-content">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
                <span className="wear-trend-tag up" style={{ flexShrink: 0 }}>{a.status}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SOS + Emergency Contacts */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-title">Emergency SOS</div>

          {/* SOS Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.button
              onClick={() => setSosActive(!sosActive)}
              style={{
                width: 120, height: 120, borderRadius: '50%',
                background: sosActive
                  ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                  : 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
                border: `3px solid ${sosActive ? '#ef4444' : 'rgba(239,68,68,0.3)'}`,
                color: sosActive ? '#fff' : '#ef4444',
                fontSize: '1.5rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
                gap: '0.25rem',
                boxShadow: sosActive ? '0 0 40px rgba(239,68,68,0.4)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={sosActive ? { boxShadow: ['0 0 20px rgba(239,68,68,0.2)', '0 0 40px rgba(239,68,68,0.5)', '0 0 20px rgba(239,68,68,0.2)'] } : {}}
              transition={sosActive ? { duration: 1.5, repeat: Infinity } : {}}
            >
              SOS
              <span style={{ fontSize: '0.6rem', fontWeight: 400 }}>
                {sosActive ? 'ACTIVE' : 'PRESS'}
              </span>
            </motion.button>
          </div>

          {sosActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '0.75rem', borderRadius: 10,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '0.8rem', color: '#ef4444', textAlign: 'center',
                marginBottom: '1rem',
              }}>
              Emergency mode activated. Sharing vitals & location with emergency contacts...
            </motion.div>
          )}

          {/* Emergency Contacts */}
          <div className="card-title" style={{ marginTop: '0.5rem' }}>Emergency Contacts</div>
          {emergencyContacts.map((c, i) => (
            <div key={i} className="wear-stat-row">
              <div className="stat-left">
                <span className="stat-dot" style={{ background: '#ef4444' }} />
                <div>
                  <span className="stat-name">{c.name}</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--wear-text-dim)' }}>{c.relation}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--wear-text-muted)' }}>{c.phone}</span>
            </div>
          ))}

          {/* Posture & Gait */}
          <div className="card-title" style={{ marginTop: '1.25rem' }}>Posture & Gait</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Posture', val: 'Good', color: '#4ade80' },
              { label: 'Sedentary Time', val: '3.2 hrs', color: '#fb923c' },
              { label: 'Standing Time', val: '4.8 hrs', color: '#22d3ee' },
              { label: 'Gait Symmetry', val: '96%', color: '#a78bfa' },
              { label: 'Walking Stability', val: 'Stable', color: '#4ade80' },
              { label: 'Fall Risk', val: 'Low', color: '#4ade80' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '0.4rem 0' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--wear-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
