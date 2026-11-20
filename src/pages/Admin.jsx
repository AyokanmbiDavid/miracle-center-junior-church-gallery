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
