
import { useMemo, useState } from "react";
import {
  Search,
  Download,
  ImageOff,
  Users,
  X,
  SlidersHorizontal,
  Crown,
  Sparkles,
  UserRound,
  ArrowUpRight,
  Heart,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";
import ImageViewer from "../../components/ImageViewer";

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

const classThemes = {
  Toddlers: {
    background: "bg-[#FCEDE9]",
    text: "text-[#A64F3D]",
    icon: "bg-[#F8DCD4]",
  },
  Children: {
    background: "bg-[#FFF2D9]",
    text: "text-[#93631D]",
    icon: "bg-[#F9E5BB]",
  },
  "Pre-teens": {
    background: "bg-[#EDE9FA]",
    text: "text-[#6552A0]",
    icon: "bg-[#DDD5F5]",
  },
  Teenagers: {
    background: "bg-[#DFF1E9]",
    text: "text-[#176D68]",
    icon: "bg-[#C8E7D9]",
  },
};

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

function OverviewCard({ icon: Icon, label, value, description, theme, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className={`relative isolate overflow-hidden rounded-[30px] p-5 sm:p-6 ${theme}`}
    >
      <div className="absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full border-[18px] border-white/30" />
      <div className="absolute -bottom-10 right-12 -z-10 h-20 w-20 rounded-full bg-white/20" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/75 shadow-sm">
          <Icon size={23} className="text-[#176D68]" />
        </div>

        <ArrowUpRight size={19} className="text-[#53675F]/60" />
      </div>

      <div className="mt-7">
        <p className="text-sm font-semibold text-[#53675F]">
          {label}
        </p>

        <p className="mt-1 font-['Plus_Jakarta_Sans'] text-3xl font-extrabold tracking-tight text-[#20302D]">
          {value}
        </p>

        <p className="mt-1 text-xs font-medium text-[#71847B]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function MemberCard({ member, index, onPreview, onDownload }) {
  const image = getImageUrl("member-photos", member.image_path);
  const position = member.exco_positions?.position_name;
  const theme = classThemes[member.class_name] || {
    background: "bg-[#F0F6F2]",
    text: "text-[#176D68]",
    icon: "bg-[#E4F2EF]",
  };

  return (
    <motion.article
      layout
      key={member.id}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{
        duration: 0.38,
        delay: Math.min(index * 0.045, 0.3),
      }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[32px] border border-[#E8EFEB] bg-white shadow-[0_5px_22px_rgba(32,48,45,0.035)] transition-shadow duration-300 hover:shadow-[0_18px_42px_rgba(32,48,45,0.10)]"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E7F2ED]">
        {image ? (
          <button
            type="button"
            onClick={() => onPreview(image)}
            className="block h-full w-full cursor-zoom-in"
            aria-label={`View ${member.name}'s photo`}
          >
            <img
              src={image}
              alt={member.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#142D29]/35 via-transparent to-transparent opacity-70" />

            <div className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/90 text-[#176D68] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Camera size={18} />
            </div>
          </button>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#81918B]">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white shadow-sm">
              <ImageOff size={30} />
            </div>
            <span className="text-sm font-semibold">
              Photo unavailable
            </span>
          </div>
        )}

        {/* Class indicator */}
        <div className="absolute left-4 top-4">
          <span className={`rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold shadow-sm backdrop-blur-md ${theme.text}`}>
            {member.class_name}
          </span>
        </div>

        {/* Leadership indicator */}
        {position && (
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-[#FFF1CE] text-[#93631D] shadow-sm">
            <Crown size={18} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-['Plus_Jakarta_Sans'] text-lg font-extrabold tracking-tight text-[#20302D]">
              {member.name}
            </h3>

            <p className="mt-1 truncate text-sm font-medium text-[#81918B]">
              {member.role || "Junior Church Member"}
            </p>
          </div>

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] ${theme.icon} ${theme.text}`}>
            <UserRound size={19} />
          </div>
        </div>

        <div className={`mt-5 flex items-center gap-2 rounded-[18px] px-3.5 py-3 ${position ? "bg-[#FFF7E7]" : "bg-[#F0F6F2]"}`}>
          {position ? (
            <>
              <Crown size={16} className="shrink-0 text-[#A47A2B]" />
              <span className="truncate text-xs font-bold text-[#8D6B2A]">
                {position}
              </span>
            </>
          ) : (
            <>
              <Heart size={16} className="shrink-0 text-[#71847B]" />
              <span className="text-xs font-semibold text-[#71847B]">
                Part of our family
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          disabled={!image}
          onClick={() => onDownload(image, member.name)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#E4F2EF] px-4 py-3.5 text-sm font-bold text-[#176D68] transition-all duration-200 hover:bg-[#CCE9DF] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={17} />
          Download photo
        </button>
      </div>
    </motion.article>
  );
}

export default function General() {
  const { data, loading, error } = useGalleryData(getMembers);

  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((member) => {
      const matchesClass =
        selectedClass === "All Classes" ||
        member.class_name === selectedClass;

      const matchesSearch =
        member.name?.toLowerCase().includes(query) ||
        member.role?.toLowerCase().includes(query) ||
        member.exco_positions?.position_name?.toLowerCase().includes(query);

      return matchesClass && matchesSearch;
    });
  }, [data, selectedClass, search]);

  const classCounts = useMemo(() => {
    return data.reduce((counts, member) => {
      counts[member.class_name] = (counts[member.class_name] || 0) + 1;
      return counts;
    }, {});
  }, [data]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-9 pb-14">
      <PageHeader
        eyebrow="OUR PEOPLE"
        title="Members registry"
        description="Every name represents a story, a growing heart, and a valued part of our Junior Church family."
        icon={Users}
      />

      {/* Expressive overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <OverviewCard
          icon={Users}
          label="Our community"
          value={data.length}
          description="Registered members"
          theme="bg-[#E4F2EF]"
          delay={0.05}
        />

        <OverviewCard
          icon={UserRound}
          label="Growing together"
          value={4}
          description="Junior Church classes"
          theme="bg-[#F0F1FA]"
          delay={0.12}
        />

        <OverviewCard
          icon={Sparkles}
          label="Current results"
          value={filtered.length}
          description="Members matching your view"
          theme="bg-[#FFF2DC]"
          delay={0.19}
        />
      </section>

      {/* Class overview */}
      <section className="overflow-hidden rounded-[34px] bg-[#203D37] p-5 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#B7DDD0]">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-[0.16em]">
                Our growing family
              </span>
            </div>

            <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight sm:text-3xl">
              Four classes. One family.
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65">
              Discover the different stages of growth and fellowship in our Junior Church.
            </p>
          </div>

          <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-white/10 sm:flex">
            <Users size={36} className="text-[#B7DDD0]" />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {classes.slice(1).map((name, index) => {
            const colors = [
              "bg-[#F8DFD7] text-[#94503F]",
              "bg-[#F9E9C9] text-[#8D641F]",
              "bg-[#E6DFFA] text-[#64529A]",
              "bg-[#CDEADF] text-[#176D68]",
            ];

            return (
              <motion.button
                key={name}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedClass(name)}
                className={`rounded-[22px] p-4 text-left transition-all ${colors[index]} ${
                  selectedClass === name ? "ring-2 ring-white ring-offset-2 ring-offset-[#203D37]" : ""
                }`}
              >
                <p className="text-xs font-bold opacity-75">
                  {name}
                </p>
                <p className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold">
                  {classCounts[name] || 0}
                </p>
                <p className="mt-1 text-[11px] font-semibold opacity-70">
                  {classCounts[name] === 1 ? "Member" : "Members"}
                </p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Search and filters */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#176D68]">
              Member directory
            </span>

            <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-[#20302D] sm:text-3xl">
              Find your people.
            </h2>

            <p className="mt-2 text-sm text-[#81918B]">
              Search names, roles, or browse by class.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={19}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#81918B]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the directory..."
              className="h-14 w-full rounded-full border border-[#E5ECE8] bg-white py-3 pl-13 pr-12 text-sm font-medium text-[#20302D] shadow-[0_4px_18px_rgba(32,48,45,0.035)] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#176D68] focus:ring-4 focus:ring-[#176D68]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#81918B] transition hover:bg-[#F0F6F2]"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[26px] bg-[#F0F6F2] p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2 px-2 text-[#71847B]">
            <SlidersHorizontal size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Filter by class
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {classes.map((name) => {
              const active = selectedClass === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedClass(name)}
                  className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-[#176D68] text-white shadow-[0_4px_12px_rgba(23,109,104,0.22)]"
                      : "bg-white text-[#53675F] hover:bg-[#E4F2EF]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#20302D]">
              {selectedClass === "All Classes" ? "Everyone" : selectedClass}
            </h2>

            <p className="mt-1 text-sm text-[#81918B]">
              {filtered.length} {filtered.length === 1 ? "member" : "members"} found
            </p>
          </div>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="flex max-w-full items-center gap-2 rounded-full bg-[#E4F2EF] px-4 py-2.5 text-xs font-bold text-[#176D68]"
            >
              <Search size={14} />
              <span className="max-w-36 truncate">{search}</span>
              <X size={14} />
            </button>
          )}
        </div>

        {error ? (
          <EmptyState
            title="Unable to load members"
            description={error}
          />
        ) : filtered.length ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  onPreview={setPreview}
                  onDownload={downloadImage}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="No members found"
            description="Try another class or change your search."
          />
        )}
      </section>

      {/* Image viewer */}
      <ImageViewer
        src={preview}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
