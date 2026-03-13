import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCreative } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { useVitals } from '../../context/VitalsContext';

// ── Simulated Data ─────────────────────────────────────
function generateHRData() {
  return Array.from({ length: 12 }, (_, i) => ({
    t: `${(i * 2).toString().padStart(2, '0')}:00`,
    hr: 62 + Math.floor(Math.random() * 35) + (i > 3 && i < 10 ? 12 : 0),
  }));
}
function generateSleepData() {
  return [
    { stage: 'Deep', hours: 1.8, color: '#6366f1' },
    { stage: 'Light', hours: 3.2, color: '#a5b4fc' },
    { stage: 'REM', hours: 1.5, color: '#c4b5fd' },
    { stage: 'Awake', hours: 0.4, color: '#4b5563' },
  ];
}
function generateStepsData() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
    steps: 4000 + Math.floor(Math.random() * 8000),
  }));
}

// ── Watch Face Components ──────────────────────────────
function HeartFace({ hr, onTap }) {
  const circ = 2 * Math.PI * 52;
  const percent = Math.min(hr / 180, 1);

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Heart Rate</span>
        <span className="wf-icon">❤️</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-ring">
          <svg width={120} height={120}>
            <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={60} cy={60} r={52} fill="none" stroke="#ef4444" strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - percent)} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="wf-ring-val" style={{ color: '#ef4444' }}>{hr}</span>
          <span className="wf-ring-label">BPM</span>
        </div>
        <div className="wf-row" style={{ marginTop: 16, width: '100%' }}>
          <span className="wf-row-name">Resting</span>
          <span className="wf-row-val" style={{ color: '#818cf8' }}>62</span>
        </div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Max Today</span>
          <span className="wf-row-val" style={{ color: '#4ade80' }}>142</span>
        </div>
      </div>
      <div className="wf-sub">Normal Sinus Rhythm</div>
    </div>
  );
}

function OxygenFace({ spo2, onTap }) {
  const circ = 2 * Math.PI * 52;
  const percent = (spo2 - 90) / 10;

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Blood Oxygen</span>
        <span className="wf-icon">💧</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-ring">
          <svg width={120} height={120}>
            <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={60} cy={60} r={52} fill="none" stroke="#22d3ee" strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - percent)} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="wf-ring-val" style={{ color: '#22d3ee' }}>{spo2}%</span>
          <span className="wf-ring-label">SpO₂</span>
        </div>
        <div className="wf-row" style={{ marginTop: 16, width: '100%' }}>
          <span className="wf-row-name">Range Today</span>
          <span className="wf-row-val" style={{ color: '#22d3ee' }}>95-99%</span>
        </div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Avg (7 days)</span>
          <span className="wf-row-val" style={{ color: '#818cf8' }}>97%</span>
        </div>
      </div>
      <div className="wf-sub">Healthy oxygen levels</div>
    </div>
  );
}

