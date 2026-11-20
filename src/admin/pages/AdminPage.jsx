
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  LogIn,
  Users,
  Crown,
  Images,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  EyeOff,
  LayoutDashboard,
  Heart,
  Church,
} from "lucide-react";
import { motion } from "framer-motion";

import PageHeader from "../../components/PageHeader";
import LoadingScreen from "../../components/LoadingScreen";
import { useAdminAuth } from "../AdminAuthContext";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getMembers } from "../../services/memberService";
import { getPositions } from "../../services/excoService";
import { getStatuses } from "../../services/statusService";
import { getThrowbacks } from "../../services/throwbackService";

const dashboardItems = [
  {
    label: "Members",
    description: "Registered Junior Church members",
    icon: Users,
    theme: "bg-[#E4F2EF]",
    iconTheme: "bg-[#CCE9DF] text-[#176D68]",
  },
  {
    label: "Exco positions",
    description: "Leadership positions",
    icon: Crown,
    theme: "bg-[#FFF2DC]",
    iconTheme: "bg-[#F9E5BB] text-[#93631D]",
  },
  {
    label: "Active updates",
    description: "Published gallery updates",
    icon: Sparkles,
    theme: "bg-[#EAE7F7]",
    iconTheme: "bg-[#DDD5F5] text-[#6552A0]",
  },
  {
    label: "Throwbacks",
    description: "Saved church memories",
    icon: Images,
    theme: "bg-[#FCEDE9]",
    iconTheme: "bg-[#F8DCD4] text-[#A64F3D]",
  },
];

