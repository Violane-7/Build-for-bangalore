import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function generateCycleTemp(days = 28) {
  return Array.from({ length: days }, (_, i) => {
    const phase = i < 5 ? 'menstrual' : i < 13 ? 'follicular' : i < 16 ? 'ovulation' : 'luteal';
    const baseTemp = phase === 'luteal' || phase === 'ovulation' ? 36.6 : 36.2;
    return {
      day: i + 1,
      temp: +(baseTemp + Math.random() * 0.4 - 0.1).toFixed(1),
      phase,
    };
  });
}

export default function WomensHealthPanel() {
  const [tempData] = useState(() => generateCycleTemp());

  const cycleDay = 18;
  const cycleLength = 28;
  const nextPeriod = 10; // days
  const fertileWindow = { start: 12, end: 16 };
  const ovulationDay = 14;

  const phases = [
    { name: 'Menstrual', days: '1-5', color: '#ef4444', icon: '🔴' },
    { name: 'Follicular', days: '6-13', color: '#3b82f6', icon: '🔵' },
    { name: 'Ovulation', days: '14-16', color: '#f472b6', icon: '💗' },
    { name: 'Luteal', days: '17-28', color: '#facc15', icon: '🟡' },
  ];

  const getPhaseColor = (day) => {
    if (day <= 5) return '#ef4444';
    if (day <= 13) return '#3b82f6';
    if (day <= 16) return '#f472b6';
    return '#facc15';
  };

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🌸</span>
        <h2>Women's Health</h2>
      </div>
      <p className="wear-section-subtitle">
        Menstrual cycle tracking, ovulation prediction, basal body temperature trends, and fertility windows
      </p>

      <div className="wear-grid-2" style={{ marginBottom: '1.25rem' }}>
        {/* Cycle Overview */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="card-title">Cycle Overview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
            {/* Cycle ring */}
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
                <circle cx={60} cy={60} r={50} fill="none"
                  stroke={getPhaseColor(cycleDay)} strokeWidth={10} strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - cycleDay / cycleLength)}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getPhaseColor(cycleDay) }}>Day {cycleDay}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--wear-text-muted)' }}>of {cycleLength}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="wear-stat-row">
                <span className="stat-name">Current Phase</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#facc15' }}>Luteal</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Next Period</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#ef4444' }}>~{nextPeriod} days</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Fertile Window</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#f472b6' }}>Day {fertileWindow.start}-{fertileWindow.end}</span>
              </div>
              <div className="wear-stat-row">
                <span className="stat-name">Ovulation (Est.)</span>
                <span className="stat-val" style={{ fontSize: '0.85rem', color: '#a78bfa' }}>Day {ovulationDay}</span>
              </div>
            </div>
          </div>

          {/* Phase Legend */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--wear-text-muted)' }}>
                <span>{p.icon}</span>
                <span>{p.name} ({p.days})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cycle Calendar Heatmap */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="card-title">Cycle Calendar</div>
          <div className="wear-cycle-track" style={{ marginBottom: '1rem' }}>
            {Array.from({ length: cycleLength }, (_, i) => {
              const d = i + 1;
              const isCurrent = d === cycleDay;
              const color = getPhaseColor(d);
              const isFertile = d >= fertileWindow.start && d <= fertileWindow.end;
              return (
                <motion.div key={i} className="wear-cycle-day"
                  style={{
                    background: isCurrent ? color : `${color}33`,
                    border: isFertile ? `1px solid ${color}` : '1px solid transparent',
                    fontWeight: isCurrent ? 800 : 400,
                    color: isCurrent ? '#fff' : 'rgba(255,255,255,0.5)',
                    width: 28, height: 28, borderRadius: 6, fontSize: '0.65rem',
                  }}
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.02 * i }}>
                  {d}
                </motion.div>
              );
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
            Highlighted days indicate fertile window. Current day shown in solid color.
          </div>
        </motion.div>
      </div>

      {/* BBT Chart */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        <div className="card-title">Basal Body Temperature — Full Cycle</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#7a7a95', fontSize: 10 }} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[35.8, 37.2]} />
            <Tooltip
              contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
              formatter={(val, name) => [val + '°C', 'BBT']}
              labelFormatter={(day) => `Day ${day}`}
            />
            <Line type="monotone" dataKey="temp" stroke="#f472b6" strokeWidth={2} dot={{ r: 3, fill: '#f472b6', stroke: '#f472b6' }} name="BBT (°C)" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)', marginTop: '0.5rem' }}>
          Temperature rise after day 14 indicates ovulation. Luteal phase shows sustained elevation.
        </div>
      </motion.div>
    </div>
  );
}
