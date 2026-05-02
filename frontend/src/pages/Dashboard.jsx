import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ListTodo, Activity, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ActivityTimeline from '../components/ActivityTimeline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, color: 'text-[var(--color-primary-base)]', bg: 'bg-[var(--color-primary-base)]/10' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'text-[var(--color-secondary-base)]', bg: 'bg-[var(--color-secondary-base)]/10' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  const chartData = stats?.tasksByStatus.map(s => ({
    name: s._id,
    count: s.count
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold mb-6">Task Distribution</h3>
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary-base)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <EmptyState icon={BarChart} title="No Data Available" description="Create tasks to see analytics." />
          )}
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-primary-base)]" />
            Tasks per User
          </h3>
          {stats?.tasksPerUser?.length > 0 ? (
            <div className="space-y-4">
              {stats.tasksPerUser.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{u.name}</span>
                    <span className="text-xs text-[var(--color-text-secondary)]">{u.email}</span>
                  </div>
                  <div className="bg-[var(--color-primary-base)]/10 text-[var(--color-primary-base)] px-3 py-1 rounded-lg font-bold">
                    {u.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <EmptyState icon={Users} title="No Data Available" description="Assign tasks to users to see analytics." />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--color-primary-base)]" />
            Activity Timeline
          </h3>
          <div className="h-[500px]">
            <ActivityTimeline activities={stats?.recentActivity || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
