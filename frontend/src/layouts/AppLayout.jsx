import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import Landing from '../pages/Landing';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a full page loader

  if (!user) {
    return <Landing />;
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
