#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "Rebuilding Miracle Centre Junior Church Gallery..."

# Keep the existing .env file if it exists
if [ ! -f .env ]; then
cat > .env <<'ENV'
VITE_SUPABASE_URL=https://mnyeliazirdjykhefvvy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_EXISTING_PUBLISHABLE_KEY
ENV
fi

# Remove old application files, preserve .env and git
rm -rf src public
mkdir -p src/lib src/services src/components src/pages supabase/functions/admin-actions

cat > package.json <<'PKG'
{
  "name": "miracle-centre-junior-gallery",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.57.0",
    "framer-motion": "^12.23.0",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "3.4.17",
    "vite": "^5.4.19"
  }
}
PKG

cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#176d68" />
  <meta name="description" content="Miracle Centre Junior Church Gallery" />
  <title>Miracle Centre | Junior Church</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
HTML

cat > vite.config.js <<'JS'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0' }
})
JS

cat > tailwind.config.js <<'JS'
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: []
}
JS

cat > postcss.config.js <<'JS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
JS

cat > src/main.jsx <<'JS'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
JS

cat > src/lib/supabase.js <<'JS'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key || key.includes('YOUR_EXISTING')) {
  console.warn('Add your Supabase URL and publishable key to .env')
}

export const supabase = createClient(url || '', key || '')
JS

cat > src/services/admin.js <<'JS'
import { supabase } from '../lib/supabase'

export async function adminAction(password, action, payload = {}) {
  const { data, error } = await supabase.functions.invoke('admin-actions', {
    body: { password, action, ...payload }
  })

  if (error) throw new Error(error.message || 'Request failed')
  if (!data?.success) throw new Error(data?.error || 'Action failed')
  return data
}

export async function uploadImage(password, file, bucket = 'gallery-images') {
  if (!file) return null

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    throw new Error('Only JPG, PNG and WEBP images are allowed.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be smaller than 10 MB.')
  }

  const result = await adminAction(password, 'upload_url', {
    bucket,
    content_type: file.type,
    file_size: file.size
  })

  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(result.path, result.token, file, {
      contentType: file.type,
      upsert: false
    })

  if (error) throw error
  return result.path
}

export function imageUrl(bucket, path) {
  if (!path) return ''
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
JS

cat > src/services/data.js <<'JS'
import { supabase } from '../lib/supabase'

export async function getRows(table, query = '*') {
  const { data, error } = await supabase
    .from(table)
    .select(query)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getMembers() {
  return getRows('members', '*, exco_positions(position_name)')
}

export async function getPositions() {
  const { data, error } = await supabase
    .from('exco_positions')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) throw error
  return data || []
}
JS

cat > src/components/Layout.jsx <<'JS'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  Home, Users, Award, Images, Newspaper, Menu, X,
  ShieldCheck, LogOut, LayoutDashboard
} from 'lucide-react'
import { useState } from 'react'

const publicLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/exco', label: 'Leadership', icon: Award },
  { to: '/status', label: 'Church Updates', icon: Newspaper },
  { to: '/throwbacks', label: 'Throwbacks', icon: Images }
]

