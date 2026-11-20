import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
      className="page-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="page-header-content">
        <div className="page-header-text">
          {eyebrow && (
            <span className="page-header-eyebrow">
              {eyebrow}
            </span>
          )}

          <h1 className="page-header-title">
            {title}
          </h1>

          {description && (
            <p className="page-header-description">
              {description}
            </p>
          )}
        </div>

        {action && (
          <button
            type="button"
            className="page-header-action"
            onClick={onAction}
          >
            {Icon && <Icon size={17} />}
            <span>{action}</span>
            <ArrowUpRight size={16} />
          </button>
        )}
      </div>
    </motion.section>
  );
}