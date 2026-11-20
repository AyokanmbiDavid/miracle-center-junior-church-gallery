import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getPositions } from "../../services/excoService";
import { getMembers } from "../../services/memberService";
import { getImageUrl } from "../../services/uploadService";

export default function Exco() {
  const positions = useGalleryData(getPositions);
  const members = useGalleryData(getMembers);

  if (positions.loading || members.loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PageHeader
        eyebrow="SERVING OUR COMMUNITY"
        title="Our leadership"
        description="Meet the people serving in leadership positions."
      />

      {positions.data.length ? (
        <div className="exco-grid">
          {positions.data.map((position) => {
            const holder = members.data.find(
              (member) =>
                member.exco_position_id === position.id
            );

            const image = holder?.image_path
              ? getImageUrl("member-photos", holder.image_path)
              : null;

            return (
              <article
                className="exco-card"
                key={position.id}
              >
                <div className="exco-symbol">✦</div>

                <span className="eyebrow">
                  LEADERSHIP POSITION
                </span>

                <h3>{position.position_name}</h3>

                {holder ? (
                  <div className="exco-holder">
                    <div className="member-avatar">
                      {image ? (
                        <img src={image} alt={holder.name} />
                      ) : (
                        holder.name[0]
                      )}
                    </div>

                    <div>
                      <strong>{holder.name}</strong>
                      <small>{holder.class_name}</small>
                    </div>
                  </div>
                ) : (
                  <p className="muted">Position vacant</p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No leadership positions available" />
      )}
    </>
  );
}