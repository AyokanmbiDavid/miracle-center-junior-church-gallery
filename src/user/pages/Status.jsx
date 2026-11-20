
import { useMemo, useState } from "react";
import {
  Download,
  ImageOff,
  CalendarDays,
  Sparkles,
  Newspaper,
  Filter,
  Clock3,
  ArrowUpRight,
  ChevronRight,
  Layers3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getStatuses } from "../../services/statusService";
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

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Status() {
  const { data, loading, error } = useGalleryData(
    () => getStatuses(false),
    []
  );

  const [filter, setFilter] = useState("All Classes");

  const filtered = useMemo(() => {
    return data.filter(
      (item) =>
        filter === "All Classes" ||
        item.class_name === filter ||
        item.class_name === "All Classes"
    );
  }, [data, filter]);

  const highlights = data.filter((item) => item.is_new_sunday);

  const latestUpdate = data[0];

  if (loading) return <LoadingScreen message="Gathering the latest church updates..." />;

  return (
    <div className="space-y-10 pb-16">

      {/* Page heading */}
      <PageHeader
        eyebrow="THE LATEST FROM OUR CHURCH"
        title="What's happening?"
        description="Stay connected with announcements, Sunday moments and everything happening across our Junior Church."
        icon={Newspaper}
      />

      {/* Expressive overview */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">

        {/* Main feature */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden rounded-[36px] bg-[#176D68] p-7 text-white sm:p-9 lg:col-span-7 lg:min-h-[245px]"
        >
          <div className="absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full border-[35px] border-white/[0.07]" />
          <div className="absolute -bottom-28 right-24 -z-10 h-64 w-64 rounded-full bg-[#5EE0B8]/10 blur-2xl" />

          <div className="flex h-full flex-col justify-between gap-8">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Sparkles size={17} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                Community updates
              </span>
            </div>

            <div>
              <h2 className="max-w-lg text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl">
                Every moment has a story.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                Discover what's new, celebrate our Sunday highlights and stay part of the family.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#D4F8E9]">
              <span>Explore the latest</span>
              <ArrowUpRight size={17} />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:grid-cols-1">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col justify-between rounded-[32px] bg-[#E4F2EF] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#176D68]">
                <Newspaper size={21} />
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176D68]">
                Published
              </span>
            </div>

            <div className="mt-7">
              <p className="text-4xl font-extrabold tracking-tight text-[#20302D]">
                {data.length}
              </p>
              <p className="mt-1 text-sm font-medium text-[#71847B]">
                Total updates
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="flex flex-col justify-between rounded-[32px] bg-[#FFF2D9] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#A47727]">
                <Sparkles size={21} />
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#98702B]">
                Special
              </span>
            </div>

            <div className="mt-7">
              <p className="text-4xl font-extrabold tracking-tight text-[#49391D]">
                {highlights.length}
              </p>
              <p className="mt-1 text-sm font-medium text-[#927B53]">
                Sunday highlights
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest update strip */}
      {latestUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 rounded-[28px] border border-[#E8EFEB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E4F2EF] text-[#176D68]">
              <Clock3 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#81918B]">
                Latest published update
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#20302D]">
                {latestUpdate.title || "Untitled update"}
              </p>
            </div>
          </div>

          <span className="shrink-0 pl-14 text-xs font-medium text-[#81918B] sm:pl-0">
            {formatDate(latestUpdate.created_at)}
          </span>
        </motion.div>
      )}

      {/* Explore section */}
      <section className="space-y-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#176D68]">
              <Layers3 size={17} />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.17em]">
                Your community
              </span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-[#20302D] sm:text-3xl">
              Explore updates
            </h2>

            <p className="mt-2 text-sm text-[#81918B]">
              Find moments and announcements from every class.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-[#F0F6F2] px-4 py-2.5 text-xs font-bold text-[#53675F]">
            <CalendarDays size={15} />
            <span>{filtered.length} results</span>
          </div>
        </div>

        {/* Expressive filter control */}
        <div className="rounded-[28px] bg-[#F0F6F2] p-2">
          <div className="mb-2 flex items-center gap-2 px-3 pt-2 text-[#71847B]">
            <Filter size={15} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
              Filter by class
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
            {classes.map((name) => {
              const active = filter === name;

              return (
                <motion.button
                  key={name}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(name)}
                  className={`relative shrink-0 overflow-hidden rounded-full px-5 py-3 text-sm font-bold transition-colors duration-200 ${
                    active
                      ? "bg-[#176D68] text-white shadow-[0_3px_10px_rgba(23,109,104,0.18)]"
                      : "bg-white/70 text-[#53675F] hover:bg-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="status-filter-indicator"
                      className="absolute inset-0 -z-0 rounded-full bg-[#176D68]"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="space-y-5">

        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#20302D]">
              {filter === "All Classes" ? "All updates" : filter}
            </h3>
            <p className="mt-1 text-xs text-[#81918B]">
              {filtered.length} {filtered.length === 1 ? "story" : "stories"} to explore
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68]">
            <Newspaper size={18} />
          </div>
        </div>

        {error ? (
          <EmptyState
            title="Unable to load updates"
            description={error}
          />
        ) : filtered.length ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, index) => {
                const image = getImageUrl(
                  "gallery-images",
                  item.image_path
                );

                const formattedDate = formatDate(item.created_at);

                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      delay: Math.min(index * 0.045, 0.2),
                    }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-[32px] bg-white shadow-[0_2px_12px_rgba(32,48,45,0.045)] ring-1 ring-[#E8EFEB] transition-shadow duration-300 hover:shadow-[0_14px_35px_rgba(32,48,45,0.10)]"
                  >

                    {/* Image area */}
                    <div className="relative aspect-[5/4] overflow-hidden bg-[#E4F2EF]">

                      {image ? (
                        <img
                          src={image}
                          alt={item.title || "Church update"}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-[#81918B]">
                          <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white shadow-sm">
                            <ImageOff size={27} />
                          </div>
                          <span className="text-xs font-semibold">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* Image overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#10221F]/55 to-transparent" />

                      {/* Class label */}
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full border border-white/60 bg-white/90 px-4 py-2 text-[11px] font-extrabold text-[#176D68] shadow-sm backdrop-blur-xl">
                          {item.class_name}
                        </span>
                      </div>

                      {/* Highlight */}
                      {item.is_new_sunday && (
                        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#FFF2D9] px-3.5 py-2 text-[11px] font-extrabold text-[#8D6725] shadow-sm">
                          <Sparkles size={13} />
                          Highlight
                        </div>
                      )}

                      {/* Date over image */}
                      <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
                        <CalendarDays size={14} />
                        <span className="text-xs font-semibold">
                          {formattedDate}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-5 p-5 sm:p-6">

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          {item.is_new_sunday && (
                            <span className="h-2 w-2 rounded-full bg-[#D7A43E]" />
                          )}
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#81918B]">
                            {item.is_new_sunday ? "Sunday moment" : "Church update"}
                          </span>
                        </div>

                        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-[#20302D]">
                          {item.title || "Untitled update"}
                        </h3>
                      </div>

                      {item.is_new_sunday ? (
                        <div className="flex items-center gap-3 rounded-[20px] bg-[#FFF8E9] px-4 py-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBEBC8] text-[#A47727]">
                            <Sparkles size={17} />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[#76551F]">
                              Sunday highlight
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium text-[#9A7C4B]">
                              A special moment from our church
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-[20px] bg-[#F0F6F2] px-4 py-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68]">
                            <Newspaper size={16} />
                          </div>
                          <span className="text-xs font-semibold text-[#53675F]">
                            From our Junior Church community
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={!image}
                        onClick={() =>
                          downloadImage(
                            image,
                            item.title || "church-update"
                          )
                        }
                        className="flex w-full items-center justify-between rounded-full bg-[#E4F2EF] px-5 py-3.5 text-sm font-extrabold text-[#176D68] transition-all duration-200 hover:bg-[#CCE9DF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="flex items-center gap-2">
                          <Download size={17} />
                          Download image
                        </span>
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="No updates here yet"
            description="There are no updates for this class at the moment. Try exploring another class."
          />
        )}
      </section>

      {/* Closing section */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#E4F2EF] p-6 sm:p-8">
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#176D68]/[0.06]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-white text-[#176D68]">
              <Sparkles size={25} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-[#20302D]">
                Every moment matters.
              </h3>
              <p className="mt-1 text-sm text-[#71847B]">
                Stay connected with our growing church family.
              </p>
            </div>
          </div>

          <span className="flex items-center gap-2 text-xs font-extrabold text-[#176D68]">
            Growing together in faith
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
}
