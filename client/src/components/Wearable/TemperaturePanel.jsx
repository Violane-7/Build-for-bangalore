import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

function generateTempData(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    skin: +(35.5 + Math.random() * 1.5 + (i > 22 || i < 6 ? -0.3 : 0.3)).toFixed(1),
    body: +(36.2 + Math.random() * 0.8).toFixed(1),
    baseline: 36.6,
  }));
}

export default function TemperaturePanel() {
  const [data] = useState(() => generateTempData());
  const currentSkin = 35.8;
  const currentBody = 36.6;
  const deviation = +((currentBody - 36.6).toFixed(1));

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🌡️</span>
        <h2>Temperature & Body State</h2>
      </div>
      <p className="wear-section-subtitle">
        Continuous skin and body temperature monitoring with baseline deviation tracking
      </p>

      <div className="wear-grid-3" style={{ marginBottom: '1.25rem' }}>
        {/* Skin Temp */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="card-title">Skin Temperature</div>
          <div className="card-value" style={{ color: '#fb923c' }}>{currentSkin}°</div>
          <div className="card-unit">Celsius</div>
          <div className="card-subtitle">Measured from wrist sensor</div>
          <div className="wear-progress-bar" style={{ marginTop: '1rem' }}>
            <motion.div className="bar-fill"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #fb923c, #ef4444)' }}
              initial={{ width: 0 }} whileInView={{ width: '60%' }}
              viewport={{ once: true }} transition={{ duration: 1.2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--wear-text-dim)', marginTop: '0.3rem' }}>
            <span>33°C</span><span>37°C</span><span>40°C</span>
          </div>
        </motion.div>

        {/* Body Temp */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="card-title">Body Temperature (Est.)</div>
          <div className="card-value" style={{ color: '#ef4444' }}>{currentBody}°</div>
          <div className="card-unit">Celsius</div>
          <div className="card-subtitle">AI-estimated from skin + activity</div>
          <div style={{ marginTop: '1rem' }}>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Baseline</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: '#818cf8' }}>36.6°C</span>
            </div>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.8rem' }}>Deviation</span>
              <span className="stat-val" style={{ fontSize: '0.85rem', color: deviation === 0 ? '#4ade80' : '#facc15' }}>
                {deviation >= 0 ? '+' : ''}{deviation}°C
              </span>
            </div>
          </div>
        </motion.div>

        {/* Heat Stress */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="card-title">Heat Stress Indicator</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(74,222,128,0.3), rgba(74,222,128,0.05))',
              border: '2px solid #4ade80',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: '#4ade80',
            }}>
              Low
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4ade80' }}>No Heat Stress</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)', marginTop: '0.25rem' }}>
                Body temp is within normal range. Hydration adequate.
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {['#4ade80', '#4ade80', '#facc15', '#fb923c', '#ef4444'].map((c, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i === 0 ? c : `${c}33`,
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--wear-text-dim)', marginTop: '0.2rem' }}>
              <span>None</span><span>Low</span><span>Moderate</span><span>High</span><span>Danger</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 24h Temp Trend */}
      <motion.div className="wear-glass-card"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        <div className="card-title">Temperature — 24 Hour Trend</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#7a7a95', fontSize: 10 }} interval={3} />
            <YAxis tick={{ fill: '#7a7a95', fontSize: 10 }} domain={[34, 38]} />
            <Tooltip contentStyle={{ background: 'rgba(20,20,35,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }} />
            <Area type="monotone" dataKey="skin" stroke="#fb923c" fill="url(#skinGrad)" strokeWidth={2} name="Skin Temp (°C)" />
            <Line type="monotone" dataKey="body" stroke="#ef4444" strokeWidth={2} dot={false} name="Body Temp (°C)" />
            <Line type="monotone" dataKey="baseline" stroke="#818cf8" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Baseline" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="wear-legend">
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#fb923c' }} /> Skin Temp</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} /> Body Temp</span>
          <span className="wear-legend-item"><span className="legend-dot" style={{ background: '#818cf8' }} /> Baseline</span>
        </div>
      </motion.div>
    </div>
  );
}