function ActivityFace({ steps, onTap }) {
  const moveP = Math.min(steps / 10000, 1);
  const exP = 0.72;
  const standP = 0.85;

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Activity</span>
        <span className="wf-icon">🏃</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-rings-group">
          <svg width={120} height={120}>
            {[
              { p: moveP, color: '#ef4444', r: 52 },
              { p: exP, color: '#4ade80', r: 42 },
              { p: standP, color: '#22d3ee', r: 32 },
            ].map((ring, i) => {
              const circ = 2 * Math.PI * ring.r;
              return (
                <g key={i}>
                  <circle cx={60} cy={60} r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
                  <circle cx={60} cy={60} r={ring.r} fill="none" stroke={ring.color} strokeWidth={7} strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - ring.p)} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
                </g>
              );
            })}
          </svg>
        </div>
        <div className="wf-grid" style={{ marginTop: 12 }}>
          <div className="wf-grid-cell">
            <div className="gc-label">Steps</div>
            <div className="gc-val" style={{ color: '#ef4444' }}>{steps.toLocaleString()}</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Calories</div>
            <div className="gc-val" style={{ color: '#fb923c' }}>486</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Distance</div>
            <div className="gc-val" style={{ color: '#4ade80' }}>5.2km</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Active</div>
            <div className="gc-val" style={{ color: '#22d3ee' }}>48m</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SleepFace({ sleepData, onTap }) {
  const totalHours = sleepData.reduce((a, b) => a + b.hours, 0);

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Sleep</span>
        <span className="wf-icon">🌙</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-big" style={{ color: '#a78bfa' }}>{totalHours.toFixed(1)}<span className="wf-unit">hrs</span></div>
        <div className="wf-sub" style={{ marginBottom: 12 }}>Last night</div>
        <div className="wf-stages">
          {sleepData.map((s, i) => (
            <div key={i} style={{ flex: s.hours, background: s.color }} title={`${s.stage}: ${s.hours}h`} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: '0.6rem', color: '#777' }}>
          {sleepData.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: s.color }} />
              {s.stage}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StressFace({ stress, onTap }) {
  const circ = 2 * Math.PI * 52;
  const percent = stress / 100;
  const stressColor = stress < 40 ? '#4ade80' : stress < 70 ? '#facc15' : '#ef4444';
  const stressLabel = stress < 40 ? 'Low' : stress < 70 ? 'Moderate' : 'High';

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Stress</span>
        <span className="wf-icon">🧘</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-ring">
          <svg width={120} height={120}>
            <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={60} cy={60} r={52} fill="none" stroke={stressColor} strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - percent)} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="wf-ring-val" style={{ color: stressColor }}>{stress}</span>
          <span className="wf-ring-label">{stressLabel}</span>
        </div>
        <div className="wf-row" style={{ marginTop: 16, width: '100%' }}>
          <span className="wf-row-name">HRV</span>
          <span className="wf-row-val" style={{ color: '#a78bfa' }}>48ms</span>
        </div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Recovery</span>
          <span className="wf-row-val" style={{ color: '#4ade80' }}>Good</span>
        </div>
      </div>
      <div className="wf-sub">Based on heart rate variability</div>
    </div>
  );
}

function TemperatureFace({ temp, onTap }) {
  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Temperature</span>
        <span className="wf-icon">🌡️</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-big" style={{ color: '#fb923c' }}>{temp.toFixed(1)}<span className="wf-unit">°C</span></div>
        <div className="wf-sub" style={{ marginBottom: 16 }}>Skin temperature</div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Baseline</span>
          <span className="wf-row-val" style={{ color: '#818cf8' }}>36.6°C</span>
        </div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Variation</span>
          <span className="wf-row-val" style={{ color: '#4ade80' }}>+0.2°C</span>
        </div>
      </div>
      <div className="wf-sub">Within normal range</div>
    </div>
  );
}

function ECGFace({ onTap }) {
  const ecgPoints = [];
  for (let x = 0; x < 280; x += 2) {
    const cycle = x % 70;
    let y = 40;
    if (cycle > 25 && cycle < 28) y = 20;
    else if (cycle > 28 && cycle < 32) y = 55;
    else if (cycle > 32 && cycle < 38) y = 8;
    else if (cycle > 38 && cycle < 42) y = 50;
    else if (cycle > 42 && cycle < 48) y = 35;
    else y += (Math.random() - 0.5) * 2;
    ecgPoints.push(`${x},${y}`);
  }
  const ecgPath = `M${ecgPoints.join(' L')}`;

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">ECG</span>
        <span className="wf-icon">📈</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-ecg">
          <svg viewBox="0 0 280 70" preserveAspectRatio="none">
            <path d={ecgPath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: '0.65rem' }}>
          <div>
            <span style={{ color: '#666' }}>PR: </span>
            <span style={{ color: '#ddd' }}>162ms</span>
          </div>
          <div>
            <span style={{ color: '#666' }}>QRS: </span>
            <span style={{ color: '#ddd' }}>98ms</span>
          </div>
        </div>
      </div>
      <div className="wf-sub" style={{ color: '#4ade80' }}>No irregularities detected</div>
    </div>
  );
}

function FitnessFace({ vo2max, onTap }) {
  const circ = 2 * Math.PI * 52;
  const percent = vo2max / 60;

  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Fitness</span>
        <span className="wf-icon">💪</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-ring">
          <svg width={120} height={120}>
            <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle cx={60} cy={60} r={52} fill="none" stroke="#4ade80" strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - percent)} style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <span className="wf-ring-val" style={{ color: '#4ade80' }}>{vo2max}</span>
          <span className="wf-ring-label">VO₂ Max</span>
        </div>
        <div className="wf-row" style={{ marginTop: 16, width: '100%' }}>
          <span className="wf-row-name">Cardio Age</span>
          <span className="wf-row-val" style={{ color: '#22d3ee' }}>28</span>
        </div>
        <div className="wf-row" style={{ width: '100%' }}>
          <span className="wf-row-name">Level</span>
          <span className="wf-row-val" style={{ color: '#4ade80' }}>Good</span>
        </div>
      </div>
    </div>
  );
}

