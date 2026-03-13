import { useState, useEffect } from 'react';

// ── Simulated live values ────────────────────────────────
export function useLiveData() {
  const [d, setD] = useState({
    hr: 72, spo2: 97, stress: 38, skinTemp: 35.8,
    steps: 8420, calories: 486, respRate: 16,
  });
  useEffect(() => {
    const iv = setInterval(() => {
      setD(prev => ({
        hr: clamp(prev.hr + ri(-2, 3), 56, 108),
        spo2: clamp(prev.spo2 + ri(-1, 1), 93, 100),
        stress: clamp(prev.stress + ri(-4, 4), 12, 88),
        skinTemp: +(clamp(prev.skinTemp + (Math.random() - 0.5) * 0.2, 35.0, 37.2)).toFixed(1),
        steps: prev.steps + ri(0, 12),
        calories: prev.calories + ri(0, 3),
        respRate: clamp(prev.respRate + ri(-1, 1), 11, 22),
      }));
    }, 2200);
    return () => clearInterval(iv);
  }, []);
  return d;
}
function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ── Ring SVG helper ──────────────────────────────────────
function Ring({ val, max, r, sw, color, size }) {
  const c = 2 * Math.PI * r;
  const off = c - (val / max) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
    </svg>
  );
}

// ── ECG path helper ──────────────────────────────────────
function ecgPath(w, h) {
  const pts = [];
  const mid = h / 2;
  for (let x = 0; x < w; x += 2) {
    const cy = x % 120;
    let y = mid;
    if (cy > 40 && cy < 44) y = mid - h * 0.35;
    else if (cy > 44 && cy < 48) y = mid + h * 0.2;
    else if (cy > 48 && cy < 56) y = mid - h * 0.5;
    else if (cy > 56 && cy < 60) y = mid + h * 0.15;
    else if (cy > 60 && cy < 68) y = mid - h * 0.08;
    else y += (Math.random() - 0.5) * 2;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

// ── FACES (the content of each swiper slide) ─────────────

export const FACES = [
  { id: 'home', label: 'Home', icon: '⌚' },
  { id: 'cardio', label: 'Heart', icon: '♥' },
  { id: 'oxygen', label: 'Oxygen', icon: '○' },
  { id: 'sleep', label: 'Sleep', icon: '☾' },
  { id: 'activity', label: 'Activity', icon: '↗' },
  { id: 'metabolic', label: 'Metabolic', icon: '⚡' },
  { id: 'temp', label: 'Temp', icon: '◎' },
  { id: 'fitness', label: 'Fitness', icon: '▲' },
  { id: 'stress', label: 'Stress', icon: '~' },
  { id: 'environ', label: 'Environ', icon: '☀' },
  { id: 'womens', label: "Women's", icon: '✿' },
  { id: 'safety', label: 'Safety', icon: '⊕' },
  { id: 'labs', label: 'Labs', icon: '◇' },
];

// ═════════════════════════════════════════════════════════
//  HOME FACE
// ═════════════════════════════════════════════════════════
export function HomeFace({ d }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);
  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  const ss = String(time.getSeconds()).padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // triple rings
  const sz = 160;
  const rings = [
    { val: Math.min(d.steps / 10000, 1) * 100, color: '#ef4444', r: 68, sw: 10 },
    { val: 65, color: '#34d399', r: 55, sw: 10 },
    { val: 92, color: '#38bdf8', r: 42, sw: 10 },
  ];

  return (
    <div className="wf">
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div style={{ fontSize: '3.8rem', fontWeight: 100, letterSpacing: '0.06em', fontFamily: 'monospace', color: '#eee', lineHeight: 1 }}>
          {hh}<span style={{ opacity: 0.3 }}>:</span>{mm}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 100, color: '#444', fontFamily: 'monospace', marginTop: 2 }}>{ss}</div>
        <div style={{ fontSize: '0.62rem', color: '#555', marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{dateStr}</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 10px', position: 'relative' }}>
        <div style={{ position: 'relative', width: sz, height: sz }}>
          <svg width={sz} height={sz} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            {rings.map((ring, i) => {
              const c = 2 * Math.PI * ring.r;
              return (
                <g key={i}>
                  <circle cx={sz / 2} cy={sz / 2} r={ring.r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={ring.sw} />
                  <circle cx={sz / 2} cy={sz / 2} r={ring.r} fill="none"
                    stroke={ring.color} strokeWidth={ring.sw} strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c * (1 - ring.val / 100)}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 4 }}>
        {[
          { v: d.hr, u: 'BPM', c: '#ef4444' },
          { v: d.spo2 + '%', u: 'SpO₂', c: '#38bdf8' },
          { v: (d.steps / 1000).toFixed(1) + 'k', u: 'Steps', c: '#34d399' },
        ].map((m, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: m.c, fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
            <div style={{ fontSize: '0.5rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>{m.u}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  CARDIO FACE
// ═════════════════════════════════════════════════════════
export function CardioFace({ d }) {
  const [path] = useState(() => ecgPath(340, 55));

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Heart</span>
        <span style={{ fontSize: '0.6rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 7px', borderRadius: 4 }}>Normal Sinus</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div className="wf-ring" style={{ width: 100, height: 100 }}>
          <Ring val={d.hr} max={200} r={42} sw={8} color="#ef4444" size={100} />
          <span className="wf-ring-val" style={{ color: '#ef4444' }}>{d.hr}</span>
          <span className="wf-ring-label">BPM</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="wf-row"><span className="wf-row-name">Resting</span><span className="wf-row-val" style={{ color: '#818cf8' }}>62</span></div>
          <div className="wf-row"><span className="wf-row-name">Max today</span><span className="wf-row-val" style={{ color: '#fbbf24' }}>142</span></div>
          <div className="wf-row"><span className="wf-row-name">HRV</span><span className="wf-row-val" style={{ color: '#a78bfa' }}>48ms</span></div>
        </div>
      </div>

      <div className="wf-ecg" style={{ marginTop: 14 }}>
        <svg viewBox="0 0 340 55" preserveAspectRatio="none">
          <path d={path} fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"
            strokeDasharray="700" strokeDashoffset="700"
            style={{ animation: 'ecgDraw 3s linear infinite' }} />
        </svg>
        <style>{`@keyframes ecgDraw { to { stroke-dashoffset: 0; } }`}</style>
      </div>

      <div className="wf-grid" style={{ marginTop: 4 }}>
        <div className="wf-grid-cell"><div className="gc-label">BP Est.</div><div className="gc-val" style={{ color: '#38bdf8' }}>118/76</div></div>
        <div className="wf-grid-cell"><div className="gc-label">VO₂ Max</div><div className="gc-val" style={{ color: '#34d399' }}>42.3</div></div>
        <div className="wf-grid-cell"><div className="gc-label">PWV</div><div className="gc-val" style={{ color: '#fb923c' }}>6.8 m/s</div></div>
        <div className="wf-grid-cell"><div className="gc-label">AFib</div><div className="gc-val" style={{ color: '#34d399' }}>None</div></div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  OXYGEN FACE
// ═════════════════════════════════════════════════════════
export function OxygenFace({ d }) {
  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Blood & Oxygen</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="wf-ring" style={{ width: 110, height: 110 }}>
            <Ring val={d.spo2} max={100} r={46} sw={9} color="#38bdf8" size={110} />
            <span className="wf-ring-val" style={{ color: '#38bdf8', fontSize: '1.4rem' }}>{d.spo2}%</span>
            <span className="wf-ring-label">SpO₂</span>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="wf-ring" style={{ width: 110, height: 110 }}>
            <Ring val={d.respRate} max={30} r={46} sw={9} color="#34d399" size={110} />
            <span className="wf-ring-val" style={{ color: '#34d399', fontSize: '1.4rem' }}>{d.respRate}</span>
            <span className="wf-ring-label">BR/MIN</span>
          </div>
        </div>
      </div>

      <div className="wf-row"><span className="wf-row-name">Avg SpO₂ today</span><span className="wf-row-val" style={{ color: '#818cf8' }}>97%</span></div>
      <div className="wf-row"><span className="wf-row-name">Low today</span><span className="wf-row-val" style={{ color: '#fb923c' }}>94%</span></div>
      <div className="wf-row"><span className="wf-row-name">Hemoglobin est.</span><span className="wf-row-val" style={{ color: '#ef4444' }}>14.2 g/dL</span></div>
      <div className="wf-row"><span className="wf-row-name">Perfusion index</span><span className="wf-row-val" style={{ color: '#a78bfa' }}>4.2%</span></div>
      <div className="wf-row"><span className="wf-row-name">Breathing</span><span className="wf-row-val" style={{ color: '#34d399' }}>Regular</span></div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  SLEEP FACE
// ═════════════════════════════════════════════════════════
export function SleepFace() {
  const s = { score: 82, total: 7.2, deep: 1.8, light: 3.1, rem: 1.9, awake: 0.4, eff: 91 };

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Sleep</span>
        <span style={{ fontSize: '0.6rem', color: s.score >= 80 ? '#34d399' : '#fbbf24', background: s.score >= 80 ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', padding: '2px 7px', borderRadius: 4 }}>
          {s.score >= 80 ? 'Excellent' : 'Good'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="wf-ring" style={{ width: 100, height: 100 }}>
          <Ring val={s.score} max={100} r={42} sw={8} color="#818cf8" size={100} />
          <span className="wf-ring-val" style={{ color: '#818cf8' }}>{s.score}</span>
          <span className="wf-ring-label">SCORE</span>
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 200, color: '#c4b5fd' }}>{s.total}<span style={{ fontSize: '0.8rem', color: '#555' }}>hrs</span></div>
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: 2 }}>Efficiency {s.eff}%</div>
        </div>
      </div>

      <div className="wf-stages" style={{ marginTop: 16 }}>
        <div style={{ width: `${(s.awake / s.total * 100)}%`, background: '#fb923c' }} />
        <div style={{ width: `${(s.light / s.total * 100)}%`, background: 'rgba(56,189,248,0.45)' }} />
        <div style={{ width: `${(s.deep / s.total * 100)}%`, background: '#818cf8' }} />
        <div style={{ width: `${(s.rem / s.total * 100)}%`, background: '#a78bfa' }} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
        {[
          { l: 'Awake', v: s.awake + 'h', c: '#fb923c' },
          { l: 'Light', v: s.light + 'h', c: 'rgba(56,189,248,0.7)' },
          { l: 'Deep', v: s.deep + 'h', c: '#818cf8' },
          { l: 'REM', v: s.rem + 'h', c: '#a78bfa' },
        ].map((x, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: x.c }} />
            <span style={{ fontSize: '0.58rem', color: '#666' }}>{x.l} {x.v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="wf-row"><span className="wf-row-name">Disturbances</span><span className="wf-row-val" style={{ color: '#fb923c' }}>3</span></div>
        <div className="wf-row"><span className="wf-row-name">Snoring</span><span className="wf-row-val" style={{ color: '#fbbf24' }}>12 min</span></div>
        <div className="wf-row"><span className="wf-row-name">Sleep apnea</span><span className="wf-row-val" style={{ color: '#34d399' }}>None</span></div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  ACTIVITY FACE
// ═════════════════════════════════════════════════════════
export function ActivityFace({ d }) {
  const sz = 140;
  const rings = [
    { val: Math.min(d.steps / 10000, 1) * 100, color: '#ef4444', r: 60, sw: 11 },
    { val: 65, color: '#34d399', r: 46, sw: 11 },
    { val: 92, color: '#38bdf8', r: 32, sw: 11 },
  ];

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Activity</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 8 }}>
        <div style={{ position: 'relative', width: sz, height: sz }}>
          <svg width={sz} height={sz} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            {rings.map((ring, i) => {
              const c = 2 * Math.PI * ring.r;
              return (
                <g key={i}>
                  <circle cx={sz / 2} cy={sz / 2} r={ring.r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={ring.sw} />
                  <circle cx={sz / 2} cy={sz / 2} r={ring.r} fill="none"
                    stroke={ring.color} strokeWidth={ring.sw} strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={c * (1 - ring.val / 100)}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="wf-grid">
        {[
          { l: 'Steps', v: d.steps.toLocaleString(), c: '#ef4444' },
          { l: 'Distance', v: '6.2 km', c: '#34d399' },
          { l: 'Active min', v: '48', c: '#fb923c' },
          { l: 'Floors', v: '12', c: '#a78bfa' },
          { l: 'Cadence', v: '112 spm', c: '#38bdf8' },
          { l: 'Pace', v: '5:42 /km', c: '#ef4444' },
        ].map((m, i) => (
          <div key={i} className="wf-grid-cell">
            <div className="gc-label">{m.l}</div>
            <div className="gc-val" style={{ color: m.c }}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  METABOLIC FACE
// ═════════════════════════════════════════════════════════
export function MetabolicFace({ d }) {
  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Metabolic</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="wf-ring" style={{ width: 95, height: 95 }}>
            <Ring val={d.calories} max={600} r={39} sw={7} color="#fb923c" size={95} />
            <span className="wf-ring-val" style={{ color: '#fb923c', fontSize: '1.2rem' }}>{d.calories}</span>
            <span className="wf-ring-label">KCAL</span>
          </div>
          <div style={{ fontSize: '0.55rem', color: '#555', marginTop: 4 }}>Active</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="wf-ring" style={{ width: 95, height: 95 }}>
            <Ring val={65} max={100} r={39} sw={7} color="#3b82f6" size={95} />
            <span className="wf-ring-val" style={{ color: '#3b82f6', fontSize: '1.2rem' }}>65%</span>
            <span className="wf-ring-label">HYDRA</span>
          </div>
          <div style={{ fontSize: '0.55rem', color: '#555', marginTop: 4 }}>1.8 / 2.8 L</div>
        </div>
      </div>

      <div className="wf-row"><span className="wf-row-name">BMR</span><span className="wf-row-val" style={{ color: '#818cf8' }}>1,620 kcal</span></div>
      <div className="wf-row"><span className="wf-row-name">Total expenditure</span><span className="wf-row-val" style={{ color: '#ef4444' }}>2,106</span></div>
      <div className="wf-row"><span className="wf-row-name">Net balance</span><span className="wf-row-val" style={{ color: '#34d399' }}>-240</span></div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  TEMP FACE
// ═════════════════════════════════════════════════════════
export function TempFace({ d }) {
  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Temperature</span>
        <span style={{ fontSize: '0.6rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 7px', borderRadius: 4 }}>No heat stress</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 28, margin: '16px 0 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 200, color: '#fb923c' }}>{d.skinTemp}°</div>
          <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skin</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 200, color: '#ef4444' }}>36.6°</div>
          <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Body</div>
        </div>
      </div>

      <div className="wf-row"><span className="wf-row-name">Baseline</span><span className="wf-row-val" style={{ color: '#818cf8' }}>36.6°C</span></div>
      <div className="wf-row"><span className="wf-row-name">Deviation</span><span className="wf-row-val" style={{ color: '#34d399' }}>+0.0°</span></div>

      {/* heat bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {['#34d399', '#34d399', '#fbbf24', '#fb923c', '#ef4444'].map((c, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i === 0 ? c : `${c}25` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: '#444', marginTop: 3 }}>
          <span>None</span><span>Low</span><span>Mod</span><span>High</span><span>Danger</span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  FITNESS FACE
// ═════════════════════════════════════════════════════════
export function FitnessFace() {
  const zones = [
    { n: 'Z1 Warm Up', p: 15, c: '#3b82f6' },
    { n: 'Z2 Fat Burn', p: 35, c: '#34d399' },
    { n: 'Z3 Cardio', p: 30, c: '#fbbf24' },
    { n: 'Z4 Hard', p: 15, c: '#fb923c' },
    { n: 'Z5 Max', p: 5, c: '#ef4444' },
  ];

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Fitness</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className="wf-ring" style={{ width: 90, height: 90 }}>
          <Ring val={42.3} max={60} r={37} sw={7} color="#34d399" size={90} />
          <span className="wf-ring-val" style={{ color: '#34d399', fontSize: '1.1rem' }}>42.3</span>
          <span className="wf-ring-label">VO₂</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="wf-row"><span className="wf-row-name">Training load</span><span className="wf-row-val" style={{ color: '#fb923c' }}>78</span></div>
          <div className="wf-row"><span className="wf-row-name">Recovery</span><span className="wf-row-val" style={{ color: '#34d399' }}>14h</span></div>
          <div className="wf-row"><span className="wf-row-name">Lactate thr.</span><span className="wf-row-val" style={{ color: '#ef4444' }}>158 bpm</span></div>
        </div>
      </div>

      <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>HR Zones</div>
      {zones.map((z, i) => (
        <div key={i} style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: 2 }}>
            <span style={{ color: '#666' }}>{z.n}</span>
            <span style={{ color: z.c, fontWeight: 600 }}>{z.p}%</span>
          </div>
          <div className="wf-bar">
            <div className="wf-bar-fill" style={{ width: `${z.p}%`, background: z.c }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  STRESS FACE
// ═════════════════════════════════════════════════════════
export function StressFace({ d }) {
  const lbl = d.stress < 30 ? ['Relaxed', '#34d399'] : d.stress < 50 ? ['Normal', '#38bdf8'] : d.stress < 70 ? ['Moderate', '#fbbf24'] : ['High', '#ef4444'];

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Stress</span>
        <span style={{ fontSize: '0.6rem', color: lbl[1], background: `${lbl[1]}18`, padding: '2px 7px', borderRadius: 4 }}>{lbl[0]}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 16px' }}>
        <div className="wf-ring" style={{ width: 130, height: 130 }}>
          <Ring val={d.stress} max={100} r={54} sw={10} color={lbl[1]} size={130} />
          <span className="wf-ring-val" style={{ color: lbl[1], fontSize: '1.8rem' }}>{d.stress}</span>
          <span className="wf-ring-label">/ 100</span>
        </div>
      </div>

      <div className="wf-row"><span className="wf-row-name">Avg today</span><span className="wf-row-val" style={{ color: '#fbbf24' }}>45</span></div>
      <div className="wf-row"><span className="wf-row-name">Peak today</span><span className="wf-row-val" style={{ color: '#ef4444' }}>82</span></div>
      <div className="wf-row"><span className="wf-row-name">Relaxation</span><span className="wf-row-val" style={{ color: '#34d399' }}>68</span></div>
      <div className="wf-row"><span className="wf-row-name">Mindfulness</span><span className="wf-row-val" style={{ color: '#a78bfa' }}>15 min</span></div>
      <div className="wf-row"><span className="wf-row-name">Breath rate</span><span className="wf-row-val" style={{ color: '#38bdf8' }}>15.2/min</span></div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  ENVIRONMENT FACE
// ═════════════════════════════════════════════════════════
export function EnvironFace() {
  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Environment</span>
      </div>

      <div className="wf-grid" style={{ marginBottom: 10 }}>
        <div className="wf-grid-cell"><div className="gc-label">UV Index</div><div className="gc-val" style={{ color: '#fb923c' }}>6 High</div></div>
        <div className="wf-grid-cell"><div className="gc-label">Noise</div><div className="gc-val" style={{ color: '#fbbf24' }}>62 dB</div></div>
        <div className="wf-grid-cell"><div className="gc-label">Altitude</div><div className="gc-val" style={{ color: '#38bdf8' }}>920 m</div></div>
        <div className="wf-grid-cell"><div className="gc-label">Pressure</div><div className="gc-val" style={{ color: '#a78bfa' }}>1013</div></div>
      </div>

      {/* UV bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < 6 ? (i < 3 ? '#34d399' : i < 6 ? '#fbbf24' : '#fb923c') : 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
        <div style={{ fontSize: '0.5rem', color: '#444', marginTop: 2 }}>UV Scale 0–11+</div>
      </div>

      <div className="wf-row" style={{ marginTop: 8 }}><span className="wf-row-name">Noise exposure</span><span className="wf-row-val" style={{ color: '#fbbf24' }}>2.4 hrs</span></div>
      <div className="wf-row"><span className="wf-row-name">Location</span><span className="wf-row-val" style={{ color: '#818cf8', fontSize: '0.72rem' }}>Bangalore</span></div>
      <div className="wf-row"><span className="wf-row-name">Coordinates</span><span className="wf-row-val" style={{ color: '#666', fontSize: '0.68rem' }}>12.97°N, 77.59°E</span></div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  WOMEN'S HEALTH FACE
// ═════════════════════════════════════════════════════════
export function WomensFace() {
  const day = 18, len = 28;
  const getC = (d) => d <= 5 ? '#ef4444' : d <= 13 ? '#3b82f6' : d <= 16 ? '#f472b6' : '#fbbf24';

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Cycle</span>
        <span style={{ fontSize: '0.6rem', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 7px', borderRadius: 4 }}>Luteal</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 14px' }}>
        <div className="wf-ring" style={{ width: 110, height: 110 }}>
          <Ring val={day} max={len} r={46} sw={9} color={getC(day)} size={110} />
          <span className="wf-ring-val" style={{ color: getC(day), fontSize: '1.3rem' }}>Day {day}</span>
          <span className="wf-ring-label">of {len}</span>
        </div>
      </div>

      <div className="wf-cycle-days">
        {Array.from({ length: len }, (_, i) => {
          const dd = i + 1;
          const cur = dd === day;
          const col = getC(dd);
          const fertile = dd >= 12 && dd <= 16;
          return (
            <div key={i} className="wf-cday" style={{
              background: cur ? col : `${col}30`,
              border: fertile ? `1px solid ${col}55` : '1px solid transparent',
              color: cur ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight: cur ? 700 : 400,
            }}>{dd}</div>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <div className="wf-row"><span className="wf-row-name">Next period</span><span className="wf-row-val" style={{ color: '#ef4444' }}>~10 days</span></div>
        <div className="wf-row"><span className="wf-row-name">Fertile window</span><span className="wf-row-val" style={{ color: '#f472b6' }}>Day 12-16</span></div>
        <div className="wf-row"><span className="wf-row-name">BBT trend</span><span className="wf-row-val" style={{ color: '#fb923c' }}>36.8°C</span></div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  SAFETY FACE
// ═════════════════════════════════════════════════════════
export function SafetyFace() {
  const checks = [
    { n: 'Fall detection', ok: true },
    { n: 'Crash detection', ok: true },
    { n: 'High HR alert', ok: true },
    { n: 'Low SpO₂ alert', ok: true },
    { n: 'Gait stability', ok: true },
  ];

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Safety</span>
        <span style={{ fontSize: '0.6rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 7px', borderRadius: 4 }}>All Clear</span>
      </div>

      {/* SOS circle */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 18px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '2px solid rgba(239,68,68,0.25)',
          background: 'radial-gradient(circle, rgba(239,68,68,0.08), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>SOS</span>
          <span style={{ fontSize: '0.45rem', color: '#666' }}>Hold 3s</span>
        </div>
      </div>

      {checks.map((c, i) => (
        <div key={i} className="wf-alert">
          <div className="wf-alert-dot" style={{ background: c.ok ? '#34d399' : '#ef4444' }} />
          <span className="wf-alert-text">{c.n}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: c.ok ? '#34d399' : '#ef4444' }}>{c.ok ? 'Active' : 'Off'}</span>
        </div>
      ))}

      <div className="wf-grid" style={{ marginTop: 10 }}>
        <div className="wf-grid-cell"><div className="gc-label">Posture</div><div className="gc-val" style={{ color: '#34d399' }}>Good</div></div>
        <div className="wf-grid-cell"><div className="gc-label">Gait sym.</div><div className="gc-val" style={{ color: '#a78bfa' }}>96%</div></div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
//  LABS / EXPERIMENTAL FACE
// ═════════════════════════════════════════════════════════
export function LabsFace() {
  const items = [
    { n: 'Blood glucose', v: '98 mg/dL', c: '#fb923c', t: 'Beta' },
    { n: 'Blood alcohol', v: '0.00', c: '#a78bfa', t: 'Research' },
    { n: 'BP uncalib.', v: '120/78', c: '#ef4444', t: 'Beta' },
    { n: 'Hydration', v: '68%', c: '#3b82f6', t: 'Research' },
    { n: 'Cortisol', v: '14.2 µg/dL', c: '#fbbf24', t: 'Research' },
    { n: 'Lactate', v: '1.8 mmol/L', c: '#38bdf8', t: 'Beta' },
  ];

  return (
    <div className="wf">
      <div className="wf-head">
        <span className="wf-label">Experimental</span>
      </div>

      {items.map((it, i) => (
        <div key={i} className="wf-row" style={{ alignItems: 'flex-start', gap: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="wf-row-name">{it.n}</span>
              <span style={{ fontSize: '0.48rem', padding: '1px 5px', borderRadius: 3, background: it.t === 'Beta' ? 'rgba(251,146,60,0.12)' : 'rgba(167,139,250,0.12)', color: it.t === 'Beta' ? '#fb923c' : '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{it.t}</span>
            </div>
          </div>
          <span className="wf-row-val" style={{ color: it.c }}>{it.v}</span>
        </div>
      ))}
    </div>
  );
}
