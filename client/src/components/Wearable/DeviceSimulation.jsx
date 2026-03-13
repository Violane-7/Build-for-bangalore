import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Watch Face Simulation ──────────────────────────
function WatchFace({ hr, spo2, steps }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');

  // Activity rings
  const moveP = Math.min(steps / 10000, 1);
  const exP = 0.65;
  const standP = 0.92;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'radial-gradient(circle at center, #0d0d1a, #050508)' }}>
      {/* Time */}
      <div style={{ fontSize: '2.2rem', fontWeight: 200, letterSpacing: '0.1em', color: '#e8e8f0', fontFamily: 'monospace' }}>
        {h}:{m}
      </div>
      <div style={{ fontSize: '0.55rem', color: '#7a7a95', marginTop: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>

      {/* Mini Activity Rings */}
      <div style={{ margin: '0.6rem 0', position: 'relative', width: 60, height: 60 }}>
        <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
          {[
            { p: moveP, color: '#ef4444', r: 25 },
            { p: exP, color: '#4ade80', r: 19 },
            { p: standP, color: '#22d3ee', r: 13 },
          ].map((ring, i) => {
            const circ = 2 * Math.PI * ring.r;
            return (
              <g key={i}>
                <circle cx={30} cy={30} r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
                <circle cx={30} cy={30} r={ring.r} fill="none"
                  stroke={ring.color} strokeWidth={5} strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - ring.p)} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Health Metrics Row */}
      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ef4444' }}>{hr}</div>
          <div style={{ fontSize: '0.45rem', color: '#7a7a95', textTransform: 'uppercase' }}>BPM</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22d3ee' }}>{spo2}%</div>
          <div style={{ fontSize: '0.45rem', color: '#7a7a95', textTransform: 'uppercase' }}>SpO₂</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3b82f6' }}>{(steps / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: '0.45rem', color: '#7a7a95', textTransform: 'uppercase' }}>Steps</div>
        </div>
      </div>
    </div>
  );
}

// ── Ring Display ──────────────────────────────────
function RingDisplay({ hr, spo2 }) {
  return (
    <div className="wear-ring-inner">
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{hr}</div>
      <div style={{ fontSize: '0.6rem', color: '#7a7a95', textTransform: 'uppercase' }}>BPM</div>
      <div style={{ width: '60%', height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.3rem 0' }} />
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22d3ee' }}>{spo2}%</div>
      <div style={{ fontSize: '0.5rem', color: '#7a7a95' }}>SpO₂</div>
    </div>
  );
}

// ── Band Display ─────────────────────────────────
function BandDisplay({ steps, hr }) {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>{steps.toLocaleString()}</div>
        <div style={{ fontSize: '0.45rem', color: '#7a7a95' }}>STEPS</div>
      </div>
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444' }}>{hr}</div>
        <div style={{ fontSize: '0.45rem', color: '#7a7a95' }}>BPM</div>
      </div>
    </>
  );
}

export default function DeviceSimulation() {
  const [activeDevice, setActiveDevice] = useState('watch');
  const [hr, setHR] = useState(72);
  const [spo2, setSpo2] = useState(97);
  const steps = 8420;

  useEffect(() => {
    const iv = setInterval(() => {
      setHR(prev => Math.max(58, Math.min(105, prev + Math.floor(Math.random() * 5) - 2)));
      setSpo2(prev => Math.max(94, Math.min(100, prev + Math.floor(Math.random() * 3) - 1)));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const devices = [
    { key: 'watch', label: 'Smart Watch', icon: '⌚' },
    { key: 'ring', label: 'Smart Ring', icon: '💍' },
    { key: 'band', label: 'Fitness Band', icon: '📿' },
  ];

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">📱</span>
        <h2>Device Simulation</h2>
      </div>
      <p className="wear-section-subtitle">
        Interactive hardware simulation — view real-time data as it appears on your wearable devices
      </p>

      {/* Device Tabs */}
      <div className="wear-device-tabs">
        {devices.map(d => (
          <button key={d.key}
            className={`wear-device-tab ${activeDevice === d.key ? 'active' : ''}`}
            onClick={() => setActiveDevice(d.key)}>
            <span>{d.icon}</span> {d.label}
          </button>
        ))}
      </div>

      {/* Device Display */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
        <AnimatePresence mode="wait">
          {activeDevice === 'watch' && (
            <motion.div key="watch" className="wear-device-sim"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.5 }}>
              <div className="wear-watch-frame">
                <div className="wear-watch-screen">
                  <WatchFace hr={hr} spo2={spo2} steps={steps} />
                </div>
              </div>
            </motion.div>
          )}

          {activeDevice === 'ring' && (
            <motion.div key="ring" className="wear-device-sim"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.5 }}>
              <div className="wear-ring-frame">
                <RingDisplay hr={hr} spo2={spo2} />
              </div>
            </motion.div>
          )}

          {activeDevice === 'band' && (
            <motion.div key="band" className="wear-device-sim"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.5 }}>
              <div className="wear-band-frame">
                <BandDisplay steps={steps} hr={hr} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Device info */}
      <div className="wear-grid-3">
        {[
          { name: 'Smart Watch', icon: '⌚', battery: '68%', status: 'Connected', sensors: 'HR, SpO₂, ECG, Temp, Accel, Gyro, GPS, Barometer', color: '#818cf8' },
          { name: 'Smart Ring', icon: '💍', battery: '82%', status: 'Connected', sensors: 'HR, SpO₂, Temp, Accel', color: '#4ade80' },
          { name: 'Fitness Band', icon: '📿', battery: '91%', status: 'Connected', sensors: 'HR, SpO₂, Accel, Gyro', color: '#22d3ee' },
        ].map((d, i) => (
          <motion.div key={i} className="wear-glass-card"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{d.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  {d.status}
                </div>
              </div>
            </div>
            <div className="wear-stat-row">
              <span className="stat-name" style={{ fontSize: '0.75rem' }}>Battery</span>
              <span className="stat-val" style={{ fontSize: '0.8rem', color: d.color }}>{d.battery}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--wear-text-dim)', marginTop: '0.5rem' }}>
              <strong style={{ color: 'var(--wear-text-muted)' }}>Sensors:</strong> {d.sensors}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
