
import { useMemo, useState } from "react";
import { Search, Download, ImageOff } from "lucide-react";
import { motion } from "framer-motion";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getMembers } from "../../services/memberService";
import { getImageUrl } from "../../services/uploadService";

const classes = [
  "All Classes",
  "Toddlers",
  "Children",
  "Pre-teens",
  "Teenagers",
];

async function downloadImage(url, name) {
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = `${name.replace(/[^a-z0-9]/gi, "_")}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function General() {
  const { data, loading, error } = useGalleryData(getMembers);

  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((member) => {
      const matchesClass =
        selectedClass === "All Classes" ||
        member.class_name === selectedClass;

      const matchesSearch = member.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [data, selectedClass, search]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <PageHeader
        eyebrow="OUR PEOPLE"
        title="Members registry"
        description="Get to know the members of our Junior Church."
      />

      <div className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
          />
        </label>

        <div className="filter-list">
          {classes.map((name) => (
            <button
              key={name}
              className={
                selectedClass === name
                  ? "filter-chip selected"
                  : "filter-chip"
              }
              onClick={() => setSelectedClass(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <EmptyState title="Unable to load members" description={error} />
      ) : filtered.length ? (
        <div className="members-grid">
          {filtered.map((member, index) => {
            const image = getImageUrl(
              "member-photos",
              member.image_path
            );

            return (
              <motion.article
                key={member.id}
                className="member-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.035, 0.3) }}
                whileHover={{ y: -4 }}
              >
                <div className="member-avatar">
                  {image ? (
                    <img
                      src={image}
                      alt={member.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="member-no-image">
                      <ImageOff size={28} />
                      <span>No photo</span>
                    </div>
                  )}
                </div>

                <div className="member-info">
                  <div className="member-info-main">
                    <h3>{member.name}</h3>
                    <span>{member.class_name}</span>
                    {member.role && <small>{member.role}</small>}
                  </div>

                  {member.exco_positions?.position_name && (
                    <span className="member-badge">
                      {member.exco_positions.position_name}
                    </span>
                  )}

                  <button
                    className="member-download-btn"
                    disabled={!image}
                    onClick={() => downloadImage(image, member.name)}
                  >
                    <Download size={16} />
                    Download photo
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No members found"
          description="Try another class or search."
        />
      )}
    </>
  );
}
