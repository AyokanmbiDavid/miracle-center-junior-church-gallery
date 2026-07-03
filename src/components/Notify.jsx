import React, { useContext, useEffect } from 'react';
import { all_provider } from './ContextProvider';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MorphingBox from './MorphingBox';

const Notification = () => {
  const { notifystatus, closenotify } = useContext(all_provider);

  // Auto-close logic for non-loading notifications
  useEffect(() => {
    if (notifystatus.show && notifystatus.type !== 'loading') {
      const timer = setTimeout(() => closenotify(), 4000);
      return () => clearTimeout(timer);
    }
  }, [notifystatus.show, notifystatus.type, closenotify]);

  // Official Material 3 Tonal Palettes
  const styles = {
    success: {
      container: "bg-[#C4EED0]", // M3 Success Tonal
      text: "text-[#072711]",
      icon: <CheckCircle2 size={18} />
    },
    failure: {
      container: "bg-[#F9DEDC]", // M3 Error Tonal
      text: "text-[#410E0B]",
      icon: <AlertCircle size={18} />
    },
    loading: {
      container: "bg-[#D3E3FD]", // M3 Primary Tonal (Google Blue)
      text: "text-[#041E49]",
      icon: <Loader2 size={18} className="animate-spin" />
    }
  };

  const current = styles[notifystatus.type] || styles.loading;

  return (
    <AnimatePresence>
      {notifystatus.show && (
        <div className="fixed bottom-20 left-0 right-0 z-[9999] flex justify-end pointer-events-none px-4">
          <motion.div 
            // M3 "Entrance/Exit" Spring
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`
              pointer-events-auto
              flex items-center gap-3 
              pl-4 pr-2 py-2.5 
              rounded-2xl
              ${current.container}
              shadow-[0_4px_12px_rgba(0,0,0,0.1)]
              min-w-[280px] max-w-sm
            `}
          >
            {/* Icon Wrapper */}
            <div className={`${current.text} flex-shrink-0 opacity-80`}>
              {current.icon}
            </div>

            {/* Message Body */}
            <span className={`flex-grow text-sm font-medium tracking-tight ${current.text}`}>
              {notifystatus.message}
            </span>  

            {notifystatus.type == "loading" && <MorphingBox/>}

            {/* Close Button (Hidden on Loading) */}
            {notifystatus.type !== 'loading' && (
              <button 
                onClick={closenotify} 
                className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${current.text}`}
              >
                
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
