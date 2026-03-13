import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function generateStressData(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    stress: Math.max(10, Math.min(95, 30 + Math.floor(Math.random() * 40) + (i > 8 && i < 18 ? 20 : 0))),
    relaxation: Math.max(5, 80 - Math.floor(Math.random() * 35) - (i > 8 && i < 18 ? 15 : 0)),
  }));
}

function CircularGauge({ value, max, size = 120, strokeWidth = 10, color, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <div className="wear-circular-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="gauge-bg" cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} />
        <circle className="gauge-fill" cx={size / 2} cy={size / 2} r={r}
          strokeWidth={strokeWidth} stroke={color}
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-center">
        <span className="gauge-val" style={{ color, fontSize: '1.5rem' }}>{value}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

export default function StressPanel() {
  const [data] = useState(() => generateStressData());
  const [stressLevel, setStressLevel] = useState(42);

  useEffect(() => {
    const iv = setInterval(() => {
      setStressLevel(prev => {
        const d = Math.floor(Math.random() * 7) - 3;
        return Math.max(15, Math.min(90, prev + d));
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const getStressLabel = (v) => {
    if (v < 30) return { text: 'Relaxed', color: '#4ade80' };
    if (v < 50) return { text: 'Normal', color: '#22d3ee' };
    if (v < 70) return { text: 'Moderate', color: '#facc15' };
    return { text: 'High', color: '#ef4444' };
  };

  const sLabel = getStressLabel(stressLevel);

  const stressEvents = [
    { time: '09:15', type: 'Spike', val: 78, trigger: 'Morning commute', color: '#fb923c' },
    { time: '14:30', type: 'Spike', val: 82, trigger: 'Meeting', color: '#ef4444' },
    { time: '17:45', type: 'Recovery', val: 28, trigger: 'Walk break', color: '#4ade80' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🧠</span>
        <h2>Stress & Mental State</h2>
      </div>
      <p className="wear-section-subtitle">
        Stress levels derived from HRV and physiological signals, with Event detection and mindfulness tracking
      </p>

      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Current Stress */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="card-title">Current Stress Level</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <CircularGauge value={stressLevel} max={100} size={130} strokeWidth={10}
              color={sLabel.color} label="/ 100" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: sLabel.color, marginBottom: '0.5rem' }}>{sLabel.text}</div>
              <div className="wear-stat-row">
                <span className="stat-name">Avg Today</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#facc15' }}>45</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Peak Today</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#ef4444' }}>82</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Relaxation Score</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#4ade80' }}>68</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Mindfulness Min</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#a78bfa' }}>15</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stress Events */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-title">Stress Events Today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stressEvents.map((ev, i) => (
              <div key={i} className="wear-alert-card" style={{ borderLeftColor: ev.color }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: ev.color, minWidth: '45px' }}>{ev.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {ev.type} — Score: {ev.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
                    Likely trigger: {ev.trigger}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--wear-text-dim)' }}>
            Breathing rate avg: <strong style={{ color: '#22d3ee' }}>15.2 br/min</strong>
          </div>
        </motion.div>
      </div>

      {/* 24h Stress Trend */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        <div className="card-title">Stress & Relaxation — 24 Hour Trend</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="relaxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#7a7a95', fontSize: 10 }} interval={3} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Area type="monotone" dataKey="stress" stroke="#ef4444" fill="url(#stressGrad)" strokeWidth={2} name="Stress" />
            <Area type="monotone" dataKey="relaxation" stroke="#4ade80" fill="url(#relaxGrad)" strokeWidth={2} name="Relaxation" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Stress Level</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#4ade80' }} /> Relaxation</span>
        </div>
      </motion.div>
    </div>
  );
}
