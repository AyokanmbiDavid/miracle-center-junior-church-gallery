
import { Church, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingScreen({
  message = "Loading gallery...",
}) {
  return (
    <div className="flex min-h-[65vh] w-full flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-[32px] bg-[#E4F2EF]"
      >
        <div className="absolute inset-2 rounded-[26px] border border-[#176D68]/10" />

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Church
            size={38}
            strokeWidth={1.7}
            className="text-[#176D68]"
          />
        </motion.div>

        <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#F8FAF8] bg-white">
          <LoaderCircle
            size={19}
            className="animate-spin text-[#176D68]"
          />
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-lg font-bold tracking-tight text-[#20302D]">
          Just a moment
        </h2>

        <p className="mt-2 max-w-xs text-sm leading-6 text-[#81918B]">
          {message}
        </p>
      </motion.div>

      <div className="mt-7 h-1.5 w-32 overflow-hidden rounded-full bg-[#E4F2EF]">
        <motion.div
          className="h-full w-1/2 rounded-full bg-[#176D68]"
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
