import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

const tt = { background: 'rgba(14,14,24,0.95)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 };

// ── data generators (stable per face) ─────────────────
function gen24hr() {
  return Array.from({ length: 24 }, (_, i) => ({
    t: `${String(i).padStart(2, '0')}:00`,
    hr: 58 + Math.floor(Math.random() * 42) + (i > 7 && i < 21 ? 14 : 0),
    rhr: 58 + Math.floor(Math.random() * 6),
    spo2: 94 + Math.floor(Math.random() * 6),
    resp: 12 + Math.floor(Math.random() * 8),
    stress: Math.max(10, Math.min(90, 28 + Math.floor(Math.random() * 38) + (i > 8 && i < 18 ? 18 : 0))),
    relax: Math.max(10, 75 - Math.floor(Math.random() * 30) - (i > 8 && i < 18 ? 12 : 0)),
    skin: +(35.4 + Math.random() * 1.4 + (i > 22 || i < 6 ? -0.2 : 0.3)).toFixed(1),
    body: +(36.1 + Math.random() * 0.8).toFixed(1),
  }));
}
function gen7d(key, lo, hi) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => ({ day: d, [key]: lo + Math.floor(Math.random() * (hi - lo)) }));
}
function genSleepWeek() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => ({
    day: d,
    deep: +(0.8 + Math.random() * 1.5).toFixed(1),
    light: +(2 + Math.random() * 2).toFixed(1),
    rem: +(1 + Math.random() * 1.5).toFixed(1),
    awake: +(0.1 + Math.random() * 0.5).toFixed(1),
  }));
}
function genBP() {
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
    day: d,
    sys: 112 + Math.floor(Math.random() * 16),
    dia: 70 + Math.floor(Math.random() * 12),
  }));
}
function genVO2() {
  return Array.from({ length: 8 }, (_, i) => ({
    wk: `W${i + 1}`,
    vo2: +(38 + i * 0.5 + Math.random() * 2).toFixed(1),
  }));
}
function genBBT() {
  return Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    temp: +((i < 14 ? 36.2 : 36.6) + Math.random() * 0.3 - 0.1).toFixed(1),
  }));
}
function genCal() {
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => ({
    day: d,
    active: 280 + Math.floor(Math.random() * 400),
    basal: 1400 + Math.floor(Math.random() * 200),
  }));
}

// ── chart colors ──────────────────────────────────────
const g = (id, c, o1 = 0.25, o2 = 0) => (
  <defs key={id}><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={c} stopOpacity={o1} />
    <stop offset="100%" stopColor={c} stopOpacity={o2} />
  </linearGradient></defs>
);

export default function DetailDrawer({ faceId, live }) {
  const data24 = useMemo(() => gen24hr(), [faceId]);
  const bpData = useMemo(() => genBP(), []);
  const sleepWk = useMemo(() => genSleepWeek(), []);
  const vo2Data = useMemo(() => genVO2(), []);
  const bbtData = useMemo(() => genBBT(), []);
  const calData = useMemo(() => genCal(), []);
  const stepsWk = useMemo(() => gen7d('steps', 4000, 12000), []);
  const hrvWk = useMemo(() => gen7d('hrv', 30, 65), []);

  const fitnessRadar = [
    { m: 'Endurance', v: 75 }, { m: 'Speed', v: 62 }, { m: 'Power', v: 58 },
    { m: 'Recovery', v: 80 }, { m: 'Flexibility', v: 45 }, { m: 'Cardio', v: 72 },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={faceId}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35 }}
      >
        {faceId === 'home' && <HomeDetail live={live} />}
        {faceId === 'cardio' && <CardioDetail d={data24} bp={bpData} hrv={hrvWk} live={live} />}
        {faceId === 'oxygen' && <OxygenDetail d={data24} live={live} />}
        {faceId === 'sleep' && <SleepDetail d={sleepWk} />}
        {faceId === 'activity' && <ActivityDetail d={stepsWk} />}
        {faceId === 'metabolic' && <MetabolicDetail d={calData} />}
        {faceId === 'temp' && <TempDetail d={data24} />}
        {faceId === 'fitness' && <FitnessDetail vo2={vo2Data} radar={fitnessRadar} />}
        {faceId === 'stress' && <StressDetail d={data24} live={live} />}
        {faceId === 'environ' && <EnvironDetail />}
        {faceId === 'womens' && <WomensDetail d={bbtData} />}
        {faceId === 'safety' && <SafetyDetail />}
        {faceId === 'labs' && <LabsDetail />}
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════ DETAIL VIEWS ════════════════════════════

