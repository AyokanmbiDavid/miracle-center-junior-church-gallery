import { lazy, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import LoadingScreen from '../components/LoadingScreen';
import AdminLayout from '../admin/AdminLayout';

const Home = lazy(() => import('../user/pages/Home'));
const Members = lazy(() => import('../user/pages/General'));
const Exco = lazy(() => import('../user/pages/Exco'));
const Status = lazy(() => import('../user/pages/Status'));
const Throwbacks = lazy(() => import('../user/pages/Throwbacks'));

const Dashboard = lazy(() => import('../admin/pages/AdminPage'));
const AdminMembers = lazy(() => import('../admin/pages/Members'));
const AdminExco = lazy(() => import('../admin/pages/Exco'));
const AdminStatus = lazy(() => import('../admin/pages/Status'));
const AdminThrowbacks = lazy(() => import('../admin/pages/Throwbacks'));
const AdminSettings = lazy(() => import('../admin/pages/Settings'));

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold text-[#176D68]">404</h1>
      <p className="text-sm text-[#81918B] mt-3">Page not found.</p>
    </div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: .2 }}
      >
        <Suspense fallback={<LoadingScreen/>}>
          <Routes location={location}>
            <Route path="/" element={<Home/>}/>
            <Route path="/members" element={<Members/>}/>
            <Route path="/exco" element={<Exco/>}/>
            <Route path="/status" element={<Status/>}/>
            <Route path="/throwbacks" element={<Throwbacks/>}/>

            <Route path="/admin" element={<AdminLayout/>}>
              <Route index element={<Dashboard/>}/>
              <Route path="members" element={<AdminMembers/>}/>
              <Route path="exco" element={<AdminExco/>}/>
              <Route path="status" element={<AdminStatus/>}/>
              <Route path="throwbacks" element={<AdminThrowbacks/>}/>
              <Route path="settings" element={<AdminSettings/>}/>
            </Route>

            <Route path="/404" element={<NotFound/>}/>
            <Route path="*" element={<Navigate to="/404" replace/>}/>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
