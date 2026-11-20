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