function HomeDetail({ live }) {
  return (
    <>
      <h3 className="w-det-section">Quick Overview</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {[
          { l: 'Heart Rate', v: live.hr + ' bpm', c: '#ef4444' },
          { l: 'SpO₂', v: live.spo2 + '%', c: '#38bdf8' },
          { l: 'Steps', v: live.steps.toLocaleString(), c: '#34d399' },
          { l: 'Calories', v: live.calories + ' kcal', c: '#fb923c' },
          { l: 'Stress', v: live.stress + '/100', c: '#fbbf24' },
          { l: 'Skin Temp', v: live.skinTemp + '°C', c: '#a78bfa' },
        ].map((m, i) => (
          <div key={i} className="w-dcard" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.l}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: m.c, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
          </div>
        ))}
      </div>
      <div className="w-dcard">
        <div className="w-dcard-title">Connected Devices</div>
        {['Smart Watch — Battery 68%', 'Smart Ring — Battery 82%', 'Fitness Band — Battery 91%'].map((txt, i) => (
          <div key={i} className="w-drow">
            <div className="w-drow-left">
              <div className="w-drow-dot" style={{ background: '#34d399' }} />
              <span className="w-drow-name">{txt}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Connected</span>
          </div>
        ))}
      </div>
    </>
  );
}

function CardioDetail({ d, bp, hrv, live }) {
  return (
    <>
      <h3 className="w-det-section">Heart Rate — 24h</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={d}>
            {g('g_hr', '#ef4444')}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} interval={4} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[50, 120]} />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="hr" stroke="#ef4444" fill="url(#g_hr)" strokeWidth={1.5} name="HR" />
            <Line type="monotone" dataKey="rhr" stroke="#818cf8" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Resting" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#ef4444' }} /> Heart Rate</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#818cf8' }} /> Resting</span>
        </div>
      </div>

      <h3 className="w-det-section" style={{ marginTop: 20 }}>Blood Pressure — Weekly</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={bp}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[60, 140]} />
            <Tooltip contentStyle={tt} />
            <Line type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={1.5} name="Systolic" />
            <Line type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={1.5} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#ef4444' }} /> Systolic</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#3b82f6' }} /> Diastolic</span>
        </div>
      </div>

      <h3 className="w-det-section" style={{ marginTop: 20 }}>HRV — Weekly</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={hrv}>
            {g('g_hrv', '#a78bfa')}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[20, 70]} />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="hrv" stroke="#a78bfa" fill="url(#g_hrv)" strokeWidth={1.5} name="HRV (ms)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

