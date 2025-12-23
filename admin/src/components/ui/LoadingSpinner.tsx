import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Yükleniyor...',
  fullscreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center gap-3 text-text-secondary">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return <div className="py-6 flex justify-center">{content}</div>;
};

export default LoadingSpinner;

