import { FolderOpen } from 'lucide-react';

const EmptyState = ({ icon: Icon = FolderOpen, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
      <div className="w-16 h-16 bg-[var(--color-border)] rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[var(--color-text-secondary)]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
