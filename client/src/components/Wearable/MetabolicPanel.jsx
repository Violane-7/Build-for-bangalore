import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function generateCalData(days = 7) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return labels.map(d => ({
    day: d,
    active: 300 + Math.floor(Math.random() * 400),
    basal: 1400 + Math.floor(Math.random() * 200),
  }));
}

function CircularGauge({ value, max, size = 100, strokeWidth = 8, color, label }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(value, max) / max) * circ;
  return (
    <div className="wear-circular-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="gauge-bg" cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} />
        <circle className="gauge-fill" cx={size / 2} cy={size / 2} r={r}
          strokeWidth={strokeWidth} stroke={color}
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-center">
        <span className="gauge-val" style={{ color, fontSize: '1.2rem' }}>{value}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

export default function MetabolicPanel() {
  const [calData] = useState(() => generateCalData());
  const hydration = 65; // percentage

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🔥</span>
        <h2>Metabolic</h2>
      </div>
      <p className="wear-section-subtitle">
        Calorie expenditure, basal metabolic rate, energy balance, and hydration tracking
      </p>

      <div className="wear-grid-4" style={{ marginBottom: '1.25rem' }}>
        {/* Active Calories */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="card-title">Active Calories</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularGauge value={486} max={600} size={100} strokeWidth={8} color="#fb923c" label="KCAL" />
            <div className="wear-progress-bar" style={{ width: '100%', marginTop: '0.75rem' }}>
              <motion.div className="bar-fill" style={{ background: '#fb923c' }}
                initial={{ width: 0 }} whileInView={{ width: '81%' }}
                viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)', marginTop: '0.4rem' }}>486 / 600 goal</div>
          </div>
        </motion.div>

        {/* BMR */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="card-title">Basal Metabolic Rate</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card-value" style={{ color: '#818cf8' }}>1,620</div>
            <div className="card-unit">kcal/day</div>
            <div className="card-subtitle" style={{ marginTop: '0.75rem' }}>
              Based on body composition, age, and recent activity data
            </div>
            <span className="wear-trend-tag neutral" style={{ marginTop: '0.5rem' }}>Stable</span>
          </div>
        </motion.div>

        {/* Total Energy */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="card-title">Total Energy Expenditure</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card-value" style={{ color: '#ef4444' }}>2,106</div>
            <div className="card-unit">kcal</div>
            <div style={{ width: '100%', marginTop: '0.75rem' }}>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.75rem' }}>Basal</span>
                <span className="stat-val" style={{ fontSize: '0.8rem', color: '#818cf8' }}>1,620</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.75rem' }}>Active</span>
                <span className="stat-val" style={{ fontSize: '0.8rem', color: '#fb923c' }}>486</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hydration */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
          <div className="card-title">Hydration Level</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularGauge value={hydration} max={100} size={100} strokeWidth={8} color="#3b82f6" label="%" />
            <div style={{ width: '100%', marginTop: '0.75rem' }}>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.75rem' }}>Water Intake</span>
                <span className="stat-val" style={{ fontSize: '0.8rem', color: '#3b82f6' }}>1.8L</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.75rem' }}>Goal</span>
                <span className="stat-val" style={{ fontSize: '0.8rem', color: '#7a7a95' }}>2.8L</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Calorie Chart */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="card-title">Weekly Calorie Breakdown</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={calData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Bar dataKey="basal" fill="#818cf8" name="Basal" radius={[4, 4, 0, 0]} opacity={0.5} />
            <Bar dataKey="active" fill="#fb923c" name="Active" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#818cf8' }} /> Basal</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#fb923c' }} /> Active</span>
        </div>
      </motion.div>
    </div>
  );
}
