
import { useState } from "react";
import {
  Images,
  Camera,
  Sparkles,
  CalendarHeart,
  ImageOff,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";
import ImageViewer from "../../components/ImageViewer";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getThrowbacks } from "../../services/throwbackService";
import { getImageUrl } from "../../services/uploadService";

export default function Throwbacks() {
  const { data, loading, error } = useGalleryData(getThrowbacks);

  const [preview, setPreview] = useState(null);

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8 pb-12">
      {/* Page introduction */}
      <PageHeader
        eyebrow="MEMORY LANE"
        title="Throwback gallery"
        description="Special moments, beautiful memories and unforgettable experiences from our Junior Church journey."
        icon={Images}
      />

      {/* Gallery introduction card */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#E4F2EF] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/30" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#CCE9DF]/70" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-xs font-bold text-[#176D68]">
              <Sparkles size={15} />
              OUR JOURNEY TOGETHER
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#20302D] sm:text-3xl">
              Every picture tells a story.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-[#62766D] sm:text-base">
              From special celebrations to everyday moments, explore
              the memories that make our Junior Church special.
            </p>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center self-start rounded-[30px] bg-white text-[#176D68] shadow-sm sm:h-28 sm:w-28 sm:self-center">
            <CalendarHeart size={48} strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Gallery statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-[26px] bg-[#F0F6F2] p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#176D68]">
            <Images size={21} />
          </div>

          <div>
            <p className="text-xs font-medium text-[#81918B]">
              Total memories
            </p>
            <p className="text-2xl font-bold text-[#20302D]">
              {data.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-[26px] bg-[#E7F2ED] p-4 sm:p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#176D68]">
            <Camera size={21} />
          </div>

          <div>
            <p className="text-xs font-medium text-[#81918B]">
              Gallery collection
            </p>
            <p className="text-lg font-bold text-[#20302D]">
              Our moments
            </p>
          </div>
        </div>
      </div>

      {/* Gallery section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#20302D]">
              Moments worth remembering
            </h2>
            <p className="mt-1 text-sm text-[#81918B]">
              Tap any picture to view it.
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68]">
            <Sparkles size={19} />
          </div>
        </div>

        {error ? (
          <EmptyState
            title="Unable to load memories"
            description={error}
          />
        ) : data.length ? (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
          >
            <AnimatePresence mode="popLayout">
              {data.map((item, index) => {
                const image = getImageUrl(
                  "gallery-images",
                  item.image_path
                );

                return (
                  <motion.button
                    layout
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.035, 0.25),
                    }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => image && setPreview(image)}
                    disabled={!image}
                    className="group overflow-hidden rounded-[26px] border border-[#E8EFEB] bg-white text-left shadow-[0_3px_14px_rgba(32,48,45,0.035)] transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(32,48,45,0.09)] disabled:cursor-not-allowed"
                  >
                    {/* Image container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#E7F2ED]">
                      {image ? (
                        <img
                          src={image}
                          alt={item.description || "Church memory"}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#81918B]">
                          <ImageOff size={28} />
                          <span className="text-xs font-medium">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Image overlay */}
                      {image && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#102C27]/0 transition-colors duration-300 group-hover:bg-[#102C27]/20">
                          <div className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/95 text-[#176D68] opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <ArrowUpRight size={21} />
                          </div>
                        </div>
                      )}

                      {/* Gallery number */}
                      <div className="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 px-2 text-[11px] font-bold text-[#176D68] shadow-sm backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="flex min-h-[76px] items-center justify-between gap-2 p-3 sm:p-4">
                      <p className="line-clamp-2 text-xs font-semibold leading-5 text-[#40554C] sm:text-sm">
                        {item.description || "A special memory"}
                      </p>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68]">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="No memories uploaded yet"
            description="Beautiful moments from our Junior Church will appear here."
          />
        )}
      </section>

      {/* Image preview */}
      <ImageViewer
        src={preview}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