export default function Layout({ children, admin, logout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = admin
    ? [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/members', label: 'Members', icon: Users },
        { to: '/admin/exco', label: 'Leadership', icon: Award },
        { to: '/admin/status', label: 'Updates', icon: Newspaper },
        { to: '/admin/throwbacks', label: 'Throwbacks', icon: Images }
      ]
    : publicLinks

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/" className="brand">
          <span className="brand-mark"><ShieldCheck size={22} /></span>
          <span>
            <strong>Miracle Centre</strong>
            <small>Junior Church</small>
          </span>
        </Link>
        <nav className="desktop-nav">
          {links.map(item => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/' || item.to === '/admin'}>
                <Icon size={17} /> {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="top-actions">
          {admin
            ? <button className="text-button" onClick={logout}><LogOut size={17}/> Logout</button>
            : <Link className="admin-link" to="/admin/login">Admin</Link>}
        </div>
      </header>

      {open && (
        <div className="mobile-panel">
          {links.map(item => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <Icon size={19}/>{item.label}
              </NavLink>
            )
          })}
          {admin && <button onClick={logout}><LogOut size={18}/> Logout</button>}
        </div>
      )}

      <main className="main-content" key={location.pathname}>{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Miracle Centre Junior Church</span>
        <span>Growing together in faith.</span>
      </footer>
    </div>
  )
}
JS

cat > src/components/UI.jsx <<'JS'
import { motion } from 'framer-motion'
import { ImageOff, LoaderCircle } from 'lucide-react'

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Loading() {
  return <div className="loading"><LoaderCircle className="spin" size={26}/><span>Loading...</span></div>
}

export function Empty({ title = 'Nothing here yet', description = 'New content will appear here when available.' }) {
  return (
    <div className="empty-state">
      <span><ImageOff size={25}/></span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`card ${className}`}>{children}</motion.div>
}

export function Notice({ message, type = 'error' }) {
  if (!message) return null
  return <div className={`notice ${type}`}>{message}</div>
}
JS

cat > src/pages/Public.jsx <<'JS'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, Images, Camera } from 'lucide-react'
import { getRows, getMembers, getPositions } from '../services/data'
import { imageUrl } from '../services/admin'
import { PageHeading, Loading, Empty, Card } from '../components/UI'

const classes = ['All Classes', 'Toddlers', 'Children', 'Pre-teens', 'Teenagers']

export function Home() {
  const [stats, setStats] = useState({ members: 0, statuses: 0, throwbacks: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMembers(), getRows('statuses'), getRows('throwbacks')])
      .then(([members, statuses, throwbacks]) => {
        setStats({ members: members.length, statuses: statuses.length, throwbacks: throwbacks.length })
        setRecent(throwbacks.slice(0, 3))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow light">WELCOME TO OUR FAMILY</span>
          <h1>Growing in faith.<br/><em>Growing together.</em></h1>
          <p>A place to celebrate our children, share memories and keep our church family connected.</p>
          <div className="hero-actions">
            <Link to="/members" className="button button-white">Meet our members <ArrowRight size={18}/></Link>
            <Link to="/throwbacks" className="hero-secondary">Explore memories</Link>
          </div>
        </div>
        <div className="hero-decoration"><div className="hero-circle"><Camera size={58}/></div></div>
      </section>

      <section className="section">
        <div className="section-title">
          <div><span className="eyebrow">OUR COMMUNITY</span><h2>A family that grows together</h2></div>
          <p>Discover the people and moments that make our Junior Church special.</p>
        </div>
        {loading ? <Loading/> : (
          <div className="stats-grid">
            <Card><span className="stat-icon"><Users/></span><strong>{stats.members}</strong><span>Church members</span></Card>
            <Card><span className="stat-icon"><Award/></span><strong>Our</strong><span>Leadership team</span></Card>
            <Card><span className="stat-icon"><Images/></span><strong>{stats.throwbacks}</strong><span>Shared memories</span></Card>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-title">
          <div><span className="eyebrow">FROM OUR GALLERY</span><h2>Moments worth keeping</h2></div>
          <Link to="/throwbacks" className="inline-link">View gallery <ArrowRight size={17}/></Link>
        </div>
        {recent.length ? <div className="gallery-grid">
          {recent.map(item => <Link to="/throwbacks" className="photo-card" key={item.id}>
            <img src={imageUrl('gallery-images', item.image_path)} alt={item.description || 'Church memory'}/>
            <div>{item.description || 'A special memory'}</div>
          </Link>)}
        </div> : <Empty title="Our memories are coming soon" />}
      </section>
    </>
  )
}

export function Members() {
  const [members, setMembers] = useState([])
  const [filter, setFilter] = useState('All Classes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMembers().then(setMembers).catch(console.error).finally(() => setLoading(false))
  }, [])

  const visible = filter === 'All Classes' ? members : members.filter(m => m.class_name === filter)

  return (
    <section className="section page-section">
      <PageHeading eyebrow="OUR PEOPLE" title="Meet our members" description="Get to know the children and young people in our church family."/>
      <div className="filter-row">
        {classes.map(c => <button key={c} onClick={() => setFilter(c)} className={`filter-chip ${filter === c ? 'active' : ''}`}>{c}</button>)}
      </div>
      {loading ? <Loading/> : visible.length ? <div className="people-grid">
        {visible.map(m => <Card className="person-card" key={m.id}>
          <div className="person-photo">
            {m.image_path ? <img src={imageUrl('member-photos', m.image_path)} alt={m.name}/> : <Users size={35}/>}
          </div>
          <div className="person-info"><h3>{m.name}</h3><span>{m.class_name}</span>{m.role && <small>{m.role}</small>}</div>
        </Card>)}
      </div> : <Empty title="No members found" description="There are no members in this category yet."/>}
    </section>
  )
}

export function Exco() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getMembers().then(rows => setPositions(rows.filter(m => m.exco_position_id)))
      .catch(console.error).finally(() => setLoading(false))
  }, [])
  return <section className="section page-section">
    <PageHeading eyebrow="OUR LEADERS" title="Leadership team" description="Meet the people serving and guiding our Junior Church."/>
    {loading ? <Loading/> : positions.length ? <div className="people-grid">
      {positions.map(m => <Card className="person-card" key={m.id}>
        <div className="person-photo">{m.image_path ? <img src={imageUrl('member-photos', m.image_path)} alt={m.name}/> : <Award size={35}/>}</div>
        <div className="person-info"><span className="eyebrow">{m.exco_positions?.position_name || 'Leadership'}</span><h3>{m.name}</h3><small>{m.class_name}</small></div>
      </Card>)}
    </div> : <Empty title="Leadership profiles coming soon"/>}
  </section>
}