function SafetyFace({ onTap }) {
  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Safety</span>
        <span className="wf-icon">🛡️</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div className="wf-alert">
          <span className="wf-alert-dot" style={{ background: '#4ade80' }} />
          <span className="wf-alert-text">Fall Detection: Active</span>
        </div>
        <div className="wf-alert">
          <span className="wf-alert-dot" style={{ background: '#4ade80' }} />
          <span className="wf-alert-text">Emergency SOS: Ready</span>
        </div>
        <div className="wf-alert">
          <span className="wf-alert-dot" style={{ background: '#4ade80' }} />
          <span className="wf-alert-text">Heart Alerts: On</span>
        </div>
        <div className="wf-alert">
          <span className="wf-alert-dot" style={{ background: '#4ade80' }} />
          <span className="wf-alert-text">GPS Tracking: Enabled</span>
        </div>
      </div>
      <div className="wf-sub">All safety features active</div>
    </div>
  );
}

function EnvironmentFace({ onTap }) {
  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Environment</span>
        <span className="wf-icon">🌍</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-grid">
          <div className="wf-grid-cell">
            <div className="gc-label">UV Index</div>
            <div className="gc-val" style={{ color: '#facc15' }}>4</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Altitude</div>
            <div className="gc-val" style={{ color: '#22d3ee' }}>245m</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Noise</div>
            <div className="gc-val" style={{ color: '#4ade80' }}>42dB</div>
          </div>
          <div className="wf-grid-cell">
            <div className="gc-label">Humidity</div>
            <div className="gc-val" style={{ color: '#818cf8' }}>58%</div>
          </div>
        </div>
      </div>
      <div className="wf-sub">Environmental conditions</div>
    </div>
  );
}

