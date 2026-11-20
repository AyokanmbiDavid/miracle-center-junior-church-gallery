import { Link } from "react-router-dom";
import {
  Users,
  Award,
  Images,
  ArrowUpRight,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import { useGalleryData } from "../../hooks/useGalleryData";

import { getMembers } from "../../services/memberService";
import { getPositions } from "../../services/excoService";
import { getThrowbacks } from "../../services/throwbackService";

export default function Home() {
  const members = useGalleryData(getMembers);
  const positions = useGalleryData(getPositions);
  const throwbacks = useGalleryData(getThrowbacks);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            WELCOME TO OUR COMMUNITY
          </span>

          <h1>
            Every child.
            <br />
            <span>Every memory.</span>
          </h1>

          <p>
            Celebrating the people, milestones and moments
            that make our Junior Church special.
          </p>

          <div className="hero-actions">
            <Link to="/members" className="btn btn-white">
              Meet our members
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/throwbacks" className="hero-link">
              Explore memories
            </Link>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-circle">
            <span>GROW</span>
            <strong>TOGETHER</strong>
            <small>IN FAITH</small>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="OUR COMMUNITY"
        title="A place to belong"
        description="Explore our people, leadership and shared memories."
      />

      <div className="stats-grid">
        <Stat
          icon={Users}
          number={members.data.length}
          label="Members"
        />

        <Stat
          icon={Award}
          number={positions.data.length}
          label="Leadership positions"
        />

        <Stat
          icon={Images}
          number={throwbacks.data.length}
          label="Memories"
        />
      </div>

      <div className="feature-grid">
        <Feature
          to="/members"
          title="Our members"
          description="Meet the children across our classes."
          icon={Users}
        />

        <Feature
          to="/exco"
          title="Our leadership"
          description="Discover the people serving our church."
          icon={Award}
        />

        <Feature
          to="/throwbacks"
          title="Our memories"
          description="Look back at special moments."
          icon={Images}
        />
      </div>
    </>
  );
}

function Stat({ icon: Icon, number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <strong>{number}</strong>
      <span>{label}</span>
    </div>
  );
}

function Feature({ to, title, description, icon: Icon }) {
  return (
    <Link to={to} className="feature-card">
      <div className="feature-icon">
        <Icon size={22} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <ArrowUpRight className="feature-arrow" size={18} />
    </Link>
  );
}