export function Status() {
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('All Classes')
  const [loading, setLoading] = useState(true)
  useEffect(() => { getRows('statuses').then(setRows).catch(console.error).finally(() => setLoading(false)) }, [])
  const visible = rows.filter(r => !r.is_archived && (filter === 'All Classes' || r.class_name === filter || r.class_name === 'All Classes'))
  return <section className="section page-section">
    <PageHeading eyebrow="CHURCH LIFE" title="Church updates" description="Announcements, updates and special moments from our classes."/>
    <div className="filter-row">{classes.map(c => <button key={c} onClick={() => setFilter(c)} className={`filter-chip ${filter === c ? 'active' : ''}`}>{c}</button>)}</div>
    {loading ? <Loading/> : visible.length ? <div className="updates-list">
      {visible.map(r => <Card className="update-card" key={r.id}>
        {r.image_path && <img src={imageUrl('gallery-images', r.image_path)} alt={r.title}/>}
        <div><span className="eyebrow">{r.class_name || 'All Classes'}</span><h3>{r.title}</h3><p>{r.is_new_sunday ? 'New Sunday update' : 'Church announcement'}</p><small>{new Date(r.created_at).toLocaleDateString()}</small></div>
      </Card>)}
    </div> : <Empty title="No updates available"/>}
  </section>
}

export function Throwbacks() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getRows('throwbacks').then(setRows).catch(console.error).finally(() => setLoading(false)) }, [])
  return <section className="section page-section">
    <PageHeading eyebrow="THE GOOD TIMES" title="Throwback gallery" description="A collection of beautiful memories from our Junior Church."/>
    {loading ? <Loading/> : rows.length ? <div className="gallery-grid large">
      {rows.map(r => <div className="photo-card" key={r.id}>
        <img src={imageUrl('gallery-images', r.image_path)} alt={r.description || 'Church memory'}/>
        <div>{r.description || 'A special memory'}</div>
      </div>)}
    </div> : <Empty title="No memories uploaded yet"/>}
  </section>
}
JS

cat > src/pages/Admin.jsx <<'JS'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Images, Newspaper, Award, Plus, Trash2, Upload, LogIn, RefreshCw } from 'lucide-react'
import { getMembers, getRows, getPositions } from '../services/data'
import { adminAction, uploadImage, imageUrl } from '../services/admin'
import { PageHeading, Card, Empty, Loading, Notice } from '../components/UI'