function OxygenDetail({ d, live }) {
  return (
    <>
      <h3 className="w-det-section">SpO₂ & Respiratory — 24h</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={d}>
            {g('g_spo', '#38bdf8')}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} interval={4} />
            <YAxis yAxisId="l" tick={{ fill: '#555', fontSize: 10 }} domain={[90, 100]} />
            <YAxis yAxisId="r" orientation="right" tick={{ fill: '#555', fontSize: 10 }} domain={[8, 28]} />
            <Tooltip contentStyle={tt} />
            <Area yAxisId="l" type="monotone" dataKey="spo2" stroke="#38bdf8" fill="url(#g_spo)" strokeWidth={1.5} name="SpO₂ (%)" />
            <Line yAxisId="r" type="monotone" dataKey="resp" stroke="#34d399" strokeWidth={1} dot={false} name="Resp Rate" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#38bdf8' }} /> SpO₂</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#34d399' }} /> Respiratory Rate</span>
        </div>
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Additional Readings</div>
        {[
          { n: 'Hemoglobin est.', v: '14.2 g/dL', c: '#ef4444' },
          { n: 'Perfusion index', v: '4.2%', c: '#a78bfa' },
          { n: 'Breathing pattern', v: 'Regular', c: '#34d399' },
          { n: 'Apnea events', v: 'None detected', c: '#34d399' },
        ].map((r, i) => (
          <div key={i} className="w-drow">
            <div className="w-drow-left"><div className="w-drow-dot" style={{ background: r.c }} /><span className="w-drow-name">{r.n}</span></div>
            <span className="w-drow-val" style={{ color: r.c }}>{r.v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SleepDetail({ d }) {
  return (
    <>
      <h3 className="w-det-section">Weekly Sleep Stages</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} />
            <Tooltip contentStyle={tt} />
            <Bar dataKey="deep" stackId="s" fill="#818cf8" name="Deep" />
            <Bar dataKey="light" stackId="s" fill="rgba(56,189,248,0.45)" name="Light" />
            <Bar dataKey="rem" stackId="s" fill="#a78bfa" name="REM" />
            <Bar dataKey="awake" stackId="s" fill="#fb923c" name="Awake" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#818cf8' }} /> Deep</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: 'rgba(56,189,248,0.6)' }} /> Light</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#a78bfa' }} /> REM</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#fb923c' }} /> Awake</span>
        </div>
      </div>
    </>
  );
}

function ActivityDetail({ d }) {
  return (
    <>
      <h3 className="w-det-section">Weekly Steps</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} />
            <Tooltip contentStyle={tt} />
            <Bar dataKey="steps" fill="#3b82f6" name="Steps" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Today's Activities</div>
        {[
          { n: 'Walking', t: '32 min', cal: '142 kcal', c: '#34d399' },
          { n: 'Running', t: '18 min', cal: '210 kcal', c: '#ef4444' },
          { n: 'Cycling', t: '25 min', cal: '180 kcal', c: '#3b82f6' },
        ].map((a, i) => (
          <div key={i} className="w-drow">
            <div className="w-drow-left"><div className="w-drow-dot" style={{ background: a.c }} /><span className="w-drow-name">{a.n} — {a.t}</span></div>
            <span className="w-drow-val" style={{ color: a.c }}>{a.cal}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MetabolicDetail({ d }) {
  return (
    <>
      <h3 className="w-det-section">Weekly Calories</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} />
            <Tooltip contentStyle={tt} />
            <Bar dataKey="basal" fill="#818cf8" name="Basal" opacity={0.5} />
            <Bar dataKey="active" fill="#fb923c" name="Active" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#818cf8' }} /> Basal</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#fb923c' }} /> Active</span>
        </div>
      </div>
    </>
  );
}

function TempDetail({ d }) {
  return (
    <>
      <h3 className="w-det-section">Temperature — 24h</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={d}>
            {g('g_skin', '#fb923c', 0.2)}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} interval={4} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[34.5, 37.5]} />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="skin" stroke="#fb923c" fill="url(#g_skin)" strokeWidth={1.5} name="Skin °C" />
            <Line type="monotone" dataKey="body" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Body °C" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#fb923c' }} /> Skin</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#ef4444' }} /> Body Est.</span>
        </div>
      </div>
    </>
  );
}

function FitnessDetail({ vo2, radar }) {
  return (
    <>
      <h3 className="w-det-section">VO₂ Max — 8 Weeks</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={vo2}>
            {g('g_vo2', '#34d399')}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="wk" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[35, 50]} />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="vo2" stroke="#34d399" fill="url(#g_vo2)" strokeWidth={1.5} name="VO₂ Max" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <h3 className="w-det-section" style={{ marginTop: 20 }}>Fitness Profile</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radar}>
            <PolarGrid stroke="rgba(255,255,255,0.04)" />
            <PolarAngleAxis dataKey="m" tick={{ fill: '#555', fontSize: 10 }} />
            <Radar dataKey="v" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Performance</div>
        {[
          { n: 'Running power', v: '245 W', c: '#a78bfa' },
          { n: 'Aerobic effect', v: '3.2 / 5', c: '#3b82f6' },
          { n: 'Anaerobic effect', v: '1.8 / 5', c: '#fbbf24' },
        ].map((r, i) => (
          <div key={i} className="w-drow">
            <span className="w-drow-name">{r.n}</span>
            <span className="w-drow-val" style={{ color: r.c }}>{r.v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function StressDetail({ d, live }) {
  return (
    <>
      <h3 className="w-det-section">Stress & Relaxation — 24h</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={d}>
            {g('g_str', '#ef4444')}
            {g('g_rel', '#34d399', 0.15)}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="t" tick={{ fill: '#555', fontSize: 10 }} interval={4} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="stress" stroke="#ef4444" fill="url(#g_str)" strokeWidth={1.5} name="Stress" />
            <Area type="monotone" dataKey="relax" stroke="#34d399" fill="url(#g_rel)" strokeWidth={1.5} name="Relaxation" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="w-leg">
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#ef4444' }} /> Stress</span>
          <span className="w-leg-item"><span className="w-leg-dot" style={{ background: '#34d399' }} /> Relaxation</span>
        </div>
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Stress Events</div>
        {[
          { time: '09:15', val: 78, note: 'Morning commute', c: '#fb923c' },
          { time: '14:30', val: 82, note: 'Meeting', c: '#ef4444' },
          { time: '17:45', val: 28, note: 'Walk break', c: '#34d399' },
        ].map((e, i) => (
          <div key={i} className="w-drow">
            <div className="w-drow-left">
              <span style={{ fontSize: '0.72rem', color: e.c, fontWeight: 600, minWidth: 40 }}>{e.time}</span>
              <span className="w-drow-name">{e.note}</span>
            </div>
            <span className="w-drow-val" style={{ color: e.c }}>{e.val}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function EnvironDetail() {
  return (
    <>
      <h3 className="w-det-section">Environmental Details</h3>
      <div className="w-dcard">
        <div className="w-dcard-title">Exposure Today</div>
        {[
          { n: 'UV exposure duration', v: '1.8 hrs', c: '#fb923c' },
          { n: 'Time above 60 dB', v: '2.4 hrs', c: '#fbbf24' },
          { n: 'Peak noise', v: '78 dB', c: '#ef4444' },
          { n: 'Elevation gain', v: '+120 m', c: '#38bdf8' },
          { n: 'Barometric trend', v: 'Stable', c: '#a78bfa' },
        ].map((r, i) => (
          <div key={i} className="w-drow">
            <span className="w-drow-name">{r.n}</span>
            <span className="w-drow-val" style={{ color: r.c }}>{r.v}</span>
          </div>
        ))}
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Recommendations</div>
        <p style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.5, margin: 0 }}>
          UV index is high — apply SPF 30+ if outdoors. Noise levels moderate, safe for extended periods. Altitude stable, no concern for pressure sickness.
        </p>
      </div>
    </>
  );
}

function WomensDetail({ d }) {
  return (
    <>
      <h3 className="w-det-section">Basal Body Temp — Full Cycle</h3>
      <div className="w-dcard">
        <ResponsiveContainer width="100%" height={170}>
          <LineChart data={d}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} />
            <YAxis tick={{ fill: '#555', fontSize: 10 }} domain={[35.8, 37.2]} />
            <Tooltip contentStyle={tt} formatter={(v) => [v + '°C', 'BBT']} labelFormatter={(d) => `Day ${d}`} />
            <Line type="monotone" dataKey="temp" stroke="#f472b6" strokeWidth={1.5} dot={{ r: 2, fill: '#f472b6' }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.7rem', color: '#555', margin: '10px 0 0', lineHeight: 1.4 }}>
          Temperature rise after day 14 suggests ovulation. Luteal phase shows sustained elevation.
        </p>
      </div>
    </>
  );
}

function SafetyDetail() {
  return (
    <>
      <h3 className="w-det-section">Safety Status</h3>
      <div className="w-dcard">
        {[
          { n: 'Fall Detection', d: 'Accelerometer + gyroscope monitoring. No falls today.', ok: true },
          { n: 'Crash Detection', d: 'High-g impact sensor enabled. Auto-triggers emergency.', ok: true },
          { n: 'HR Alert Threshold', d: 'Triggers if HR >150 at rest or <40 bpm.', ok: true },
          { n: 'SpO₂ Alert', d: 'Triggers if SpO₂ <90% sustained >30 seconds.', ok: true },
        ].map((a, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.n}</span>
              <span style={{ fontSize: '0.62rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 7px', borderRadius: 4 }}>Active</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#555', margin: '4px 0 0', lineHeight: 1.4 }}>{a.d}</p>
          </div>
        ))}
      </div>
      <div className="w-dcard" style={{ marginTop: 16 }}>
        <div className="w-dcard-title">Posture & Gait</div>
        {[
          { n: 'Sedentary time', v: '3.2 hrs', c: '#fb923c' },
          { n: 'Standing time', v: '4.8 hrs', c: '#38bdf8' },
          { n: 'Gait symmetry', v: '96%', c: '#a78bfa' },
          { n: 'Walking stability', v: 'Stable', c: '#34d399' },
          { n: 'Fall risk', v: 'Low', c: '#34d399' },
        ].map((r, i) => (
          <div key={i} className="w-drow">
            <span className="w-drow-name">{r.n}</span>
            <span className="w-drow-val" style={{ color: r.c }}>{r.v}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function LabsDetail() {
  return (
    <>
      <h3 className="w-det-section">Experimental Sensors</h3>
      {[
        { n: 'Non-invasive Blood Glucose', v: '98 mg/dL', c: '#fb923c', t: 'Beta', d: 'IR spectroscopy estimation — not for medical decisions.' },
        { n: 'Blood Alcohol', v: '0.00 g/dL', c: '#a78bfa', t: 'Research', d: 'Transdermal ethanol detection via skin sensor.' },
        { n: 'BP Uncalibrated', v: '120/78 mmHg', c: '#ef4444', t: 'Beta', d: 'Estimated via pulse transit time, no cuff calibration.' },
        { n: 'Hydration Sensor', v: '68%', c: '#3b82f6', t: 'Research', d: 'Bioimpedance-based hydration estimation.' },
        { n: 'Cortisol', v: '14.2 µg/dL', c: '#fbbf24', t: 'Research', d: 'Interstitial fluid cortisol via microneedle patch concept.' },
        { n: 'Lactate', v: '1.8 mmol/L', c: '#38bdf8', t: 'Beta', d: 'Continuous sweat-based lactate for endurance athletes.' },
      ].map((s, i) => (
        <div key={i} className="w-dcard" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.n}</span>
            <span style={{ fontSize: '0.55rem', padding: '2px 7px', borderRadius: 4, background: s.t === 'Beta' ? 'rgba(251,146,60,0.1)' : 'rgba(167,139,250,0.1)', color: s.t === 'Beta' ? '#fb923c' : '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.t}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 600, color: s.c, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
          <p style={{ fontSize: '0.68rem', color: '#555', margin: '6px 0 0', lineHeight: 1.4 }}>{s.d}</p>
        </div>
      ))}
    </>
  );
}
