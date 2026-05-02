import { NavLink } from 'react-router-dom';
import { Home, FolderKanban, CheckSquare, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Activity', path: '/activity', icon: Activity },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col h-full hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-base)] flex items-center justify-center text-white font-bold">
            W
          </div>
          <span className="text-xl font-bold tracking-tight">WorkHive</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] font-semibold'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-main)]'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] font-semibold'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-main)]'
              )
            }
          >
            <User className="w-5 h-5" />
            Team & Users
          </NavLink>
        )}
      </div>

      <div className="p-4 border-t border-[var(--color-border)] flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-main)] transition-colors w-full">
          <User className="w-5 h-5" />
          Profile
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
