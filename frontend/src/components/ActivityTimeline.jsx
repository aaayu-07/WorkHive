import { useState, useMemo } from 'react';
import { isToday, isYesterday, format } from 'date-fns';
import { Activity, Filter } from 'lucide-react';
import EmptyState from './EmptyState';

const ActivityTimeline = ({ activities }) => {
  const [filterUser, setFilterUser] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const uniqueUsers = useMemo(() => {
    const users = new Map();
    activities.forEach(a => {
      if (a.user) users.set(a.user._id, a.user.name);
    });
    return Array.from(users.entries());
  }, [activities]);

  const uniqueProjects = useMemo(() => {
    const projects = new Map();
    activities.forEach(a => {
      if (a.project) projects.set(a.project._id, a.project.name);
    });
    return Array.from(projects.entries());
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const matchUser = filterUser ? a.user?._id === filterUser : true;
      const matchProject = filterProject ? a.project?._id === filterProject : true;
      return matchUser && matchProject;
    });
  }, [activities, filterUser, filterProject]);

  const groupedActivities = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    filteredActivities.forEach(activity => {
      const date = new Date(activity.createdAt);
      if (isToday(date)) {
        groups.Today.push(activity);
      } else if (isYesterday(date)) {
        groups.Yesterday.push(activity);
      } else {
        groups.Older.push(activity);
      }
    });
    return groups;
  }, [filteredActivities]);

  if (!activities || activities.length === 0) {
    return <EmptyState icon={Activity} title="No Activity" description="Get started by creating a project or task." />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)]">
        <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
        <select
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="bg-transparent border-none text-sm outline-none cursor-pointer"
        >
          <option value="">All Users</option>
          {uniqueUsers.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <div className="w-px h-4 bg-[var(--color-border)]"></div>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-transparent border-none text-sm outline-none cursor-pointer"
        >
          <option value="">All Projects</option>
          {uniqueProjects.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto pr-2">
        {Object.entries(groupedActivities).map(([groupName, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={groupName}>
              <h4 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 sticky top-0 bg-[var(--color-surface)] py-1 z-10">
                {groupName}
              </h4>
              <div className="space-y-6">
                {items.map((activity) => (
                  <div key={activity._id} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-base)]/10 flex items-center justify-center shrink-0 z-10">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        {activity.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute left-4 top-8 bottom-[-24px] w-px bg-[var(--color-border)] last:hidden"></div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium text-[var(--color-text-primary)]">{activity.user?.name}</span>{' '}
                        <span className="text-[var(--color-text-secondary)]">{activity.action}</span>{' '}
                        {activity.details && <span className="font-medium text-[var(--color-text-primary)]">"{activity.details}"</span>}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {format(new Date(activity.createdAt), 'h:mm a')}
                        </p>
                        {activity.project && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
                            <span className="text-[10px] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                              {activity.project.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredActivities.length === 0 && (
          <div className="text-center text-sm text-[var(--color-text-secondary)] py-8">
            No activity matches the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
