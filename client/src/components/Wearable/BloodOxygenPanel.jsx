import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

function generateSpO2Data(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    spo2: 95 + Math.floor(Math.random() * 5),
    respRate: 12 + Math.floor(Math.random() * 8),
  }));
}

function CircularGauge({ value, max, size = 110, strokeWidth = 8, color, label }) {
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
        <span className="gauge-val" style={{ color, fontSize: '1.5rem' }}>{value}%</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

export default function BloodOxygenPanel() {
  const [data] = useState(() => generateSpO2Data());
  const [spo2, setSpo2] = useState(97);

  useEffect(() => {
    const iv = setInterval(() => {
      setSpo2(prev => {
        const d = Math.floor(Math.random() * 3) - 1;
        return Math.max(94, Math.min(100, prev + d));
      });
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🫁</span>
        <h2>Blood & Oxygen</h2>
      </div>
      <p className="wear-section-subtitle">
        Blood oxygen saturation, respiratory rate, hemoglobin estimation, and perfusion index
      </p>

      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* SpO2 Gauge */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="card-title">Blood Oxygen (SpO₂)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <CircularGauge value={spo2} max={100} size={130} strokeWidth={10} color="#22d3ee" label="SpO₂" />
            <div style={{ flex: 1 }}>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#22d3ee' }} />
                  <span className="stat-name">Current</span>
                </div>
                <span className="stat-val" style={{ color: '#22d3ee' }}>{spo2}%</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#818cf8' }} />
                  <span className="stat-name">Avg Today</span>
                </div>
                <span className="stat-val" style={{ color: '#818cf8' }}>97%</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#fb923c' }} />
                  <span className="stat-name">Low Today</span>
                </div>
                <span className="stat-val" style={{ color: '#fb923c' }}>94%</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="wear-trend-tag up">Normal Range</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Respiratory Rate */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-title">Respiratory Rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <CircularGauge value={16} max={30} size={130} strokeWidth={10} color="#4ade80" label="BR/MIN" />
            <div style={{ flex: 1 }}>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#4ade80' }} />
                  <span className="stat-name">Current</span>
                </div>
                <span className="stat-val" style={{ color: '#4ade80' }}>16 br/min</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#a78bfa' }} />
                  <span className="stat-name">Sleep Avg</span>
                </div>
                <span className="stat-val" style={{ color: '#a78bfa' }}>13 br/min</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#facc15' }} />
                  <span className="stat-name">Exercise Peak</span>
                </div>
                <span className="stat-val" style={{ color: '#facc15' }}>28 br/min</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SpO2 24h Trend */}
      <motion.div className="wear-glass-card" style={{ marginBottom: '1.25rem' }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        <div className="card-title">SpO₂ & Respiratory Rate — 24 Hour Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#7a7a95', fontSize: 10 }} interval={3} />
            <YAxis yAxisId="left" tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[90, 100]} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[8, 30]} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Area yAxisId="left" type="monotone" dataKey="spo2" stroke="#22d3ee" fill="url(#spo2Grad)" strokeWidth={2} name="SpO₂ (%)" />
            <Line yAxisId="right" type="monotone" dataKey="respRate" stroke="#4ade80" strokeWidth={1.5} dot={false} name="Resp Rate" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#22d3ee' }} /> SpO₂</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#4ade80' }} /> Respiratory Rate</span>
        </div>
      </motion.div>

      {/* Additional metrics */}
      <div className="wear-grid-3">
        <motion.div className="wear-metric-mini" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="wear-metric-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>🩸</div>
          <div className="wear-metric-info">
            <div className="metric-label">Hemoglobin (Est.)</div>
            <div className="metric-value" style={{ color: '#ef4444' }}>14.2 g/dL</div>
            <div className="metric-sub">Normal range</div>
          </div>
        </motion.div>

        <motion.div className="wear-metric-mini" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}>
          <div className="wear-metric-icon" style={{ background: 'rgba(167,139,250,0.12)' }}>💧</div>
          <div className="wear-metric-info">
            <div className="metric-label">Perfusion Index</div>
            <div className="metric-value" style={{ color: '#a78bfa' }}>4.2%</div>
            <div className="metric-sub">Strong peripheral flow</div>
          </div>
        </motion.div>

        <motion.div className="wear-metric-mini" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="wear-metric-icon" style={{ background: 'rgba(74,222,128,0.12)' }}>🌬️</div>
          <div className="wear-metric-info">
            <div className="metric-label">Breathing Pattern</div>
            <div className="metric-value" style={{ color: '#4ade80' }}>Regular</div>
            <div className="metric-sub">No apnea events</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
