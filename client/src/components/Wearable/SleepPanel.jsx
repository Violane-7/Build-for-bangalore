import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function generateSleepWeek() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => {
    const deep = 0.8 + Math.random() * 1.5;
    const light = 2 + Math.random() * 2;
    const rem = 1 + Math.random() * 1.5;
    const awake = 0.2 + Math.random() * 0.5;
    return { day: d, deep: +deep.toFixed(1), light: +light.toFixed(1), rem: +rem.toFixed(1), awake: +awake.toFixed(1) };
  });
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
        <span className="gauge-val" style={{ color, fontSize: '1.3rem' }}>{value}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

export default function SleepPanel() {
  const [weekData] = useState(() => generateSleepWeek());

  const lastNight = {
    total: 7.2,
    deep: 1.8,
    light: 3.1,
    rem: 1.9,
    awake: 0.4,
    score: 82,
    efficiency: 91,
    disturbances: 3,
    snoring: 12, // minutes
  };

  const stagePercents = {
    deep: Math.round((lastNight.deep / lastNight.total) * 100),
    light: Math.round((lastNight.light / lastNight.total) * 100),
    rem: Math.round((lastNight.rem / lastNight.total) * 100),
    awake: Math.round((lastNight.awake / lastNight.total) * 100),
  };

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🌙</span>
        <h2>Sleep Metrics</h2>
      </div>
      <p className="wear-section-subtitle">
        Sleep stage analysis, quality scoring, disturbance detection, and apnea monitoring
      </p>

      {/* Sleep Score + Duration + Stages */}
      <div className="wear-grid-3" style={{ marginBottom: '1.25rem' }}>
        {/* Sleep Score */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="card-title">Sleep Score</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularGauge value={lastNight.score} max={100} size={120} strokeWidth={10}
              color={lastNight.score >= 80 ? '#4ade80' : lastNight.score >= 60 ? '#facc15' : '#ef4444'}
              label="/ 100" />
            <span className="wear-trend-tag up" style={{ marginTop: '0.75rem' }}>
              {lastNight.score >= 80 ? 'Excellent' : lastNight.score >= 60 ? 'Good' : 'Poor'}
            </span>
          </div>
        </motion.div>

        {/* Sleep Duration + Efficiency */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="card-title">Last Night</div>
          <div className="card-value" style={{ color: '#a78bfa' }}>{lastNight.total}<span className="card-unit">hrs</span></div>
          <div style={{ marginTop: '0.75rem' }}>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Efficiency</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: '#4ade80' }}>{lastNight.efficiency}%</span>
            </div>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Disturbances</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: '#fb923c' }}>{lastNight.disturbances}</span>
            </div>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Snoring</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: '#facc15' }}>{lastNight.snoring} min</span>
            </div>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Sleep Apnea</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: '#4ade80' }}>Not detected</span>
            </div>
          </div>
        </motion.div>

        {/* Sleep Stages Breakdown */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="card-title">Sleep Stages</div>
          <div className="wear-sleep-bar" style={{ marginBottom: '1rem' }}>
            <motion.div className="stage stage-awake"
              initial={{ width: 0 }} whileInView={{ width: `${stagePercents.awake}%` }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
            <motion.div className="stage stage-light"
              initial={{ width: 0 }} whileInView={{ width: `${stagePercents.light}%` }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} />
            <motion.div className="stage stage-deep"
              initial={{ width: 0 }} whileInView={{ width: `${stagePercents.deep}%` }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
            <motion.div className="stage stage-rem"
              initial={{ width: 0 }} whileInView={{ width: `${stagePercents.rem}%` }}
              viewport={{ once: true }} transition={{ duration: 1, delay: 0.6 }} />
          </div>
          <div className="wear-stat-row">
            <div className="stat-left">
              <span className="stat-dot" style={{ background: '#fb923c' }} />
              <span className="stat-name">Awake</span>
            </div>
            <span className="stat-val" style={{ fontSize: '0.85rem' }}>{lastNight.awake}h ({stagePercents.awake}%)</span>
          </div>
          <div className="wear-stat-row">
            <div className="stat-left">
              <span className="stat-dot" style={{ background: '#22d3ee', opacity: 0.6 }} />
              <span className="stat-name">Light</span>
            </div>
            <span className="stat-val" style={{ fontSize: '0.85rem' }}>{lastNight.light}h ({stagePercents.light}%)</span>
          </div>
          <div className="wear-stat-row">
            <div className="stat-left">
              <span className="stat-dot" style={{ background: '#818cf8' }} />
              <span className="stat-name">Deep</span>
            </div>
            <span className="stat-val" style={{ fontSize: '0.85rem' }}>{lastNight.deep}h ({stagePercents.deep}%)</span>
          </div>
          <div className="wear-stat-row">
            <div className="stat-left">
              <span className="stat-dot" style={{ background: '#a78bfa' }} />
              <span className="stat-name">REM</span>
            </div>
            <span className="stat-val" style={{ fontSize: '0.85rem' }}>{lastNight.rem}h ({stagePercents.rem}%)</span>
          </div>
        </motion.div>
      </div>

      {/* Weekly Sleep Chart */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        <div className="card-title">Weekly Sleep Stages</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Bar dataKey="deep" stackId="a" fill="#818cf8" name="Deep" radius={[0, 0, 0, 0]} />
            <Bar dataKey="light" stackId="a" fill="rgba(34,211,238,0.5)" name="Light" />
            <Bar dataKey="rem" stackId="a" fill="#a78bfa" name="REM" />
            <Bar dataKey="awake" stackId="a" fill="#fb923c" name="Awake" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#818cf8' }} /> Deep</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: 'rgba(34,211,238,0.5)' }} /> Light</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#a78bfa' }} /> REM</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#fb923c' }} /> Awake</span>
        </div>
      </motion.div>
    </div>
  );
}
