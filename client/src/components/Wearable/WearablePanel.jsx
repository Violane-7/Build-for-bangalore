import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function WearablePanel() {
  const navigate = useNavigate();
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

  return (
    <motion.div
      style={{
        maxWidth: 280,
        margin: '0 auto',
        padding: '1.5rem',
        borderRadius: 48,
        background: 'linear-gradient(145deg, rgba(20,20,35,0.95), rgba(10,10,18,0.98))',
        border: '3px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(129,140,248,0.3)' }}
      onClick={() => navigate('/wearable')}
    >
      <div style={{ fontSize: '1.8rem', fontWeight: 200, color: '#e8e8f0', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
        {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>{hr}</div>
          <div style={{ fontSize: '0.6rem', color: '#7a7a95' }}>BPM</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#22d3ee' }}>{spo2}%</div>
          <div style={{ fontSize: '0.6rem', color: '#7a7a95' }}>SpO₂</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6' }}>{(steps / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: '0.6rem', color: '#7a7a95' }}>Steps</div>
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#818cf8' }}>
        Tap to open Wearables Hub →
      </div>
    </motion.div>
  );
}