function WomensHealthFace({ cycleDay, onTap }) {
  return (
    <div className="wf" onClick={onTap}>
      <div className="wf-head">
        <span className="wf-label">Cycle</span>
        <span className="wf-icon">🌸</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wf-big" style={{ color: '#f472b6' }}>Day {cycleDay}</div>
        <div className="wf-sub" style={{ marginBottom: 12 }}>Follicular phase</div>
        <div className="wf-cycle-days">
          {Array.from({ length: 28 }, (_, i) => (
            <div key={i} className="wf-cday" style={{
              background: i < 5 ? 'rgba(239,68,68,0.3)' : i >= 12 && i <= 16 ? 'rgba(244,114,182,0.3)' : 'rgba(255,255,255,0.03)',
              color: i + 1 === cycleDay ? '#fff' : undefined,
              border: i + 1 === cycleDay ? '1px solid #f472b6' : undefined,
            }}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Detail Panels ──────────────────────────────────────
function HeartDetail({ hr, hrData }) {
  return (
    <div className="w-detail-content">
      <h3 className="w-det-section">Heart Rate Details</h3>
      <div className="w-dcard">
        <div className="w-dcard-title">24 Hour Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={hrData}>
            <defs>
              <linearGradient id="hrGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} domain={[50, 120]} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
            <Area type="monotone" dataKey="hr" stroke="#ef4444" fill="url(#hrGrad2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Statistics</div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#ef4444' }} />
            <span className="w-drow-name">Current</span>
          </div>
          <span className="w-drow-val" style={{ color: '#ef4444' }}>{hr} bpm</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#818cf8' }} />
            <span className="w-drow-name">Resting</span>
          </div>
          <span className="w-drow-val" style={{ color: '#818cf8' }}>62 bpm</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#4ade80' }} />
            <span className="w-drow-name">Max Today</span>
          </div>
          <span className="w-drow-val" style={{ color: '#4ade80' }}>142 bpm</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#facc15' }} />
            <span className="w-drow-name">Avg Today</span>
          </div>
          <span className="w-drow-val" style={{ color: '#facc15' }}>78 bpm</span>
        </div>
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Heart Rate Zones</div>
        {[
          { name: 'Rest', range: '50-60', pct: 35, color: '#6366f1' },
          { name: 'Fat Burn', range: '60-70%', pct: 28, color: '#22d3ee' },
          { name: 'Cardio', range: '70-85%', pct: 22, color: '#4ade80' },
          { name: 'Peak', range: '85-100%', pct: 15, color: '#ef4444' },
        ].map((z, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
              <span style={{ color: '#888' }}>{z.name} <span style={{ color: '#555' }}>({z.range})</span></span>
              <span style={{ color: z.color }}>{z.pct}%</span>
            </div>
            <div className="w-dprog">
              <div className="w-dprog-fill" style={{ width: `${z.pct}%`, background: z.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityDetail({ steps, stepsData }) {
  return (
    <div className="w-detail-content">
      <h3 className="w-det-section">Activity Details</h3>
      <div className="w-dcard">
        <div className="w-dcard-title">Weekly Steps</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={stepsData}>
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
            <Bar dataKey="steps" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Today's Summary</div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#ef4444' }} />
            <span className="w-drow-name">Steps</span>
          </div>
          <span className="w-drow-val" style={{ color: '#ef4444' }}>{steps.toLocaleString()}</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#fb923c' }} />
            <span className="w-drow-name">Calories</span>
          </div>
          <span className="w-drow-val" style={{ color: '#fb923c' }}>486 kcal</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#4ade80' }} />
            <span className="w-drow-name">Distance</span>
          </div>
          <span className="w-drow-val" style={{ color: '#4ade80' }}>5.2 km</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#22d3ee' }} />
            <span className="w-drow-name">Active Minutes</span>
          </div>
          <span className="w-drow-val" style={{ color: '#22d3ee' }}>48 min</span>
        </div>
        <div className="w-drow">
          <div className="w-drow-left">
            <span className="w-drow-dot" style={{ background: '#818cf8' }} />
            <span className="w-drow-name">Floors Climbed</span>
          </div>
          <span className="w-drow-val" style={{ color: '#818cf8' }}>12</span>
        </div>
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Goals Progress</div>
        {[
          { name: 'Steps', current: steps, goal: 10000, color: '#ef4444' },
          { name: 'Calories', current: 486, goal: 600, color: '#fb923c' },
          { name: 'Distance', current: 5.2, goal: 8, color: '#4ade80', unit: 'km' },
        ].map((g, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
              <span style={{ color: '#888' }}>{g.name}</span>
              <span style={{ color: g.color }}>{g.current.toLocaleString()} / {g.goal.toLocaleString()}{g.unit || ''}</span>
            </div>
            <div className="w-dprog">
              <div className="w-dprog-fill" style={{ width: `${Math.min((g.current / g.goal) * 100, 100)}%`, background: g.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SleepDetail({ sleepData }) {
  const totalHours = sleepData.reduce((a, b) => a + b.hours, 0);

  return (
    <div className="w-detail-content">
      <h3 className="w-det-section">Sleep Details</h3>
      <div className="w-dcard">
        <div className="w-dcard-title">Last Night's Sleep</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 300, color: '#a78bfa' }}>{totalHours.toFixed(1)}</span>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>hours</span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <span className="w-tag" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>85 Sleep Score</span>
        </div>
        <div className="w-drow">
          <span className="w-drow-name">Bedtime</span>
          <span className="w-drow-val">11:24 PM</span>
        </div>
        <div className="w-drow">
          <span className="w-drow-name">Wake Time</span>
          <span className="w-drow-val">6:18 AM</span>
        </div>
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Sleep Stages</div>
        {sleepData.map((s, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ color: '#888' }}>{s.stage}</span>
              </div>
              <span style={{ color: s.color }}>{s.hours}h</span>
            </div>
            <div className="w-dprog">
              <div className="w-dprog-fill" style={{ width: `${(s.hours / totalHours) * 100}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Sleep Quality Metrics</div>
        <div className="w-drow">
          <span className="w-drow-name">Sleep Efficiency</span>
          <span className="w-drow-val" style={{ color: '#4ade80' }}>92%</span>
        </div>
        <div className="w-drow">
          <span className="w-drow-name">Time to Fall Asleep</span>
          <span className="w-drow-val">12 min</span>
        </div>
        <div className="w-drow">
          <span className="w-drow-name">Awakenings</span>
          <span className="w-drow-val">2</span>
        </div>
        <div className="w-drow">
          <span className="w-drow-name">Snoring</span>
          <span className="w-drow-val" style={{ color: '#4ade80' }}>Low</span>
        </div>
      </div>
    </div>
  );
}

function GenericDetail({ title, icon }) {
  return (
    <div className="w-detail-content">
      <h3 className="w-det-section">{title} Details</h3>
      <div className="w-dcard">
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <span style={{ fontSize: '3rem', opacity: 0.4 }}>{icon}</span>
          <p style={{ color: '#555', marginTop: '1rem', fontSize: '0.85rem' }}>
            Tap the watch face for detailed {title.toLowerCase()} metrics and trends.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function BigWatchDashboard() {
  const navigate = useNavigate();
  const { vitals, scenario, isWearableConnected, simulateScenario, connectWearable, disconnectWearable } = useVitals();

  // Use vitals from context
  const hr = vitals.heartRate || 72;
  const spo2 = vitals.spo2 || 97;
  const temp = vitals.temperature || 36.8;

  const [steps] = useState(8420);
  const [stress] = useState(35);
  const [vo2max] = useState(42);
  const [cycleDay] = useState(14);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hrData] = useState(() => generateHRData());
  const [sleepData] = useState(() => generateSleepData());
  const [stepsData] = useState(() => generateStepsData());
  const [time, setTime] = useState(new Date());
  const [showDemoPanel, setShowDemoPanel] = useState(false);
  const swiperRef = useRef(null);

  // Connect wearable on mount
  useEffect(() => {
    connectWearable();
    return () => disconnectWearable();
  }, [connectWearable, disconnectWearable]);

  // Update time every second
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const faces = [
    { key: 'heart', label: 'Heart', Component: HeartFace, props: { hr }, DetailComponent: HeartDetail, detailProps: { hr, hrData }, icon: '❤️' },
    { key: 'oxygen', label: 'SpO₂', Component: OxygenFace, props: { spo2 }, DetailComponent: GenericDetail, detailProps: { title: 'Blood Oxygen', icon: '💧' }, icon: '💧' },
    { key: 'activity', label: 'Activity', Component: ActivityFace, props: { steps }, DetailComponent: ActivityDetail, detailProps: { steps, stepsData }, icon: '🏃' },
    { key: 'sleep', label: 'Sleep', Component: SleepFace, props: { sleepData }, DetailComponent: SleepDetail, detailProps: { sleepData }, icon: '🌙' },
    { key: 'stress', label: 'Stress', Component: StressFace, props: { stress }, DetailComponent: GenericDetail, detailProps: { title: 'Stress', icon: '🧘' }, icon: '🧘' },
    { key: 'temp', label: 'Temp', Component: TemperatureFace, props: { temp }, DetailComponent: GenericDetail, detailProps: { title: 'Temperature', icon: '🌡️' }, icon: '🌡️' },
    { key: 'ecg', label: 'ECG', Component: ECGFace, props: {}, DetailComponent: GenericDetail, detailProps: { title: 'ECG', icon: '📈' }, icon: '📈' },
    { key: 'fitness', label: 'Fitness', Component: FitnessFace, props: { vo2max }, DetailComponent: GenericDetail, detailProps: { title: 'Fitness', icon: '💪' }, icon: '💪' },
    { key: 'safety', label: 'Safety', Component: SafetyFace, props: {}, DetailComponent: GenericDetail, detailProps: { title: 'Safety', icon: '🛡️' }, icon: '🛡️' },
    { key: 'environment', label: 'Environment', Component: EnvironmentFace, props: {}, DetailComponent: GenericDetail, detailProps: { title: 'Environment', icon: '🌍' }, icon: '🌍' },
    { key: 'womens', label: 'Cycle', Component: WomensHealthFace, props: { cycleDay }, DetailComponent: GenericDetail, detailProps: { title: "Women's Health", icon: '🌸' }, icon: '🌸' },
  ];

  const activeFace = faces[activeSlide];
  const DetailComponent = activeFace?.DetailComponent;
  const detailProps = activeFace?.detailProps || {};

  const goToSlide = (index) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Demo scenario configurations
  const demoScenarios = [
    { key: 'normal', label: '✅ Normal', desc: 'Healthy baseline vitals' },
    { key: 'high-hr', label: '💓 High HR', desc: 'Elevated heart rate (165+ bpm)' },
    { key: 'low-spo2', label: '🫁 Low SpO2', desc: 'Low oxygen saturation (82-86%)' },
    { key: 'heart-attack', label: '💔 Heart Attack', desc: 'High HR + Low SpO2 + High BP' },
    { key: 'cardiac-arrest', label: '🚨 Cardiac Arrest', desc: 'Near-zero heart rate' },
    { key: 'fainting', label: '😵 Fainting', desc: 'Low HR + Low BP + Low SpO2' },
    { key: 'heat-stroke', label: '🔥 Heat Stroke', desc: 'High temperature (40°C+)' },
    { key: 'hypotension', label: '📉 Hypotension', desc: 'Dangerously low blood pressure' },
  ];

  return (
    <div className="w-page">
      {/* Top Bar */}
      <div className="w-topbar">
        <button className="w-topbar-back" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <span className="w-topbar-mid">PreventAI Watch</span>
        <div className="w-topbar-right">
          <span className={`w-connection-status ${isWearableConnected ? 'connected' : ''}`}>
            <span className="w-conn-dot" />
            {isWearableConnected ? 'Live' : 'Disconnected'}
          </span>
          <button className="w-lifesaver-btn" onClick={() => navigate('/emergency')}>
            🆘 Life Saver
          </button>
        </div>
      </div>

      {/* Demo Panel Toggle */}
      <button
        className={`w-demo-toggle ${showDemoPanel ? 'active' : ''}`}
        onClick={() => setShowDemoPanel(!showDemoPanel)}
      >
        🧪 {showDemoPanel ? 'Hide Demo' : 'Demo Mode'}
      </button>

      {/* Demo Simulation Panel */}
      <AnimatePresence>
        {showDemoPanel && (
          <motion.div
            className="w-demo-panel"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
          >
            <div className="w-demo-header">
              <h3>🎮 Live Presentation Mode</h3>
              <p>Simulate health emergencies to demo Life Saver integration</p>
            </div>
            <div className="w-demo-grid">
              {demoScenarios.map((s) => (
                <button
                  key={s.key}
                  className={`w-demo-btn ${scenario === s.key ? 'active' : ''} ${s.key !== 'normal' ? 'danger' : ''}`}
                  onClick={() => simulateScenario(s.key)}
                >
                  <span className="w-demo-btn-label">{s.label}</span>
                  <span className="w-demo-btn-desc">{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="w-demo-live-values">
              <div className="w-live-card">
                <span className="w-live-label">Heart Rate</span>
                <span className={`w-live-value ${hr > 150 || hr < 40 ? 'critical' : hr > 100 ? 'warning' : ''}`}>
                  {Math.round(hr)} <small>bpm</small>
                </span>
              </div>
              <div className="w-live-card">
                <span className="w-live-label">SpO₂</span>
                <span className={`w-live-value ${spo2 < 88 ? 'critical' : spo2 < 92 ? 'warning' : ''}`}>
                  {Math.round(spo2)} <small>%</small>
                </span>
              </div>
              <div className="w-live-card">
                <span className="w-live-label">Blood Pressure</span>
                <span className={`w-live-value ${vitals.bloodPressure?.systolic > 180 || vitals.bloodPressure?.systolic < 80 ? 'critical' : ''}`}>
                  {vitals.bloodPressure?.systolic}/{vitals.bloodPressure?.diastolic} <small>mmHg</small>
                </span>
              </div>
              <div className="w-live-card">
                <span className="w-live-label">Temp</span>
                <span className={`w-live-value ${temp > 40 ? 'critical' : temp > 38 ? 'warning' : ''}`}>
                  {temp.toFixed(1)} <small>°C</small>
                </span>
              </div>
            </div>
            {scenario !== 'normal' && (
              <div className="w-demo-warning">
                ⚠️ Emergency scenario active — <strong>Life Saver</strong> will auto-detect this!
                <button onClick={() => navigate('/emergency')} className="w-goto-lifesaver">
                  Open Life Saver →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="w-body">
        {/* Watch Section */}
        <div className="w-watch-wrap">
          <div className="w-watch">
            {/* Top Band */}
            <div className="w-band-top" />

            {/* Watch Case */}
            <div className="w-case">
              <div className="w-screen">
                <Swiper
                  ref={swiperRef}
                  modules={[Pagination, EffectCreative]}
                  effect="creative"
                  creativeEffect={{
                    prev: { translate: ['-100%', 0, -200], opacity: 0 },
                    next: { translate: ['100%', 0, -200], opacity: 0 },
                  }}
                  pagination={{ clickable: true }}
                  onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                  loop={false}
                >
                  {faces.map((face) => (
                    <SwiperSlide key={face.key}>
                      <face.Component {...face.props} onTap={() => {}} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Bottom Band */}
            <div className="w-band-bot" />
          </div>

          {/* Face Navigation */}
          <div className="w-face-nav">
            {faces.map((face, i) => (
              <button
                key={face.key}
                className={`w-face-btn ${activeSlide === i ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
              >
                {face.icon} {face.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-detail">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFace?.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {DetailComponent && <DetailComponent {...detailProps} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
