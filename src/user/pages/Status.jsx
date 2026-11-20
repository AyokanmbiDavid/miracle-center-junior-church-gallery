
import { useState } from "react";
import { Download, ImageOff } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getStatuses } from "../../services/statusService";
import { getImageUrl } from "../../services/uploadService";

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

export default function Status() {
  const { data, loading, error } = useGalleryData(
    () => getStatuses(false),
    []
  );

  const [filter, setFilter] = useState("All Classes");

  const filtered = data.filter(
    (item) =>
      filter === "All Classes" ||
      item.class_name === filter ||
      item.class_name === "All Classes"
  );

  if (loading) return <LoadingScreen />;

  return (
    <>
      <PageHeader
        eyebrow="LATEST UPDATES"
        title="Status updates"
        description="Announcements and moments from our classes."
      />

      <div className="filter-list">
        {[
          "All Classes",
          "Toddlers",
          "Children",
          "Pre-teens",
          "Teenagers",
        ].map((name) => (
          <button
            key={name}
            className={
              filter === name
                ? "filter-chip selected"
                : "filter-chip"
            }
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {error ? (
        <EmptyState title="Unable to load updates" description={error} />
      ) : filtered.length ? (
        <div className="status-grid">
          {filtered.map((item) => {
            const image = getImageUrl(
              "gallery-images",
              item.image_path
            );

            return (
              <article className="status-card" key={item.id}>
                <div className="status-card-image">
                  {image ? (
                    <img src={image} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="member-no-image">
                      <ImageOff size={28} />
                      <span>No image</span>
                    </div>
                  )}
                </div>

                <div className="status-content">
                  <span className="eyebrow">{item.class_name}</span>
                  <h3>{item.title}</h3>

                  <small>
                    {new Date(item.created_at).toLocaleDateString()}
                  </small>

                  {item.is_new_sunday && (
                    <span className="member-badge">
                      Sunday highlight
                    </span>
                  )}

                  <button
                    className="member-download-btn"
                    disabled={!image}
                    onClick={() => downloadImage(image, item.title)}
                  >
                    <Download size={16} />
                    Download image
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No updates available" />
      )}
    </>
  );
}
