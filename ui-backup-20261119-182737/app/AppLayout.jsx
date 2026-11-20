import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F8F6] text-[#20302D]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[270px] z-40">
        <Sidebar/>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed inset-y-0 left-0 w-[285px] z-50 lg:hidden"
            >
              <Sidebar close={() => setOpen(false)}/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:ml-[270px] min-h-screen flex flex-col">
        <Header
          open={() => setOpen(true)}
          admin={location.pathname.startsWith('/admin')}
        />

        <div className="w-full max-w-[1600px] mx-auto flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>

        <footer className="border-t border-[#E9EFEC] bg-white px-6 py-5 flex justify-between gap-3 flex-wrap text-xs text-[#81918B]">
          <span>© {new Date().getFullYear()} Miracle Centre Junior Church</span>
          <span>Made for memories and community.</span>
        </footer>
      </main>
    </div>
  );
}
