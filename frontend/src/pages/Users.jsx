import { useState, useEffect } from 'react';
import api from '../utils/api';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { Users as UsersIcon, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.role } : u));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-[var(--color-primary-base)]" />
          Team & Users
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : users.length > 0 ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                <th className="py-4 px-6 font-medium text-sm text-[var(--color-text-secondary)]">Name</th>
                <th className="py-4 px-6 font-medium text-sm text-[var(--color-text-secondary)]">Email</th>
                <th className="py-4 px-6 font-medium text-sm text-[var(--color-text-secondary)]">Role</th>
                <th className="py-4 px-6 font-medium text-sm text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-primary-base)]/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-base)]/15 flex items-center justify-center text-[var(--color-primary-base)] font-bold text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name} {u._id === currentUser._id && "(You)"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[var(--color-text-secondary)]">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-[var(--color-secondary-base)]/10 text-[var(--color-secondary-base)]' : 'bg-[var(--color-border)] text-[var(--color-text-muted)]'}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={u.role}
                      disabled={u._id === currentUser._id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-transparent border border-[var(--color-border)] rounded-lg py-1 px-2 text-sm focus:outline-none focus:border-[var(--color-primary-base)] disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={UsersIcon} title="No Users Found" description="There are currently no registered users." />
      )}
    </div>
  );
};

export default Users;
