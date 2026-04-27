import { useMemo, useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Droplets,
  HeartPulse,
  Languages,
  MoonStar,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Siren,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRoundPlus,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const moodChoices = ['Happy', 'Calm', 'Tired', 'Stressed', 'Irritated']
const symptomChoices = ['Cramps', 'Acne', 'Fatigue', 'Bloating', 'Headache']

const cycleHistory = [
  {
    month: 'Nov',
    cycleLength: 29,
    flow: 'Medium',
    symptomLoad: 3,
    mood: 'Calm',
    stress: 4,
    bleedingDays: 5,
  },
  {
    month: 'Dec',
    cycleLength: 34,
    flow: 'Heavy',
    symptomLoad: 4,
    mood: 'Tired',
    stress: 6,
    bleedingDays: 6,
  },
  {
    month: 'Jan',
    cycleLength: 38,
    flow: 'Heavy',
    symptomLoad: 4,
    mood: 'Stressed',
    stress: 7,
    bleedingDays: 7,
  },
  {
    month: 'Feb',
    cycleLength: 41,
    flow: 'Medium',
    symptomLoad: 5,
    mood: 'Irritated',
    stress: 8,
    bleedingDays: 6,
  },
  {
    month: 'Mar',
    cycleLength: 35,
    flow: 'Medium',
    symptomLoad: 4,
    mood: 'Tired',
    stress: 6,
    bleedingDays: 5,
  },
  {
    month: 'Apr',
    cycleLength: 37,
    flow: 'Light',
    symptomLoad: 5,
    mood: 'Stressed',
    stress: 7,
    bleedingDays: 5,
  },
]

const symptomTrend = [
  { name: 'Cramps', value: 28, color: '#f66f9e' },
  { name: 'Acne', value: 20, color: '#9c7cf0' },
  { name: 'Fatigue', value: 24, color: '#4bb6b0' },
  { name: 'Bloating', value: 16, color: '#f5b971' },
  { name: 'Headache', value: 12, color: '#7e8df4' },
]


const onboardingDefaults = {
  name: 'Nireeksha',
  age: 22,
  bmi: 27.2,
  cycleAverage: 36,
  pcosHistory: 'Family history',
}

const quickLogDefaults = {
  flow: 'Medium',
  mood: 'Tired',
  symptoms: ['Acne', 'Fatigue'],
  stress: 7,
  weight: 68,
}

function AuthView({ mode, setMode, setToken }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
    const body = mode === 'login' 
      ? JSON.stringify({ email, password })
      : JSON.stringify({ email, password, name, age: 22, bmi: 22, cycle_average: 28, pcos_history: 'None' })

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      })
      
      const isJson = res.headers.get('content-type')?.includes('application/json')
      const data = isJson ? await res.json() : null
      
      if (!res.ok) {
        throw new Error(data?.detail || `Error: ${res.status} ${res.statusText}`)
      }
      
      if (mode === 'login') {
        setToken(data.access_token)
      } else {
        setMode('login')
        alert('Account created! Please log in.')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="surface auth-card">
        <div className="auth-header">
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '2rem' }}>Cycle<span style={{ color: 'var(--rose)' }}>AI</span></h2>
          <p>{mode === 'login' ? 'Welcome back' : 'Start your journey'}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <div style={{ position: 'relative' }}>
                <input style={{ paddingLeft: '44px' }} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                <UserRoundPlus size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--muted)' }} />
              </div>
            </label>
          )}
          <label>
            Email address
            <div style={{ position: 'relative' }}>
              <input type="email" style={{ paddingLeft: '44px' }} placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--muted)' }} />
            </div>
          </label>
          <label>
            Password
            <div style={{ position: 'relative' }}>
              <input type="password" style={{ paddingLeft: '44px' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--muted)' }} />
            </div>
          </label>
          {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="primary-btn full-width">
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
        <div className="auth-toggle">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const token = localStorage.getItem('cycleai_token')

  useEffect(() => {
    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) return []
      return res.json()
    })
    .then(data => {
      if (Array.isArray(data)) setUsers(data)
    })
    .catch(console.error)
  }, [token])

  return (
    <div className="admin-dashboard">
      <SectionTitle icon={ShieldCheck} title="Admin control panel" subtitle="Overview of all registered users and health metrics." />
      <div className="admin-stat-grid">
        <div className="surface metric-card lavender">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="surface metric-card teal">
          <span>Active monitors</span>
          <strong>{users.filter(u => u.age > 0).length}</strong>
        </div>
      </div>
      <div className="surface admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Age</th>
              <th>Avg cycle</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.age}</td>
                <td>{u.cycle_average} days</td>
                <td><span className={`pill ${u.is_admin ? 'pill-high' : 'pill-low'}`}>{u.is_admin ? 'Admin' : 'User'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// We now use the FastAPI backend for ML predictions
// function getRiskProfile(form) { ... }

function getNextPeriodDate(cycleAverage) {
  const date = new Date('2026-05-09')
  date.setDate(date.getDate() + (cycleAverage - 28))
  return date
}

function daysBetween(from, to) {
  const diff = to.getTime() - from.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function buildCalendarData(cycleAverage) {
  const current = new Date('2026-04-01')
  const month = current.getMonth()
  const year = current.getFullYear()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const predictedStart = Math.max(19, cycleAverage - 10)
  const fertileStart = Math.max(10, predictedStart - 6)

  return Array.from({ length: firstDay + daysInMonth }, (_, index) => {
    if (index < firstDay) return { empty: true, id: `empty-${index}` }
    const day = index - firstDay + 1
    const isLogged = day >= 3 && day <= 7
    const isPredicted = day >= predictedStart && day <= predictedStart + 4
    const isFertile = day >= fertileStart && day <= fertileStart + 4
    return {
      id: day,
      day,
      isLogged,
      isPredicted,
      isFertile,
      note: isLogged ? 'Logged period' : isPredicted ? 'Predicted cycle' : isFertile ? 'Fertile window' : '',
    }
  })
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ringData(value) {
  return [
    { name: 'score', value },
    { name: 'rest', value: 100 - value },
  ]
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('cycleai_token'))
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(onboardingDefaults)
  const [log, setLog] = useState(quickLogDefaults)
  const [activeTab, setActiveTab] = useState('home')
  const [risk, setRisk] = useState({ total: 0, level: 'Low', confidence: 0 })
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  const [history, setHistory] = useState([])

  // Load user profile on mount if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('cycleai_token', token)
      fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then(data => {
        setUser(data)
        setProfile({
          name: data.name,
          age: data.age,
          bmi: data.bmi,
          cycleAverage: data.cycle_average,
          pcosHistory: data.pcos_history
        })
      })
      .catch(() => {
        setToken(null)
        localStorage.removeItem('cycleai_token')
      })

      fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) return []
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) setHistory(data)
      })
      .catch(console.error)
    }
  }, [token])

  const handleUpdateProfile = async (newProfile) => {
    setProfile(newProfile)
    // Optional: add a backend endpoint to update profile if needed
    // For now we assume the signup/profile is enough
  }

  const handleSaveLog = async () => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          month: new Date().toLocaleDateString('en-IN', { month: 'short' }),
          flow: log.flow,
          mood: log.mood,
          stress: log.stress,
          weight: log.weight,
          symptoms: log.symptoms
        })
      })
      if (response.ok) {
        const newLog = await response.json()
        setHistory([...history, newLog])
        alert('Daily log saved!')
      }
    } catch (err) {
      console.error("Save Log Error:", err);
    }
  }
  const historyData = history.length > 0 
    ? history.map(h => ({
        month: h.month,
        cycleLength: profile.cycleAverage, // current average
        flow: h.flow,
        symptomLoad: h.symptoms.length,
        mood: h.mood,
        stress: h.stress,
        bleedingDays: 5, // mock or add to DB
      }))
    : cycleHistory

  const cycleChart = historyData.map((item, index) => ({
    ...item,
    risk: Math.min(92, 36 + item.symptomLoad * 7 + item.stress * 2 + Math.max(0, item.cycleLength - 30)),
    phase: ['Recover', 'Stable', 'Monitor', 'Alert', 'Monitor', 'Monitor'][index % 6],
  }))

  const moodHeatmap = historyData.map((item) => ({
    month: item.month,
    moodIndex: moodChoices.indexOf(item.mood) + 1,
    stress: item.stress,
  }))

  useEffect(() => {
    if (!token) return

    const fetchPrediction = async () => {
      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            age: profile.age,
            cycle_length: profile.cycleAverage,
            bmi: profile.bmi,
            weight_gain: log.symptoms.includes('Weight gain') ? 1 : 0,
            hair_growth: log.symptoms.includes('Excess facial/body hair') ? 1 : 0,
            skin_darkening: log.symptoms.includes('Dark skin patches') ? 1 : 0,
            hair_loss: log.symptoms.includes('Hair loss/thinning') ? 1 : 0,
            pimples: log.symptoms.includes('Acne/Oily skin') ? 1 : 0
          })
        });
        if (response.ok) {
          const data = await response.json();
          setRisk({
            total: data.risk_probability,
            level: data.risk_level,
            confidence: data.confidence
          });
        }
      } catch (err) {
        console.error("ML Prediction Error:", err);
      }
    };
    fetchPrediction();
  }, [profile, log, token]);

  const nextPeriodDate = useMemo(() => getNextPeriodDate(profile.cycleAverage), [profile.cycleAverage])
  const daysToPeriod = daysBetween(new Date('2026-04-26'), nextPeriodDate)
  const healthScore = Math.max(38, 100 - Math.round(risk.total * 0.52))
  const calendarDays = buildCalendarData(profile.cycleAverage)

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    setHistory([])
    setProfile(onboardingDefaults)
    setLog(quickLogDefaults)
    localStorage.removeItem('cycleai_token')
    setActiveTab('home')
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: HeartPulse },
    { id: 'tracker', label: 'Tracker', icon: CalendarDays },
    { id: 'prediction', label: 'Prediction', icon: BrainCircuit },
    { id: 'reports', label: 'Reports', icon: Download },
  ]

  if (user?.is_admin) {
    navigation.push({ id: 'admin', label: 'Admin', icon: ShieldCheck })
  }

  if (!token) {
    return <AuthView mode={authMode} setMode={setAuthMode} setToken={setToken} />
  }

  if (activeTab === 'home') {
    return (
      <div className="home-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span className="eyebrow">CycleAI menstrual intelligence</span>
              {user && <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Welcome, {user.name}</span>}
            </div>
            <h1>Track periods, decode patterns, and spot PCOD signals early.</h1>
            <p>
              A proactive health dashboard that turns everyday period logs into risk insights, reminders,
              trends, and doctor-ready summaries.
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => setActiveTab('dashboard')}>
                Start tracking
              </button>
              <button className="ghost-btn" onClick={() => setActiveTab('prediction')}>
                View prediction engine
              </button>
              <button className="ghost-btn" onClick={handleLogout} style={{ color: '#ff6b6b' }}>
                Logout
              </button>
            </div>
            <div className="hero-stats">
              <StatCard icon={Clock3} label="Next period" value={`${daysToPeriod} days`} />
              <StatCard icon={ShieldAlert} label="Risk score" value={`${risk.total}%`} />
              <StatCard icon={TrendingUp} label="Health score" value={`${healthScore}/100`} />
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass-card glow-card">
              <div className="card-topline">
                <span>Health overview</span>
                <span className={`pill pill-${risk.level.toLowerCase()}`}>{risk.level} watch</span>
              </div>
              <div className="hero-ring-wrap">
                <ProgressRing value={healthScore} label="Overall health score" accent="#f66f9e" />
                <div className="hero-insight">
                  <p>Confidence level</p>
                  <strong>{risk.confidence}%</strong>
                  <span>Your current data is strong enough for pattern-based guidance.</span>
                </div>
              </div>
              <div className="mini-grid">
                <MiniCard label="Cycle regularity" value="61%" tone="rose" />
                <MiniCard label="Symptom load" value="Elevated" tone="gold" />
                <MiniCard label="Fertile window" value="May 10-14" tone="teal" />
                <MiniCard label="Doctor report" value="Ready" tone="lavender" />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2 className="brand-title" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>Cycle<span>AI</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-chip ${activeTab === id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <button className="nav-chip logout-btn" onClick={handleLogout} style={{ marginTop: 'auto' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="app-content">
        <section className="main-layout">
          <div className="main-column">
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'dashboard' && (
            <>
              <div className="grid-two">
                <section className="surface section-card">
                  <SectionTitle
                    icon={HeartPulse}
                    title="Smart dashboard"
                    subtitle="Your personalized command center for cycle and hormonal patterns."
                  />
                  <div className="dashboard-grid">
                    <div className="metric-card rose">
                      <span>Next cycle</span>
                      <strong>{formatDate(nextPeriodDate)}</strong>
                      <p>Predicted using your last six cycle lengths.</p>
                    </div>
                    <div className="metric-card lavender">
                      <span>PCOD watch</span>
                      <strong>{risk.level}</strong>
                      <p>Your data suggests patterns worth monitoring, not a diagnosis.</p>
                    </div>
                    <div className="metric-card teal">
                      <span>Quick insight</span>
                      <strong>Stress + acne linked</strong>
                      <p>Higher stress weeks align with more acne and fatigue logs.</p>
                    </div>
                  </div>
                </section>

                <section className="surface section-card">
                  <SectionTitle
                    icon={Droplets}
                    title="Quick daily log"
                    subtitle="Capture the signals your body is already giving you."
                  />
                  <div className="form-grid">
                    <label>
                      Flow
                      <select value={log.flow} onChange={(e) => setLog({ ...log, flow: e.target.value })}>
                        <option>Light</option>
                        <option>Medium</option>
                        <option>Heavy</option>
                      </select>
                    </label>
                    <label>
                      Mood
                      <select value={log.mood} onChange={(e) => setLog({ ...log, mood: e.target.value })}>
                        {moodChoices.map((mood) => (
                          <option key={mood}>{mood}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Stress level
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={log.stress}
                        onChange={(e) => setLog({ ...log, stress: Number(e.target.value) })}
                      />
                      <span className="helper">{log.stress}/10</span>
                    </label>
                    <label>
                      Weight (kg)
                      <input
                        type="number"
                        value={log.weight}
                        onChange={(e) => setLog({ ...log, weight: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <div className="chips-row">
                    {symptomChoices.map((symptom) => {
                      const selected = log.symptoms.includes(symptom)
                      return (
                        <button
                          key={symptom}
                          className={`choice-chip ${selected ? 'selected' : ''}`}
                          onClick={() =>
                            setLog({
                              ...log,
                              symptoms: selected
                                ? log.symptoms.filter((item) => item !== symptom)
                                : [...log.symptoms, symptom],
                            })
                          }
                        >
                          {symptom}
                        </button>
                      )
                    })}
                  </div>
                  <button className="primary-btn full-width" onClick={handleSaveLog} style={{ marginTop: '24px' }}>
                    Save daily entry
                  </button>
                </section>
              </div>

              <div className="grid-two">
                <section className="surface section-card chart-card">
                  <SectionTitle
                    icon={TrendingUp}
                    title="Cycle trend graph"
                    subtitle="Irregularity and risk movement across the last six months."
                  />
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={cycleChart}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#ffffff16" />
                        <XAxis dataKey="month" stroke="#998fb8" />
                        <YAxis yAxisId="left" stroke="#998fb8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#998fb8" />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="cycleLength" stroke="#f66f9e" strokeWidth={3} />
                        <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#4bb6b0" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="surface section-card chart-card">
                  <SectionTitle
                    icon={MoonStar}
                    title="Mood and symptom map"
                    subtitle="See how emotional state and symptom intensity move together."
                  />
                  <div className="heatmap">
                    {moodHeatmap.map((entry) => (
                      <div key={entry.month} className="heat-row">
                        <span>{entry.month}</span>
                        <div className={`heat-box mood-${entry.moodIndex}`}>{entry.moodIndex}/5 mood strain</div>
                        <div className={`heat-box stress-${entry.stress > 6 ? 'high' : 'mid'}`}>
                          Stress {entry.stress}/10
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === 'tracker' && (
            <div className="grid-stack">
              <section className="surface section-card">
                <SectionTitle
                  icon={CalendarDays}
                  title="Cycle calendar"
                  subtitle="Logged periods, predicted dates, and fertile window in one place."
                />
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="calendar-head">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((cell) =>
                    cell.empty ? (
                      <div key={cell.id} className="calendar-cell empty" />
                    ) : (
                      <div
                        key={cell.id}
                        className={`calendar-cell ${cell.isLogged ? 'logged' : ''} ${cell.isPredicted ? 'predicted' : ''} ${
                          cell.isFertile ? 'fertile' : ''
                        }`}
                      >
                        <strong>{cell.day}</strong>
                        <span>{cell.note}</span>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="surface section-card">
                <SectionTitle
                  icon={UserRoundPlus}
                  title="Onboarding profile"
                  subtitle="Core factors that feed your prediction baseline."
                />
                <div className="form-grid">
                  <label>
                    Name
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </label>
                  <label>
                    Age
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    BMI
                    <input
                      type="number"
                      step="0.1"
                      value={profile.bmi}
                      onChange={(e) => setProfile({ ...profile, bmi: Number(e.target.value) })}
                    />
                  </label>
                  <label>
                    Avg cycle length
                    <input
                      type="number"
                      value={profile.cycleAverage}
                      onChange={(e) => setProfile({ ...profile, cycleAverage: Number(e.target.value) })}
                    />
                  </label>
                  <label className="full-span">
                    History
                    <select
                      value={profile.pcosHistory}
                      onChange={(e) => setProfile({ ...profile, pcosHistory: e.target.value })}
                    >
                      <option>Family history</option>
                      <option>No known history</option>
                      <option>Previously diagnosed</option>
                    </select>
                  </label>
                </div>
                <hr className="divider" />
                <BMICalculator profile={profile} setProfile={setProfile} />
              </section>
            </div>
          )}

          {activeTab === 'prediction' && (
            <div className="grid-two">
              <section className="surface section-card prediction-panel">
                <SectionTitle
                  icon={BrainCircuit}
                  title="PCOD prediction engine"
                  subtitle="A transparent mock intelligence layer inspired by your proposed ML pipeline."
                />
                <div className="prediction-grid">
                  <div className="gauge-panel">
                    <ResponsiveContainer width="100%" height={260}>
                      <RadialBarChart
                        innerRadius="68%"
                        outerRadius="100%"
                        data={ringData(risk.total)}
                        startAngle={180}
                        endAngle={0}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar dataKey="value" cornerRadius={20} fill="#f66f9e" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="gauge-center">
                      <strong>{risk.total}%</strong>
                      <span>{risk.level} risk watch</span>
                    </div>
                  </div>
                  <div className="prediction-copy">
                    <p>
                      Your recent entries show longer-than-average cycles, elevated symptom frequency, and stress
                      patterns that deserve attention.
                    </p>
                    <div className="alert-list">
                      <AlertLine icon={CheckCircle2} text={`Confidence: ${risk.confidence}%`} />
                      <AlertLine icon={Siren} text="Early warning: irregularity has risen over the last 3 cycles" />
                      <AlertLine icon={Stethoscope} text="Suggested next step: export this report for a clinician review" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="surface section-card">
                <SectionTitle
                  icon={Sparkles}
                  title="Why the score changed"
                  subtitle="Human-readable explanations make the analytics easier to trust."
                />
                <div className="explain-list">
                  <ExplainCard title="Cycle irregularity" value={`${profile.cycleAverage} days`} detail="Longer average cycles increased baseline risk." />
                  <ExplainCard title="Symptoms logged" value={`${log.symptoms.length} active`} detail="Acne, fatigue, and cramps often cluster with hormonal imbalance signals." />
                  <ExplainCard title="BMI and stress" value={`${profile.bmi} BMI / ${log.stress} stress`} detail="Weight and stress are used as contextual, non-diagnostic indicators." />
                </div>
              </section>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid-two">
              <section className="surface section-card chart-card">
                <SectionTitle
                  icon={Download}
                  title="Monthly health report"
                  subtitle="Summary cards, export-ready insights, and doctor-shareable trends."
                />
                <div className="report-summary">
                  <ReportTile label="Cycle average" value={`${profile.cycleAverage} days`} />
                  <ReportTile label="Bleeding duration" value="5.7 days" />
                  <ReportTile label="Most common symptom" value="Fatigue" />
                  <ReportTile label="Risk trend" value="Rising" />
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={cycleChart}>
                      <defs>
                        <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9c7cf0" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#9c7cf0" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ffffff14" />
                      <XAxis dataKey="month" stroke="#998fb8" />
                      <YAxis stroke="#998fb8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="risk" stroke="#9c7cf0" fill="url(#riskFill)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="surface section-card chart-card">
                <SectionTitle
                  icon={Activity}
                  title="Symptom distribution"
                  subtitle="Useful for spotting recurring clusters and discussing them during appointments."
                />
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={symptomTrend} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {symptomTrend.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <button className="primary-btn full-width">Download PDF summary</button>
              </section>
            </div>
          )}
        </div>

      </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <Icon size={18} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function MiniCard({ label, value, tone }) {
  return (
    <div className={`mini-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="section-title">
      <div className="section-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}

function ProgressRing({ value, label, accent }) {
  return (
    <div className="progress-ring">
      <ResponsiveContainer width="100%" height={220}>
        <RadialBarChart innerRadius="74%" outerRadius="100%" data={ringData(value)} startAngle={90} endAngle={-270}>
          <RadialBar dataKey="value" cornerRadius={18} fill={accent} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="progress-ring-center">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function AlertLine({ icon: Icon, text }) {
  return (
    <div className="alert-line">
      <Icon size={16} />
      <span>{text}</span>
    </div>
  )
}

function ExplainCard({ title, value, detail }) {
  return (
    <div className="explain-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  )
}

function ReportTile({ label, value }) {
  return (
    <div className="report-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}


function BMICalculator({ profile, setProfile }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleCalculate = () => {
    if (height && weight) {
      const hM = height / 100;
      const calcBmi = (weight / (hM * hM)).toFixed(1);
      const newProfile = { ...profile, bmi: Number(calcBmi) };
      setProfile(newProfile);
      // The profile is now updated in state and synced with prediction
      setHeight('');
      setWeight('');
    }
  };

  return (
    <div className="bmi-calculator">
      <div className="section-title" style={{ marginBottom: '16px' }}>
        <div className="section-icon">
          <Activity size={18} />
        </div>
        <div>
          <h2>BMI Calculator</h2>
          <p>Quickly compute and update your BMI.</p>
        </div>
      </div>
      <div className="form-grid">
        <label>
          Height (cm)
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="165" />
        </label>
        <label>
          Weight (kg)
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" />
        </label>
        <button className="primary-btn full-span" onClick={handleCalculate}>Calculate & Update</button>
      </div>
    </div>
  )
}

export default App
