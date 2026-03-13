import { motion } from 'framer-motion';

export default function ExperimentalPanel() {
  const sensors = [
    { name: 'Blood Glucose (Non-invasive)', val: '98 mg/dL', status: 'Beta', icon: '🩸', color: '#fb923c', desc: 'IR spectroscopy estimation — not for medical decisions' },
    { name: 'Blood Alcohol', val: '0.00 g/dL', status: 'Research', icon: '🍷', color: '#a78bfa', desc: 'Transdermal ethanol detection via skin sensor' },
    { name: 'Blood Pressure (Uncalibrated)', val: '120/78 mmHg', status: 'Beta', icon: '💉', color: '#ef4444', desc: 'Estimated via pulse transit time, no cuff calibration' },
    { name: 'Hydration Sensor', val: '68%', status: 'Research', icon: '💧', color: '#3b82f6', desc: 'Bioimpedance-based hydration estimation' },
    { name: 'Cortisol (Stress Hormone)', val: '14.2 µg/dL', status: 'Research', icon: '🧪', color: '#facc15', desc: 'Interstitial fluid cortisol via microneedle patch' },
    { name: 'Lactate Monitoring', val: '1.8 mmol/L', status: 'Beta', icon: '⚡', color: '#22d3ee', desc: 'Continuous sweat-based lactate for endurance athletes' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🔬</span>
        <h2>Experimental / Research Sensors</h2>
      </div>
      <p className="wear-section-subtitle">
        Cutting-edge sensors in beta or research phase — not yet approved for clinical use
      </p>

      <div className="wear-grid-2">
        {sensors.map((s, i) => (
          <motion.div key={i} className="wear-glass-card"
            initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="wear-metric-icon" style={{ background: `${s.color}18`, fontSize: '1.3rem' }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.name}</span>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    padding: '0.15rem 0.5rem', borderRadius: 999,
                    background: s.status === 'Beta' ? 'rgba(251,146,60,0.15)' : 'rgba(167,139,250,0.15)',
                    color: s.status === 'Beta' ? '#fb923c' : '#a78bfa',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{s.status}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--wear-text-dim)', marginTop: '0.3rem', lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
