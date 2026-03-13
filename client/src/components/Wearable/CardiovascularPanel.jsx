import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ── Simulated data generators ──────────────────────────
function generateHRData(days = 24) {
  return Array.from({ length: days }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    hr: 60 + Math.floor(Math.random() * 40) + (i > 6 && i < 22 ? 15 : 0),
    resting: 58 + Math.floor(Math.random() * 8),
  }));
}

function generateHRVData(days = 7) {
  return Array.from({ length: days }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    hrv: 35 + Math.floor(Math.random() * 30),
    avg: 48,
  }));
}

function generateBPData(days = 7) {
  return Array.from({ length: days }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    systolic: 115 + Math.floor(Math.random() * 15),
    diastolic: 72 + Math.floor(Math.random() * 10),
  }));
}

function generateECGPath() {
  const points = [];
  const w = 600;
  const mid = 60;
  for (let x = 0; x < w; x += 2) {
    const cycle = x % 150;
    let y = mid;
    if (cycle > 50 && cycle < 55) y = mid - 35;
    else if (cycle > 55 && cycle < 60) y = mid + 20;
    else if (cycle > 60 && cycle < 70) y = mid - 50;
    else if (cycle > 70 && cycle < 75) y = mid + 15;
    else if (cycle > 75 && cycle < 85) y = mid - 10;
    else y += (Math.random() - 0.5) * 3;
    points.push(`${x},${y}`);
  }
  return `M${points.join(' L')}`;
}

// ── Circular Gauge Component ───────────────────────────
function CircularGauge({ value, max, size = 120, strokeWidth = 8, color, label, unit }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="wear-circular-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="gauge-bg" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="gauge-fill"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-val" style={{ color }}>{value}</span>
        <span className="gauge-label">{unit || label}</span>
      </div>
    </div>
  );
}

export default function CardiovascularPanel() {
  const [hrData] = useState(() => generateHRData());
  const [hrvData] = useState(() => generateHRVData());
  const [bpData] = useState(() => generateBPData());
  const [ecgPath] = useState(() => generateECGPath());
  const [currentHR, setCurrentHR] = useState(72);
  const ecgRef = useRef(null);

  // Simulate live HR
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentHR(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(58, Math.min(105, prev + delta));
      });
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">❤️</span>
        <h2>Cardiovascular</h2>
      </div>
      <p className="wear-section-subtitle">
        Heart rate, rhythm analysis, blood pressure, and cardiac fitness tracking
      </p>

      {/* Top: Live HR + ECG */}
      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Live Heart Rate */}
        <motion.div
          className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="card-title">Live Heart Rate</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <CircularGauge value={currentHR} max={200} size={130} strokeWidth={10} color="#ef4444" unit="BPM" />
            <div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#ef4444' }} />
                  <span className="stat-name">Current</span>
                </div>
                <span className="stat-val" style={{ color: '#ef4444' }}>{currentHR} bpm</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#818cf8' }} />
                  <span className="stat-name">Resting</span>
                </div>
                <span className="stat-val" style={{ color: '#818cf8' }}>62 bpm</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#4ade80' }} />
                  <span className="stat-name">Max Today</span>
                </div>
                <span className="stat-val" style={{ color: '#4ade80' }}>142 bpm</span>
              </div>
              <div className="wear-stat-row">
                <div className="stat-left">
                  <span className="stat-dot" style={{ background: '#facc15' }} />
                  <span className="stat-name">Avg Today</span>
                </div>
                <span className="stat-val" style={{ color: '#facc15' }}>78 bpm</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="wear-trend-tag up">Normal Sinus Rhythm</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ECG / EKG */}
        <motion.div
          className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">ECG / Electrocardiogram</div>
            <span className="wear-trend-tag up">No AFib detected</span>
          </div>
          <div className="wear-ecg-container" ref={ecgRef}>
            <svg viewBox="0 0 600 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 20} x2="600" y2={i * 20}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              ))}
              <path
                d={ecgPath}
                className="wear-ecg-line"
                stroke="url(#ecgGrad)"
                strokeDasharray="1200"
                style={{ animation: 'ecgSweep 4s linear infinite' }}
              />
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
              PR Interval: <strong style={{ color: 'var(--wear-text)' }}>162ms</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
              QRS Duration: <strong style={{ color: 'var(--wear-text)' }}>98ms</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
              QT/QTc: <strong style={{ color: 'var(--wear-text)' }}>412/428ms</strong>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Heart Rate Over 24h */}
      <motion.div
        className="wear-glass-card"
        style={{ marginBottom: '1.25rem' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="card-title">Heart Rate — 24 Hour Trend</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={hrData}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#7a7a95', fontSize: 11 }} interval={3} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 11 }} domain={[50, 120]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(20,20,35,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
              }}
            />
            <Area type="monotone" dataKey="hr" stroke="#ef4444" fill="url(#hrGrad)" strokeWidth={2} name="Heart Rate" />
            <Line type="monotone" dataKey="resting" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Resting HR" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Heart Rate</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#818cf8' }} /> Resting HR</span>
        </div>
      </motion.div>

      {/* HRV + Blood Pressure + Cardio Score */}
      <div className="wear-grid-3">
        {/* HRV */}
        <motion.div
          className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-title">Heart Rate Variability</div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={hrvData}>
              <defs>
                <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[20, 80]} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="hrv" stroke="#a78bfa" fill="url(#hrvGrad)" strokeWidth={2} name="HRV (ms)" />
              <Line type="monotone" dataKey="avg" stroke="#facc15" strokeDasharray="4 4" dot={false} strokeWidth={1} name="Weekly Avg" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize: '0.8rem', color: 'var(--wear-text-muted)', marginTop: '0.5rem' }}>
            Current: <strong style={{ color: '#a78bfa' }}>48ms</strong> — Good autonomic balance
          </div>
        </motion.div>

        {/* Blood Pressure */}
        <motion.div
          className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="card-title">Blood Pressure (Est.)</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 10 }} />
              <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[60, 140]} />
              <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
          <div className="wear-legend">
            <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Systolic</span>
            <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} /> Diastolic</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--wear-text-muted)', marginTop: '0.25rem' }}>
            Latest: <strong style={{ color: 'var(--wear-text)' }}>118/76 mmHg</strong> — Normal
          </div>
        </motion.div>

        {/* Cardio Fitness */}
        <motion.div
          className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card-title">Cardio Fitness Score</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0.5rem' }}>
            <CircularGauge value={42} max={60} size={120} strokeWidth={10} color="#4ade80" unit="VO₂ Max" />
            <div style={{ marginTop: '1rem', width: '100%' }}>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.8rem' }}>Pulse Transit Time</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#22d3ee' }}>185ms</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.8rem' }}>Pulse Wave Velocity</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#fb923c' }}>6.8 m/s</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name" style={{ fontSize: '0.8rem' }}>Arterial Stiffness</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#4ade80' }}>Low</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
