import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Kayıt bulunamadı',
  description = 'Henüz veri eklenmemiş.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-text-secondary">
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
        <FileQuestion className="text-text-secondary" size={28} />
      </div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;

