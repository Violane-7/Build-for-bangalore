import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

function generateStepData(days = 7) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return labels.map(d => ({
    day: d,
    steps: 4000 + Math.floor(Math.random() * 8000),
    goal: 10000,
  }));
}

// Activity rings SVG component
function ActivityRings({ move, exercise, stand }) {
  const size = 140;
  const rings = [
    { value: move, max: 100, color: '#ef4444', r: 58 },
    { value: exercise, max: 100, color: '#4ade80', r: 46 },
    { value: stand, max: 100, color: '#22d3ee', r: 34 },
  ];

  return (
    <div className="wear-activity-rings" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {rings.map((ring, i) => {
          const circ = 2 * Math.PI * ring.r;
          const offset = circ - (ring.value / ring.max) * circ;
          return (
            <g key={i}>
              <circle cx={size / 2} cy={size / 2} r={ring.r} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
              <motion.circle cx={size / 2} cy={size / 2} r={ring.r} fill="none"
                stroke={ring.color} strokeWidth={10} strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ActivityPanel() {
  const [stepData] = useState(() => generateStepData());

  const today = {
    steps: 8420,
    distance: 6.2, // km
    activeMin: 48,
    floors: 12,
    cadence: 112,
    walkSpeed: 5.4, // km/h
    runPace: '5:42', // min/km
    strideLen: 0.78, // m
    jumpCount: 24,
    moveRing: 81,
    exerciseRing: 65,
    standRing: 92,
  };

  const activities = [
    { name: 'Walking', icon: '🚶', time: '32 min', cal: '142 kcal', color: '#4ade80' },
    { name: 'Running', icon: '🏃', time: '18 min', cal: '210 kcal', color: '#ef4444' },
    { name: 'Cycling', icon: '🚴', time: '25 min', cal: '180 kcal', color: '#3b82f6' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🏃</span>
        <h2>Activity & Movement</h2>
      </div>
      <p className="wear-section-subtitle">
        Steps, distance, active minutes, cadence, and automatic activity recognition
      </p>

      {/* Activity Rings + Key Metrics */}
      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="card-title">Activity Rings</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ActivityRings move={today.moveRing} exercise={today.exerciseRing} stand={today.standRing} />
            <div style={{ flex: 1 }}>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#ef4444' }} />
                  <span className="stat-name">Move</span>
                </div>
                <span className="stat-val" style={{ fontSize: '0.9rem', color: '#ef4444' }}>{today.moveRing}%</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#4ade80' }} />
                  <span className="stat-name">Exercise</span>
                </div>
                <span className="stat-val" style={{ fontSize: '0.9rem', color: '#4ade80' }}>{today.exerciseRing}%</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#22d3ee' }} />
                  <span className="stat-name">Stand</span>
                </div>
                <span className="stat-val" style={{ fontSize: '0.9rem', color: '#22d3ee' }}>{today.standRing}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Stats */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="card-title">Today's Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Steps', val: today.steps.toLocaleString(), color: '#3b82f6', icon: '👟' },
              { label: 'Distance', val: `${today.distance} km`, color: '#4ade80', icon: '📏' },
              { label: 'Active Min', val: `${today.activeMin} min`, color: '#fb923c', icon: '⚡' },
              { label: 'Floors', val: today.floors, color: '#a78bfa', icon: '🏢' },
              { label: 'Cadence', val: `${today.cadence} spm`, color: '#22d3ee', icon: '🦶' },
              { label: 'Walk Speed', val: `${today.walkSpeed} km/h`, color: '#818cf8', icon: '🚶' },
              { label: 'Run Pace', val: `${today.runPace} /km`, color: '#ef4444', icon: '🏃' },
              { label: 'Stride', val: `${today.strideLen} m`, color: '#facc15', icon: '📐' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0' }}>
                <span style={{ fontSize: '1rem' }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--wear-text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: m.color }}>{m.val}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Recognition */}
      <div className="wear-grid-3" style={{ marginBottom: '1.25rem' }}>
        {activities.map((a, i) => (
          <motion.div key={i} className="wear-metric-mini"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}>
            <div className="wear-metric-icon" style={{ background: `${a.color}18`, fontSize: '1.3rem' }}>{a.icon}</div>
            <div className="wear-metric-info">
              <div className="metric-label">{a.name}</div>
              <div className="metric-value" style={{ color: a.color }}>{a.time}</div>
              <div className="metric-sub">{a.cal}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Steps Chart */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="card-title">Weekly Step Count</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stepData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Bar dataKey="steps" fill="#3b82f6" name="Steps" radius={[6, 6, 0, 0]} />
            <Line dataKey="goal" stroke="#facc15" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="Goal" />
          </BarChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} /> Steps</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#facc15' }} /> Goal (10K)</span>
        </div>
      </motion.div>
    </div>
  );
}
