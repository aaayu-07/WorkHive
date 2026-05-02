import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TopHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const prevUnreadCountRef = useRef(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        const newUnreadCount = data.filter(n => !n.isRead).length;
        
        if (newUnreadCount > prevUnreadCountRef.current && prevUnreadCountRef.current !== 0) {
          toast('You have new notifications', { icon: '🔔' });
        }
        
        prevUnreadCountRef.current = newUnreadCount;
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full bg-[var(--color-bg)] border border-transparent focus:border-[var(--color-primary-base)] rounded-full py-2 pl-10 pr-4 outline-none text-sm transition-all text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-muted)]"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-muted)] relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-[var(--color-surface)]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <h3 className="font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="text-xs text-[var(--color-primary-base)] hover:underline flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--color-text-secondary)]">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] cursor-pointer transition-colors ${!notification.isRead ? 'bg-[var(--color-primary-base)]/5' : ''}`}
                    >
                      <p className={`text-sm ${!notification.isRead ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[var(--color-border)]">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-base)]/15 flex items-center justify-center text-[var(--color-primary-base)] font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
