
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
  icon: Icon,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative isolate mb-7
        overflow-hidden
        rounded-[30px]
        border border-[#e6efea]
        bg-[#f0f6f2]
        px-5 py-6
        sm:px-7 sm:py-8
        lg:rounded-[36px]
      "
    >
      {/* Decorative tonal shapes */}
      <div className="
        pointer-events-none absolute
        -right-16 -top-24
        -z-10 size-64
        rounded-full
        bg-[#dceee5]/80
        blur-2xl
      " />

      <div className="
        pointer-events-none absolute
        -bottom-24 right-24
        -z-10 size-48
        rounded-full
        bg-[#d5e9e4]/70
        blur-3xl
      " />

      <div className="
        relative flex flex-col
        justify-between gap-6
        sm:flex-row sm:items-end
      ">

        {/* Heading content */}
        <div className="min-w-0 flex-1">

          {/* Eyebrow */}
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.35 }}
              className="
                mb-4 inline-flex
                items-center gap-2
                rounded-full
                border border-[#d6e7df]
                bg-white/75
                px-3.5 py-2
                text-[10px] font-extrabold
                uppercase tracking-[1.7px]
                text-[#176d68]
              "
            >
              <Sparkles size={13} strokeWidth={2.2} />
              {eyebrow}
            </motion.div>
          )}

          {/* Title */}
          <div className="flex items-start gap-3">

            {Icon && (
              <div className="
                mt-1 hidden size-12
                shrink-0 place-items-center
                rounded-[17px]
                bg-[#dcece5]
                text-[#176d68]
                sm:grid
              ">
                <Icon size={24} strokeWidth={2} />
              </div>
            )}

            <div className="min-w-0">
              <h1 className="
                max-w-3xl
                font-['Plus_Jakarta_Sans',sans-serif]
                text-[27px] font-extrabold
                leading-[1.16]
                tracking-[-1.3px]
                text-[#20302d]
                sm:text-[34px]
                lg:text-[39px]
              ">
                {title}
              </h1>

              {description && (
                <p className="
                  mt-3 max-w-2xl
                  text-[13px] leading-[1.8]
                  text-[#71847b]
                  sm:text-[14px]
                ">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action button */}
        {action && (
          <motion.button
            type="button"
            onClick={onAction}
            whileHover={{ scale: 1.035 }}
            whileTap={{ scale: 0.96 }}
            className="
              group inline-flex shrink-0
              items-center justify-center
              gap-2.5
              self-start
              rounded-full
              bg-[#176d68]
              px-5 py-3.5
              text-[12px] font-bold
              text-white
              shadow-[0_5px_14px_rgba(23,109,104,0.16)]
              transition-colors
              hover:bg-[#105a55]
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#176d68]/20
              sm:self-auto
            "
          >
            {Icon && (
              <Icon size={17} strokeWidth={2.2} />
            )}

            <span>{action}</span>

            <ArrowUpRight
              size={16}
              className="
                transition-transform duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </motion.button>
        )}
      </div>

      {/* Bottom decorative accent */}
      <div className="
        absolute bottom-0 left-7
        h-[3px] w-16
        rounded-full bg-[#176d68]/50
      " />
    </motion.section>
  );
}