function useRefresh() {
  const [version, setVersion] = useState(0)
  return [version, () => setVersion(v => v + 1)]
}

export function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      await adminAction(password, 'verify_admin')
      onLogin(password)
      navigate('/admin')
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return <section className="login-wrap">
    <Card className="login-card">
      <div className="login-symbol"><LogIn size={27}/></div>
      <span className="eyebrow">ADMINISTRATION</span>
      <h1>Admin sign in</h1>
      <p>Sign in to manage the Junior Church gallery.</p>
      <Notice message={error}/>
      <form onSubmit={submit} className="form-stack">
        <label>Administrator password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" required/>
        <button className="button button-primary full" disabled={busy}>{busy ? 'Checking...' : 'Access admin workspace'}</button>
      </form>
      <div className="security-note"><strong>Secure administrator access</strong><p>This workspace is reserved for authorised administrators.</p></div>
    </Card>
  </section>
}

export function Dashboard() {
  const [stats, setStats] = useState([0, 0, 0, 0])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([getMembers(), getPositions(), getRows('statuses'), getRows('throwbacks')])
      .then(([a,b,c,d]) => setStats([a.length,b.length,c.length,d.length]))
      .catch(console.error).finally(() => setLoading(false))
  }, [])
  const items = [
    ['Total members', stats[0], Users],
    ['Leadership positions filled', stats[1], Award],
    ['Church updates', stats[2], Newspaper],
    ['Throwback photos', stats[3], Images]
  ]
  return <section className="section page-section">
    <PageHeading eyebrow="ADMINISTRATION" title="Dashboard" description="Manage your Junior Church community and gallery."/>
    {loading ? <Loading/> : <div className="stats-grid admin-stats">{items.map(([label,value,Icon]) => <Card key={label}><span className="stat-icon"><Icon/></span><strong>{value}</strong><span>{label}</span></Card>)}</div>}
    <div className="admin-welcome"><h3>Your workspace</h3><p>Use the navigation to manage members, leadership, announcements and gallery memories.</p></div>
  </section>
}

