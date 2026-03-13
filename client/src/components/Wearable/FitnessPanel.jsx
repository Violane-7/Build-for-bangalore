import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

function generateVO2Trend(weeks = 8) {
  return Array.from({ length: weeks }, (_, i) => ({
    week: `W${i + 1}`,
    vo2: 38 + i * 0.5 + Math.random() * 2,
  }));
}

function CircularGauge({ value, max, size = 100, strokeWidth = 8, color, label }) {
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
        <span className="gauge-val" style={{ color, fontSize: '1.2rem' }}>{value}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

export default function FitnessPanel() {
  const [vo2Data] = useState(() => generateVO2Trend());

  const fitnessRadar = [
    { metric: 'Endurance', value: 75 },
    { metric: 'Speed', value: 62 },
    { metric: 'Power', value: 58 },
    { metric: 'Recovery', value: 80 },
    { metric: 'Flexibility', value: 45 },
    { metric: 'Cardio', value: 72 },
  ];

  const zones = [
    { name: 'Zone 1 (Warm Up)', range: '93-111 bpm', pct: 15, color: '#3b82f6' },
    { name: 'Zone 2 (Fat Burn)', range: '111-130 bpm', pct: 35, color: '#4ade80' },
    { name: 'Zone 3 (Cardio)', range: '130-148 bpm', pct: 30, color: '#facc15' },
    { name: 'Zone 4 (Hard)', range: '148-167 bpm', pct: 15, color: '#fb923c' },
    { name: 'Zone 5 (Max)', range: '167-185 bpm', pct: 5, color: '#ef4444' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">💪</span>
        <h2>Fitness Performance</h2>
      </div>
      <p className="wear-section-subtitle">
        VO₂ max trends, training load, workout intensity zones, recovery tracking, and lactate threshold
      </p>

      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* VO2 Max Trend */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="card-title">VO₂ Max — 8 Week Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={vo2Data}>
              <defs>
                <linearGradient id="vo2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#7a7a95', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[35, 50]} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="vo2" stroke="#4ade80" fill="url(#vo2Grad)" strokeWidth={2} name="VO₂ Max" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: '0.8rem', color: 'var(--wear-text-muted)', marginTop: '0.5rem' }}>
            Current: <strong style={{ color: '#4ade80' }}>42.3 mL/kg/min</strong> — Above Average
          </div>
        </motion.div>

        {/* Fitness Radar */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-title">Fitness Profile</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={fitnessRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#7a7a95', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Intensity Zones + Performance Metrics */}
      <div className="wear-grid-2">
        {/* Heart Rate Zones */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
          <div className="card-title">Workout Intensity Zones</div>
          {zones.map((z, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--wear-text)' }}>{z.name}</span>
                <span style={{ fontSize: '0.75rem', color: z.color, fontWeight: 700 }}>{z.pct}%</span>
              </div>
              <div className="wear-progress-bar">
                <motion.div className="bar-fill" style={{ background: z.color }}
                  initial={{ width: 0 }} whileInView={{ width: `${z.pct}%` }}
                  viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--wear-text-dim)', marginTop: '0.15rem' }}>{z.range}</div>
            </div>
          ))}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="card-title">Performance Metrics</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Training Load', val: '78', unit: '/ 100', color: '#fb923c', desc: 'Optimal' },
              { label: 'Recovery Time', val: '14h', unit: '', color: '#4ade80', desc: 'Ready tomorrow' },
              { label: 'Lactate Threshold', val: '158', unit: 'bpm', color: '#ef4444', desc: 'HR at threshold' },
              { label: 'Running Power', val: '245', unit: 'W', color: '#a78bfa', desc: 'Avg. wattage' },
              { label: 'Aerobic Effect', val: '3.2', unit: '/ 5', color: '#3b82f6', desc: 'Maintaining' },
              { label: 'Anaerobic Effect', val: '1.8', unit: '/ 5', color: '#facc15', desc: 'Low impact' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '0.5rem 0' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--wear-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: m.color, marginTop: '0.15rem' }}>
                  {m.val}<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--wear-text-muted)', marginLeft: '0.2rem' }}>{m.unit}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--wear-text-muted)' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
