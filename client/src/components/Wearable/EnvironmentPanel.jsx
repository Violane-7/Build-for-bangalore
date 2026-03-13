import { motion } from 'framer-motion';

export default function EnvironmentPanel() {
  const metrics = {
    uvIndex: 6,
    uvLabel: 'High',
    noise: 62, // dB
    altitude: 920, // m
    pressure: 1013, // hPa
    lat: 12.97,
    lon: 77.59,
  };

  const getUVColor = (uv) => {
    if (uv <= 2) return '#4ade80';
    if (uv <= 5) return '#facc15';
    if (uv <= 7) return '#fb923c';
    return '#ef4444';
  };

  const getNoiseLabel = (db) => {
    if (db < 50) return { text: 'Quiet', color: '#4ade80' };
    if (db < 70) return { text: 'Moderate', color: '#facc15' };
    if (db < 85) return { text: 'Loud', color: '#fb923c' };
    return { text: 'Dangerous', color: '#ef4444' };
  };

  const noise = getNoiseLabel(metrics.noise);

  return (
    <div>
      <div className="wear-section-header">
        <span className="section-icon">🌍</span>
        <h2>Environmental Interaction</h2>
      </div>
      <p className="wear-section-subtitle">
        UV exposure, ambient noise, altitude, barometric pressure, and GPS location
      </p>

      <div className="wear-grid-3" style={{ marginBottom: '1.25rem' }}>
        {/* UV Index */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="card-title">UV Exposure</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto',
              background: `radial-gradient(circle, ${getUVColor(metrics.uvIndex)}33, transparent)`,
              border: `3px solid ${getUVColor(metrics.uvIndex)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getUVColor(metrics.uvIndex) }}>{metrics.uvIndex}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--wear-text-muted)' }}>UV Index</span>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: getUVColor(metrics.uvIndex) }}>{metrics.uvLabel}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)', marginTop: '0.25rem' }}>Wear SPF 30+ sunscreen</div>
          </div>
          {/* UV Scale */}
          <div style={{ display: 'flex', gap: '2px', marginTop: '1rem' }}>
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: i < metrics.uvIndex ? getUVColor(i) : 'rgba(255,255,255,0.06)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--wear-text-dim)', marginTop: '0.2rem' }}>
            <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
          </div>
        </motion.div>

        {/* Ambient Noise */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div className="card-title">Ambient Noise</div>
          <div style={{ textAlign: 'center' }}>
            <div className="card-value" style={{ color: noise.color }}>{metrics.noise}</div>
            <div className="card-unit">dB</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: noise.color }}>{noise.text}</div>
          </div>
          <div className="wear-progress-bar" style={{ marginTop: '1rem' }}>
            <motion.div className="bar-fill"
              style={{ background: `linear-gradient(90deg, #4ade80, #facc15, #fb923c, #ef4444)` }}
              initial={{ width: 0 }} whileInView={{ width: `${(metrics.noise / 120) * 100}%` }}
              viewport={{ once: true }} transition={{ duration: 1.2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--wear-text-dim)', marginTop: '0.2rem' }}>
            <span>0 dB</span><span>50</span><span>85</span><span>120 dB</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--wear-text-muted)', marginTop: '0.75rem' }}>
            Exposure: <strong>2.4 hrs</strong> above 60dB today. Safe limit: 8 hrs at 85dB.
          </div>
        </motion.div>

        {/* Altitude + Pressure + GPS */}
        <motion.div className="wear-glass-card"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="card-title">Location & Altitude</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            <div className="wear-stat-row">
              <div className="stat-left">
                <span style={{ fontSize: '1rem' }}>⛰️</span>
                <span className="stat-name">Altitude</span>
              </div>
              <span className="stat-val" style={{ fontSize: '0.9rem', color: '#22d3ee' }}>{metrics.altitude} m</span>
            </div>
            <div className="wear-stat-row">
              <div className="stat-left">
                <span style={{ fontSize: '1rem' }}>🌡️</span>
                <span className="stat-name">Air Pressure</span>
              </div>
              <span className="stat-val" style={{ fontSize: '0.9rem', color: '#a78bfa' }}>{metrics.pressure} hPa</span>
            </div>
            <div className="wear-stat-row">
              <div className="stat-left">
                <span style={{ fontSize: '1rem' }}>📍</span>
                <span className="stat-name">Latitude</span>
              </div>
              <span className="stat-val" style={{ fontSize: '0.9rem', color: '#818cf8' }}>{metrics.lat}°N</span>
            </div>
            <div className="wear-stat-row">
              <div className="stat-left">
                <span style={{ fontSize: '1rem' }}>📍</span>
                <span className="stat-name">Longitude</span>
              </div>
              <span className="stat-val" style={{ fontSize: '0.9rem', color: '#818cf8' }}>{metrics.lon}°E</span>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', padding: '0.6rem', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--wear-text-muted)' }}>
            Bangalore, Karnataka, India
          </div>
        </motion.div>
      </div>
    </div>
  );
}