function AdminManager({ type, password }) {
  const [version, refresh] = useRefresh()
  const [rows, setRows] = useState([])
  const [members, setMembers] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [className, setClassName] = useState('Teenagers')
  const [role, setRole] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [file, setFile] = useState(null)

  const table = type === 'members' ? 'members' : type === 'status' ? 'statuses' : type === 'throwbacks' ? 'throwbacks' : 'exco_positions'
  const title = type === 'status' ? 'Church updates' : type === 'exco' ? 'Leadership positions' : type === 'throwbacks' ? 'Throwbacks' : 'Members'

  async function load() {
    setLoading(true)
    try {
      const data = type === 'members' ? await getMembers() : type === 'exco' ? await getPositions() : await getRows(table)
      setRows(data)
      if (type === 'exco') setMembers(await getMembers())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [version, type])

  async function create(e) {
    e.preventDefault()
    setBusy(true); setError(''); setMessage('')
    try {
      if (type === 'members') {
        let path = null
        if (file) path = await uploadImage(password, file, 'member-photos')
        await adminAction(password, 'create_member', { name, class_name: className, role, image_path: path })
      } else if (type === 'exco') {
        await adminAction(password, 'create_position', { position_name: name, display_order: rows.length + 1 })
      } else if (type === 'status') {
        let path = null
        if (file) path = await uploadImage(password, file)
        await adminAction(password, 'create_status', { title: name, class_name: className, is_new_sunday: false, image_path: path })
      } else {
        if (!file) throw new Error('Choose a photo first.')
        const path = await uploadImage(password, file)
        await adminAction(password, 'create_throwback', { description: description || name, image_path: path })
      }
      setName(''); setDescription(''); setRole(''); setFile(null)
      setMessage('Saved successfully.')
      refresh()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  async function remove(id) {
    if (!confirm('Are you sure you want to delete this item?')) return
    setError('')
    try {
      await adminAction(password, 'delete_row', { table, id })
      setMessage('Deleted successfully.')
      refresh()
    } catch (e) { setError(e.message) }
  }

  async function assign(e) {
    e.preventDefault()
    setError('')
    try {
      await adminAction(password, 'assign_member', { member_id: selectedMember, position_id: selectedPosition })
      setMessage('Leadership appointment saved.')
      refresh()
    } catch (e) { setError(e.message) }
  }

  return <section className="section page-section">
    <PageHeading eyebrow="ADMINISTRATION" title={title} description={`Create and manage ${title.toLowerCase()}.`}/>
    <Notice message={error}/>
    <Notice message={message} type="success"/>
    <Card className="manager-card">
      <h3>{type === 'members' ? 'Add a member' : type === 'exco' ? 'Add a position' : type === 'status' ? 'Publish an update' : 'Add a memory'}</h3>
      <form onSubmit={create} className="form-stack">
        {type === 'members' && <>
          <label>Member name</label><input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name"/>
          <label>Class</label><select value={className} onChange={e => setClassName(e.target.value)}><option>Toddlers</option><option>Children</option><option>Pre-teens</option><option>Teenagers</option></select>
          <label>Role (optional)</label><input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Choir"/>
        </>}
        {type === 'exco' && <><label>Position name</label><input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. President"/></>}
        {type === 'status' && <>
          <label>Update title</label><input value={name} onChange={e => setName(e.target.value)} required placeholder="Announcement title"/>
          <label>Class</label><select value={className} onChange={e => setClassName(e.target.value)}><option>All Classes</option><option>Toddlers</option><option>Children</option><option>Pre-teens</option><option>Teenagers</option></select>
        </>}
        {type === 'throwbacks' && <>
          <label>Photo caption</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe this memory"/>
        </>}
        {type !== 'exco' && <>
          <label>{type === 'members' ? 'Member photo' : 'Image (optional for updates)'}</label>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} required={type === 'throwbacks'}/>
        </>}
        <button className="button button-primary" disabled={busy}><Plus size={18}/>{busy ? 'Saving...' : 'Save'}</button>
      </form>
    </Card>

    {type === 'exco' && <Card className="manager-card">
      <h3>Appoint a member</h3>
      <form className="form-stack" onSubmit={assign}>
        <label>Member</label><select required value={selectedMember} onChange={e => setSelectedMember(e.target.value)}><option value="">Choose member</option>{members.map(m => <option value={m.id} key={m.id}>{m.name}</option>)}</select>
        <label>Position</label><select required value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)}><option value="">Choose position</option>{rows.map(p => <option value={p.id} key={p.id}>{p.position_name}</option>)}</select>
        <button className="button button-primary">Assign position</button>
      </form>
    </Card>}

    <div className="list-heading"><h3>Current records</h3><button className="icon-button" onClick={load}><RefreshCw size={18}/></button></div>
    {loading ? <Loading/> : rows.length ? <div className="admin-list">
      {rows.map(r => <div className="admin-row" key={r.id}>
        <div className="admin-row-main">
          {r.image_path && <img src={imageUrl(type === 'members' ? 'member-photos' : 'gallery-images', r.image_path)} alt=""/>}
          <div><strong>{r.name || r.title || r.description || r.position_name}</strong><small>{r.class_name || r.role || r.exco_positions?.position_name || 'Gallery item'}</small></div>
        </div>
        <button className="delete-button" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 size={18}/></button>
      </div>)}
    </div> : <Empty/>}
  </section>
}

export function AdminPage({ password }) {
  const path = window.location.pathname.split('/').filter(Boolean)[1]
  if (!path) return <Dashboard/>
  return <AdminManager type={path} password={password}/>
}
JS

cat > src/App.jsx <<'JS'
import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import { Home, Members, Exco, Status, Throwbacks } from './pages/Public'
import { Login, AdminPage } from './pages/Admin'

export default function App() {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function logout() {
    setPassword('')
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/members" element={<Members/>}/>
            <Route path="/exco" element={<Exco/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/throwbacks" element={<Throwbacks/>}/>
            <Route path="/admin/login" element={<Login onLogin={setPassword}/>}/>
            <Route path="/admin/*" element={password ? <Layout admin logout={logout}><Routes>
              <Route path="/" element={<AdminPage password={password}/>}/>
              <Route path="/members" element={<AdminPage password={password}/>}/>
              <Route path="/exco" element={<AdminPage password={password}/>}/>
              <Route path="/status" element={<AdminPage password={password}/>}/>
              <Route path="/throwbacks" element={<AdminPage password={password}/>}/>
              <Route path="*" element={<Navigate to="/admin" replace/>}/>
            </Routes></Layout> : <Navigate to="/admin/login" replace/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Layout>
      }/>
    </Routes>
  )
}
JS

cat > src/index.css <<'CSS'
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: 'DM Sans', sans-serif;
  color: #20302d;
  background: #f5f8f6;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --primary: #176d68;
  --primary-dark: #105a55;
  --soft: #e4f2ef;
  --muted: #81918b;
  --border: #e9efec;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input, select { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; }
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.topbar { height: 76px; background: white; display: flex; align-items: center; padding: 0 5%; gap: 35px; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 20; }
.brand { display: flex; align-items: center; gap: 11px; flex-shrink: 0; }
.brand-mark { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: var(--soft); color: var(--primary); }
.brand strong, .brand small { display: block; }
.brand strong { font-size: 15px; }
.brand small { color: var(--muted); font-size: 12px; margin-top: 2px; }
.desktop-nav { display: flex; align-items: center; gap: 5px; flex: 1; }
.desktop-nav a { display: flex; align-items: center; gap: 8px; color: #71817b; padding: 11px 13px; border-radius: 12px; font-size: 13px; font-weight: 600; }
.desktop-nav a.active { background: var(--soft); color: var(--primary); }
.top-actions { margin-left: auto; }
.admin-link, .text-button { color: var(--primary); font-size: 14px; font-weight: 700; }
.text-button { display: flex; align-items: center; gap: 7px; border: 0; background: transparent; }
.mobile-menu, .mobile-panel { display: none; }
.main-content { width: 100%; max-width: 1240px; margin: 0 auto; flex: 1; }
.hero { margin: 30px 4% 0; min-height: 390px; border-radius: 28px; background: linear-gradient(115deg,#105a55,#176d68 65%,#287d75); color: white; padding: 62px 7%; display: flex; align-items: center; justify-content: space-between; overflow: hidden; position: relative; }
.hero-copy { max-width: 620px; position: relative; z-index: 1; }
.eyebrow { display: block; color: var(--primary); font-size: 12px; font-weight: 800; letter-spacing: 1.1px; margin-bottom: 12px; }
.eyebrow.light { color: #c4e6df; }
.hero h1 { font-size: clamp(38px,5vw,62px); line-height: 1.08; margin: 0 0 18px; letter-spacing: -2px; }
.hero h1 em { color: #c5e9df; font-style: normal; }
.hero p { max-width: 480px; line-height: 1.8; color: #e0efeb; font-size: 16px; }
.hero-actions { display: flex; align-items: center; gap: 24px; margin-top: 28px; flex-wrap: wrap; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 20px; border: 0; border-radius: 14px; font-weight: 700; min-height: 48px; }
.button-primary { background: var(--primary); color: white; }
.button-primary:hover { background: var(--primary-dark); }
.button-white { background: white; color: var(--primary); }
.button:disabled { opacity: .6; cursor: wait; }
.button.full { width: 100%; }
.hero-secondary { color: white; font-weight: 600; font-size: 14px; }
.hero-decoration { width: 250px; height: 250px; border-radius: 50%; background: #ffffff12; display: grid; place-items: center; margin-right: 6%; }
.hero-circle { width: 160px; height: 160px; border-radius: 50%; display: grid; place-items: center; color: #d6eee8; background: #ffffff14; border: 1px solid #ffffff2c; }
.section { padding: 65px 5%; }
.page-section { min-height: 65vh; }
.section-title { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 28px; }
.section-title h2, .page-heading h1 { margin: 0; font-size: clamp(27px,4vw,38px); letter-spacing: -1px; }
.section-title p, .page-heading p { color: var(--muted); line-height: 1.7; max-width: 460px; margin: 9px 0 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.card { background: white; border-radius: 23px; padding: 25px; border: 1px solid #f0f3f1; }
.stats-grid .card { display: flex; flex-direction: column; align-items: flex-start; gap: 9px; min-height: 170px; }
.stat-icon { width: 48px; height: 48px; border-radius: 15px; display: grid; place-items: center; background: var(--soft); color: var(--primary); }
.stats-grid strong { font-size: 31px; margin-top: 8px; }
.stats-grid .card > span:last-child { color: var(--muted); font-size: 14px; }
.inline-link { color: var(--primary); display: flex; align-items: center; gap: 8px; font-weight: 700; }
.page-heading { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 30px; }
.filter-row { display: flex; gap: 9px; flex-wrap: wrap; margin: 25px 0; }
.filter-chip { border: 1px solid var(--border); border-radius: 30px; padding: 10px 16px; background: white; color: #73817b; font-size: 13px; font-weight: 600; }
.filter-chip.active { background: var(--primary); color: white; border-color: var(--primary); }
.people-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.person-card { padding: 13px; overflow: hidden; }
.person-photo { height: 190px; border-radius: 16px; background: var(--soft); color: var(--primary); display: grid; place-items: center; overflow: hidden; }
.person-photo img { width: 100%; height: 100%; object-fit: cover; }
.person-info { padding: 14px 5px 6px; }
.person-info h3 { margin: 4px 0 6px; font-size: 17px; }
.person-info span:not(.eyebrow), .person-info small { display: block; color: var(--muted); font-size: 13px; margin-top: 5px; }
.person-info .eyebrow { margin-bottom: 5px; }
.gallery-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.gallery-grid.large { grid-template-columns: repeat(3,1fr); }
.photo-card { display: block; background: white; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); }
.photo-card img { width: 100%; height: 230px; object-fit: cover; display: block; background: var(--soft); }
.photo-card div { padding: 15px; font-weight: 600; font-size: 14px; }
.updates-list { display: grid; gap: 14px; }
.update-card { display: flex; align-items: center; gap: 20px; }
.update-card img { width: 115px; height: 105px; border-radius: 14px; object-fit: cover; }
.update-card h3 { margin: 5px 0; }
.update-card p, .update-card small { color: var(--muted); margin: 5px 0; font-size: 13px; }
.loading, .empty-state { min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--muted); text-align: center; }
.empty-state span { width: 52px; height: 52px; display: grid; place-items: center; background: var(--soft); border-radius: 16px; color: var(--primary); }
.empty-state h3 { color: #293b36; margin: 0; }
.empty-state p { margin: 0; font-size: 14px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.footer { display: flex; justify-content: space-between; gap: 15px; padding: 23px 5%; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); background: white; }
.login-wrap { min-height: 75vh; padding: 55px 18px; display: grid; place-items: center; }
.login-card { width: min(100%,480px); padding: 36px; }
.login-symbol { width: 55px; height: 55px; border-radius: 17px; background: var(--soft); color: var(--primary); display: grid; place-items: center; margin-bottom: 24px; }
.login-card h1 { font-size: 34px; margin: 0; }
.login-card > p { color: var(--muted); line-height: 1.7; margin: 10px 0 27px; }
.form-stack { display: flex; flex-direction: column; gap: 11px; }
.form-stack label { font-size: 13px; font-weight: 700; margin-top: 5px; }
.form-stack input, .form-stack select { width: 100%; min-height: 49px; border: 1px solid var(--border); background: #f3f7f5; border-radius: 12px; padding: 12px 14px; outline: none; color: #293b36; }
.form-stack input:focus, .form-stack select:focus { border-color: var(--primary); }
.security-note, .admin-welcome { margin-top: 25px; padding: 20px; border-radius: 16px; background: #f1f6f4; }
.security-note p, .admin-welcome p { color: var(--muted); line-height: 1.6; font-size: 13px; margin-bottom: 0; }
.notice { padding: 12px 15px; border-radius: 12px; margin: 14px 0; font-size: 13px; }
.notice.error { background: #fff0ee; color: #a43f32; }
.notice.success { background: #e8f5ed; color: #23633f; }
.manager-card { max-width: 680px; margin-bottom: 30px; }
.manager-card h3, .admin-welcome h3 { margin: 0 0 18px; }
.admin-stats { grid-template-columns: repeat(2,1fr); }
.admin-stats .card { min-height: 165px; }
.list-heading { display: flex; justify-content: space-between; align-items: center; margin: 30px 0 14px; }
.list-heading h3 { margin: 0; }
.icon-button { width: 42px; height: 42px; border: 0; border-radius: 13px; background: var(--soft); color: var(--primary); display: grid; place-items: center; }
.admin-list { display: grid; gap: 10px; }
.admin-row { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 13px; background: white; border: 1px solid var(--border); border-radius: 15px; }
.admin-row-main { display: flex; align-items: center; gap: 13px; min-width: 0; }
.admin-row-main img { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; }
.admin-row-main strong, .admin-row-main small { display: block; overflow-wrap: anywhere; }
.admin-row-main small { color: var(--muted); margin-top: 5px; font-size: 12px; }
.delete-button { border: 0; background: #fff0ee; color: #b44e43; width: 39px; height: 39px; border-radius: 12px; flex-shrink: 0; }
.admin-welcome { max-width: 700px; }
@media(max-width:900px) {
  .topbar { padding: 0 4%; gap: 15px; }
  .desktop-nav { gap: 0; }
  .desktop-nav a { padding: 10px 8px; font-size: 12px; }
  .desktop-nav a svg { display: none; }
  .people-grid { grid-template-columns: repeat(3,1fr); }
}
@media(max-width:650px) {
  .topbar { height: 70px; padding: 0 18px; gap: 13px; }
  .mobile-menu { display: grid; flex-shrink: 0; }
  .desktop-nav { display: none; }
  .brand { margin-right: auto; }
  .mobile-panel { display: flex; position: fixed; top: 70px; left: 0; right: 0; z-index: 30; flex-direction: column; padding: 12px 18px 18px; background: white; box-shadow: 0 15px 25px #20302d18; }
  .mobile-panel a, .mobile-panel button { display: flex; align-items: center; gap: 13px; padding: 13px; border: 0; background: white; color: #53645e; text-align: left; border-radius: 10px; }
  .mobile-panel a.active { background: var(--soft); color: var(--primary); }
  .hero { margin: 16px 12px 0; padding: 43px 25px; min-height: 360px; border-radius: 22px; }
  .hero-decoration { display: none; }
  .hero h1 { font-size: 43px; letter-spacing: -1.5px; }
  .hero p { font-size: 14px; }
  .hero-actions { gap: 17px; }
  .section { padding: 43px 18px; }
  .section-title, .page-heading { align-items: flex-start; flex-direction: column; }
  .section-title { margin-bottom: 22px; }
  .stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .stats-grid .card { min-height: 145px; }
  .people-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .person-photo { height: 155px; }
  .person-info h3 { font-size: 15px; }
  .gallery-grid, .gallery-grid.large { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .photo-card img { height: 155px; }
  .photo-card div { padding: 11px; font-size: 12px; }
  .filter-row { gap: 7px; }
  .filter-chip { padding: 9px 12px; font-size: 12px; }
  .update-card { align-items: flex-start; padding: 14px; gap: 12px; }
  .update-card img { width: 85px; height: 85px; }
  .login-card { padding: 25px; }
  .login-card h1 { font-size: 29px; }
  .admin-stats { grid-template-columns: 1fr 1fr; }
  .admin-stats .card { padding: 17px; min-height: 150px; }
  .admin-stats strong { font-size: 27px; }
  .footer { padding: 19px; flex-direction: column; }
}
@media(max-width:370px) {
  .people-grid, .gallery-grid, .gallery-grid.large { grid-template-columns: 1fr; }
}
CSS

echo "Installing only required packages..."
npm install
npm prune

echo ""
echo "Project files created."
echo "Next: check your .env file, then run npm run build."
