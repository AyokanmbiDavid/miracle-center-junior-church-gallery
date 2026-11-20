
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Users,
  Award,
  Images,
  ArrowUpRight,
  Sparkles,
  Heart,
  Church,
  ChevronRight,
  Star,
  BookOpen,
  CalendarDays,
  MoveUpRight,
  Flower2,
  Sun,
  HandHeart,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import { useGalleryData } from "../../hooks/useGalleryData";

import { getMembers } from "../../services/memberService";
import { getPositions } from "../../services/excoService";
import { getThrowbacks } from "../../services/throwbackService";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
    },
  },
};

function StatCard({
  icon: Icon,
  number,
  label,
  caption,
  loading,
  tone,
  index,
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative isolate min-h-[205px] overflow-hidden rounded-[30px] p-5 sm:p-6 ${tone}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 -z-10 size-36 rounded-full bg-white/35" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 -z-10 size-32 rounded-full border-[22px] border-white/20" />

      <div className="flex items-start justify-between">
        <div className="grid size-12 place-items-center rounded-[19px] bg-white/75 shadow-sm">
          <Icon size={23} strokeWidth={1.8} />
        </div>

        <span className="grid size-9 place-items-center rounded-full bg-white/50">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="mt-7">
        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[38px] font-extrabold leading-none tracking-[-2px]">
          {loading ? "—" : number}
        </p>

        <p className="mt-2 text-sm font-extrabold">
          {label}
        </p>

        <p className="mt-1 text-[11px] font-medium opacity-65">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}

const features = [
  {
    to: "/members",
    icon: Users,
    number: "01",
    label: "OUR PEOPLE",
    title: "The people who make us family.",
    description:
      "Meet the wonderful children and young people growing together across our church.",
    action: "Meet our members",
    background: "bg-[#E1F1E9]",
    iconBackground: "bg-[#C4E5D5]",
    color: "text-[#176D68]",
    decoration: "bg-[#B4DDC9]",
  },
  {
    to: "/exco",
    icon: Award,
    number: "02",
    label: "OUR LEADERSHIP",
    title: "Hearts that lead through service.",
    description:
      "Discover the people helping our Junior Church grow, flourish and move forward.",
    action: "Meet our leaders",
    background: "bg-[#F8EBD5]",
    iconBackground: "bg-[#F0D9B0]",
    color: "text-[#94652E]",
    decoration: "bg-[#EBCF9C]",
  },
  {
    to: "/throwbacks",
    icon: Images,
    number: "03",
    label: "OUR MEMORIES",
    title: "Beautiful moments, forever remembered.",
    description:
      "Revisit special experiences, celebrations and unforgettable church moments.",
    action: "Explore memories",
    background: "bg-[#EAE7F7]",
    iconBackground: "bg-[#D6D0EF]",
    color: "text-[#685C9E]",
    decoration: "bg-[#CCC3EA]",
  },
];

export default function Home() {
  const members = useGalleryData(getMembers);
  const positions = useGalleryData(getPositions);
  const throwbacks = useGalleryData(getThrowbacks);

  const stats = [
    {
      icon: Users,
      number: members.data?.length ?? 0,
      label: "Church members",
      caption: "Our growing family",
      tone: "bg-[#DDF0E6] text-[#176D68]",
      loading: members.loading,
    },
    {
      icon: Award,
      number: positions.data?.length ?? 0,
      label: "Leadership roles",
      caption: "Serving with purpose",
      tone: "bg-[#F8EBD5] text-[#94652E]",
      loading: positions.loading,
    },
    {
      icon: Images,
      number: throwbacks.data?.length ?? 0,
      label: "Shared memories",
      caption: "Moments to remember",
      tone: "bg-[#EAE7F7] text-[#685C9E]",
      loading: throwbacks.loading,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-12 pb-12">

      {/* ==========================================
          EXPRESSIVE WELCOME HERO
      ========================================== */}

      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative isolate overflow-hidden rounded-[36px] bg-[#176D68] text-white shadow-[0_18px_55px_rgba(23,109,104,0.13)] sm:rounded-[44px]"
      >
        {/* Background geometry */}
        <div className="pointer-events-none absolute -right-32 -top-36 -z-10 size-[430px] rounded-full border-[55px] border-white/[0.055]" />

        <div className="pointer-events-none absolute -right-10 top-24 -z-10 size-[280px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -bottom-40 left-[25%] -z-10 size-[350px] rounded-full bg-[#9FE4C5]/15 blur-[85px]" />

        <div className="relative grid min-h-[490px] items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-14">

          {/* Hero content */}
          <div className="relative z-10 max-w-[650px]">

            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#D9F4E7] backdrop-blur-md">
                <Sparkles size={14} />
                Welcome to our community
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-8 font-['Plus_Jakarta_Sans',sans-serif] text-[43px] font-extrabold leading-[1.04] tracking-[-2.8px] sm:text-[60px] lg:text-[72px]"
            >
              Every child.
              <br />
              <span className="text-[#BDEBD5]">
                Every memory.
              </span>
              <br />
              <span className="text-white/95">
                One family.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[470px] text-[13px] leading-[1.9] text-white/75 sm:text-[15px]"
            >
              Celebrating the people, milestones and beautiful moments that make our Junior Church a place to belong, grow and flourish.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/members"
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-[#D8F2E4] px-6 py-3.5 text-[12px] font-extrabold text-[#155F54] shadow-[0_7px_22px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-white active:scale-95"
              >
                Meet our members
                <span className="grid size-7 place-items-center rounded-full bg-[#176D68] text-white transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={15} />
                </span>
              </Link>

              <Link
                to="/throwbacks"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-6 py-3.5 text-[12px] font-bold text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-95"
              >
                Explore memories
                <ChevronRight size={17} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  "bg-[#F5D9AC]",
                  "bg-[#C9E7D7]",
                  "bg-[#DAD4F2]",
                  "bg-[#F1C9C4]",
                ].map((color, index) => (
                  <span
                    key={index}
                    className={`grid size-8 place-items-center rounded-full border-2 border-[#176D68] ${color}`}
                  >
                    {index === 0 ? (
                      <Heart size={13} className="text-[#94652E]" />
                    ) : index === 1 ? (
                      <Star size={13} className="text-[#176D68]" />
                    ) : index === 2 ? (
                      <Sparkles size={13} className="text-[#685C9E]" />
                    ) : (
                      <Sun size={13} className="text-[#A75D51]" />
                    )}
                  </span>
                ))}
              </div>

              <p className="text-[10px] font-semibold tracking-wide text-white/65">
                A family built on faith, love and togetherness.
              </p>
            </motion.div>
          </div>

          {/* Hero illustration */}
          <motion.div
            variants={fadeUp}
            className="relative mx-auto flex min-h-[300px] w-full max-w-[370px] items-center justify-center lg:min-h-[390px]"
          >
            {/* Orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 42,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute size-[280px] rounded-full border border-dashed border-white/25 sm:size-[330px]"
            />

            <div className="absolute size-[245px] rounded-full border border-white/15 bg-white/[0.045] sm:size-[290px]" />

            <div className="absolute size-[205px] rounded-full border border-white/10 sm:size-[245px]" />

            {/* Main centerpiece */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 flex size-[185px] flex-col items-center justify-center rounded-[48px] bg-[#D9EFE2] text-[#176D68] shadow-[0_25px_65px_rgba(0,0,0,0.2)] rotate-[-5deg] sm:size-[215px] sm:rounded-[58px]"
            >
              <div className="grid size-16 place-items-center rounded-[24px] bg-white/70 shadow-sm sm:size-[74px]">
                <Church size={37} strokeWidth={1.5} />
              </div>

              <p className="mt-4 text-[9px] font-extrabold uppercase tracking-[0.25em]">
                Growing
              </p>

              <h2 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-[23px] font-extrabold tracking-[-1px] sm:text-[27px]">
                Together
              </h2>

              <span className="mt-1 text-[9px] font-bold tracking-[0.22em]">
                IN FAITH
              </span>
            </motion.div>

            {/* Floating expressive shapes */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [10, 18, 10] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute right-0 top-5 z-20 grid size-[62px] place-items-center rounded-[23px] bg-[#F7DCA9] text-[#94652E] shadow-xl"
            >
              <Heart size={27} fill="currentColor" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 9, 0], rotate: [-12, -5, -12] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-5 left-0 z-20 grid size-[55px] place-items-center rounded-[20px] bg-[#D3D0F0] text-[#685C9E] shadow-xl"
            >
              <Star size={25} fill="currentColor" />
            </motion.div>

            <motion.div
              animate={{ rotate: [0, 12, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-12 right-4 z-20 grid size-11 place-items-center rounded-2xl bg-[#F3C9C1] text-[#98584C] shadow-lg"
            >
              <Flower2 size={21} />
            </motion.div>

            <div className="absolute left-6 top-12 size-3 rounded-full bg-[#F6DDAF]" />
            <div className="absolute bottom-20 right-0 size-2 rounded-full bg-white" />
          </motion.div>
        </div>

        {/* Bottom tonal strip */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/[0.08] px-6 py-4 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-white/70">
            <HandHeart size={16} />
            Faith. Fellowship. Friendship.
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-[#D9F4E7]">
            <Sparkles size={14} />
            Growing together
          </div>
        </div>
      </motion.section>

      {/* ==========================================
          COMMUNITY INTRODUCTION
      ========================================== */}

      <PageHeader
        eyebrow="OUR COMMUNITY"
        title="A place to belong."
        description="Get to know our people, celebrate our leadership and explore the memories we share."
        icon={Church}
      />

      {/* ==========================================
          COMMUNITY STATISTICS
      ========================================== */}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#176D68]">
              <Sparkles size={16} />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
                Our numbers
              </span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight text-[#20302D] sm:text-2xl">
              Our family at a glance
            </h2>

            <p className="mt-1.5 text-xs text-[#81918B]">
              A little snapshot of our growing community.
            </p>
          </div>

          <div className="hidden size-11 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68] sm:flex">
            <Users size={20} />
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              index={index}
            />
          ))}
        </motion.div>
      </section>

      {/* ==========================================
          EXPLORE OUR CHURCH
      ========================================== */}

      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#176D68]">
              <BookOpen size={16} />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
                Discover more
              </span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold tracking-tight text-[#20302D] sm:text-3xl">
              Explore our church.
            </h2>

            <p className="mt-2 text-xs text-[#81918B]">
              Three beautiful ways to experience our community.
            </p>
          </div>

          <span className="hidden items-center gap-2 text-[11px] font-bold text-[#176D68] sm:flex">
            Discover our world
            <MoveUpRight size={16} />
          </span>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.to}
                variants={fadeUp}
                whileHover={{ y: -7 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 23,
                }}
              >
                <Link
                  to={feature.to}
                  className={`group relative flex min-h-[315px] h-full flex-col overflow-hidden rounded-[34px] p-6 sm:p-7 ${feature.background}`}
                >
                  {/* Background shape */}
                  <div className={`pointer-events-none absolute -right-16 -top-16 size-52 rounded-full ${feature.decoration} opacity-45 transition-transform duration-700 group-hover:scale-125`} />

                  <div className="pointer-events-none absolute -bottom-16 -right-12 size-44 rounded-full border-[25px] border-white/35" />

                  <div className="relative flex items-center justify-between">
                    <div className={`grid size-[62px] place-items-center rounded-[23px] ${feature.iconBackground} ${feature.color} shadow-sm transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110`}>
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[12px] font-extrabold tracking-[0.15em] text-[#20302D]/35">
                      {feature.number}
                    </span>
                  </div>

                  <div className="relative mt-auto pt-12">
                    <span className={`text-[9px] font-extrabold tracking-[0.2em] ${feature.color}`}>
                      {feature.label}
                    </span>

                    <h3 className="mt-3 max-w-[260px] font-['Plus_Jakarta_Sans',sans-serif] text-[23px] font-extrabold leading-[1.18] tracking-[-0.8px] text-[#20302D]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-[280px] text-[12px] leading-[1.8] text-[#64766D]">
                      {feature.description}
                    </p>

                    <div className={`mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-3 text-[11px] font-extrabold ${feature.color} transition-all duration-300 group-hover:gap-4 group-hover:bg-white`}>
                      {feature.action}
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ==========================================
          FAITH & COMMUNITY MESSAGE
      ========================================== */}

      <section className="relative isolate overflow-hidden rounded-[36px] bg-[#E3F0E8] px-6 py-8 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-24 -z-10 size-64 rounded-full bg-[#BBDCCB]/45" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid size-[65px] shrink-0 place-items-center rounded-[24px] bg-white text-[#176D68] shadow-sm">
            <Heart size={29} />
          </div>

          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#176D68]">
              More than a church
            </span>

            <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight text-[#20302D] sm:text-2xl">
              Growing together in faith.
            </h3>

            <p className="mt-2 max-w-[520px] text-xs leading-[1.8] text-[#71847B]">
              Every child matters. Every moment counts. Every life has a purpose. We are one family, growing together.
            </p>
          </div>

          <Link
            to="/status"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#176D68] px-6 py-4 text-[11px] font-extrabold text-white shadow-md shadow-[#176D68]/15 transition-all hover:-translate-y-1 hover:bg-[#105A55] active:scale-95"
          >
            <CalendarDays size={16} />
            Church updates
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
