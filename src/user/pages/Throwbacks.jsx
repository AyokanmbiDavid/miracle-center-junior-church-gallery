import { useState } from "react";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";
import ImageViewer from "../../components/ImageViewer";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getThrowbacks } from "../../services/throwbackService";
import { getImageUrl } from "../../services/uploadService";

export default function Throwbacks() {
  const { data, loading, error } =
    useGalleryData(getThrowbacks);

  const [preview, setPreview] = useState(null);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <PageHeader
        eyebrow="MEMORY LANE"
        title="Throwback gallery"
        description="Special moments from our Junior Church journey."
      />

      {error ? (
        <EmptyState
          title="Unable to load memories"
          description={error}
        />
      ) : data.length ? (
        <div className="throwback-grid">
          {data.map((item) => {
            const image = getImageUrl(
              "gallery-images",
              item.image_path
            );

            return (
              <button
                className="throwback-item"
                key={item.id}
                onClick={() => setPreview(image)}
              >
                <img
                  src={image}
                  alt={item.description || "Church memory"}
                />

                <span>
                  {item.description || "A special memory"}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No memories uploaded yet" />
      )}

      <ImageViewer
        src={preview}
        onClose={() => setPreview(null)}
      />
    </>
  );
}