function LoginPage({ login }) {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (!password.trim()) {
      setError("Please enter your administrator password.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await login(password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden py-8 sm:py-12">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-0 -z-10 size-72 rounded-full bg-[#DCEFE6]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 -z-10 size-80 rounded-full bg-[#F5EAD5]/70 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[490px]"
      >
        <div className="overflow-hidden rounded-[36px] border border-[#E8EFEB] bg-white shadow-[0_20px_70px_rgba(32,48,45,0.09)]">
          {/* Top identity section */}
          <div className="relative isolate overflow-hidden bg-[#203D37] px-6 pb-9 pt-8 text-white sm:px-9 sm:pt-10">
            <div className="absolute -right-12 -top-16 -z-10 size-52 rounded-full border-[28px] border-white/[0.06]" />
            <div className="absolute -bottom-16 right-24 -z-10 size-36 rounded-full bg-[#8CCDB4]/10 blur-2xl" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-[#D1EDE1] text-[#176D68]">
                  <Church size={24} />
                </div>

                <div>
                  <p className="text-xs font-extrabold tracking-[0.13em] text-[#B7DDD0]">
                    MIRACLE CENTRE
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/60">
                    Junior Church Gallery
                  </p>
                </div>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-[#C8E7D9]">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="mt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5">
                <LockKeyhole size={13} className="text-[#B7DDD0]" />
                <span className="text-[10px] font-extrabold tracking-[0.14em] text-[#D1EDE1]">
                  SECURE ADMINISTRATION
                </span>
              </div>

              <h1 className="mt-5 font-['Plus_Jakarta_Sans'] text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome back.
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                Your administration workspace is ready. Sign in to manage your church gallery.
              </p>
            </div>
          </div>

          {/* Login form */}
          <div className="p-6 sm:p-9">
            <div className="mb-7">
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#20302D]">
                Administrator sign in
              </h2>
              <p className="mt-1.5 text-sm text-[#81918B]">
                Enter your password to continue.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-bold text-[#53675F]"
                >
                  Admin password
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#81918B]">
                    <LockKeyhole size={18} />
                  </div>

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={busy}
                    className="h-14 w-full rounded-[19px] border border-[#E5ECE8] bg-[#F8FAF8] pl-12 pr-12 text-sm font-medium text-[#20302D] outline-none transition placeholder:text-[#A0AEA7] focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[#81918B] transition hover:bg-[#E4F2EF] hover:text-[#176D68]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="rounded-[17px] border border-[#F1D4CE] bg-[#FCEDE9] px-4 py-3 text-sm font-medium leading-relaxed text-[#A64F3D]"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={busy || !password.trim()}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#176D68] px-6 text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(23,109,104,0.20)] transition-all hover:bg-[#105A55] hover:shadow-[0_10px_25px_rgba(23,109,104,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying access...
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <LogIn size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#EDF1EE] pt-6 text-center">
              <ShieldCheck size={15} className="text-[#176D68]" />
              <p className="text-[11px] font-medium text-[#81918B]">
                Protected administrator access
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-medium text-[#81918B]">
          Miracle Centre Junior Church · Administration
        </p>
      </motion.div>
    </div>
  );
}

function StatCard({ item, value, loading, index }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -5 }}
      className={`relative isolate overflow-hidden rounded-[30px] p-5 sm:p-6 ${item.theme}`}
    >
      <div className="absolute -right-8 -top-8 -z-10 size-32 rounded-full border-[18px] border-white/30" />

      <div className="flex items-center justify-between">
        <div className={`flex size-12 items-center justify-center rounded-[18px] ${item.iconTheme}`}>
          <Icon size={23} />
        </div>

        <ArrowUpRight size={19} className="text-[#53675F]/50" />
      </div>

      <div className="mt-7">
        <p className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold tracking-tight text-[#20302D]">
          {loading ? (
            <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-black/10" />
          ) : (
            value
          )}
        </p>

        <h3 className="mt-1 text-sm font-extrabold text-[#20302D]">
          {item.label}
        </h3>

        <p className="mt-1 text-xs font-medium text-[#71847B]">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const members = useGalleryData(getMembers);
  const positions = useGalleryData(getPositions);
  const statuses = useGalleryData(() => getStatuses(false), []);
  const throwbacks = useGalleryData(getThrowbacks);

  const stats = [
    members,
    positions,
    statuses,
    throwbacks,
  ];

  const isLoading = stats.some((item) => item.loading);

  const hasError = stats.some((item) => item.error);

  const values = [
    members.data?.length || 0,
    positions.data?.length || 0,
    statuses.data?.length || 0,
    throwbacks.data?.length || 0,
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="ADMIN WORKSPACE"
        title="Dashboard"
        description="Your central space for managing the Miracle Centre Junior Church gallery."
        icon={LayoutDashboard}
      />

      {/* Welcome banner */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative isolate overflow-hidden rounded-[34px] bg-[#203D37] p-6 text-white sm:p-9"
      >
        <div className="absolute -right-16 -top-20 -z-10 size-64 rounded-full border-[35px] border-white/[0.05]" />
        <div className="absolute -bottom-20 right-32 -z-10 size-48 rounded-full bg-[#9DD8C0]/10 blur-3xl" />

        <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[#C8E7D9]">
              <Sparkles size={14} />
              <span className="text-[10px] font-extrabold tracking-[0.14em]">
                YOUR MANAGEMENT SPACE
              </span>
            </div>

            <h2 className="mt-5 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              Keep the gallery
              <br className="hidden sm:block" />
              growing beautifully.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
              Manage members, organise leadership, publish updates and preserve the memories that make your church family special.
            </p>
          </div>

          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            className="flex size-24 shrink-0 items-center justify-center self-start rounded-[30px] border border-white/10 bg-white/[0.09] text-[#C8E7D9] sm:size-28 sm:self-center"
          >
            <Church size={48} strokeWidth={1.5} />
          </motion.div>
        </div>

        <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-5">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#CDEADF] text-[#176D68]">
            <Heart size={15} />
          </div>

          <p className="text-xs font-semibold text-white/70">
            Every member and every memory matters.
          </p>
        </div>
      </motion.section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#176D68]">
              At a glance
            </span>

            <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#20302D] sm:text-2xl">
              Gallery overview
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#E4F2EF] px-3 py-2 text-[#176D68]">
            <span className="size-2 rounded-full bg-[#299B78]" />
            <span className="text-[10px] font-bold">
              Live data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardItems.map((item, index) => (
            <StatCard
              key={item.label}
              item={item}
              value={values[index]}
              loading={isLoading}
              index={index}
            />
          ))}
        </div>

        {hasError && (
          <p className="mt-4 rounded-2xl bg-[#FFF2DC] px-4 py-3 text-xs font-medium text-[#93631D]">
            Some dashboard statistics could not be loaded. Check your connection or refresh the page.
          </p>
        )}
      </section>

      {/* Management guide */}
      <section className="rounded-[30px] border border-[#E8EFEB] bg-white p-6 shadow-[0_5px_20px_rgba(32,48,45,0.035)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[18px] bg-[#E4F2EF] text-[#176D68]">
            <LayoutDashboard size={22} />
          </div>

          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#20302D]">
              Keep everything up to date.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#71847B]">
              Use the administration sections to register members, organise Exco positions, publish status updates and preserve throwback memories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const { authenticated, login } = useAdminAuth();

  if (authenticated) {
    return <Dashboard />;
  }

  return <LoginPage login={login} />;
}
