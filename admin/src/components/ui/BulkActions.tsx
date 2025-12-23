'use client';

import React from 'react';
import { Button } from './Button';
import { Trash2, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  action: (selectedIds: string[]) => void | Promise<void>;
  variant?: 'default' | 'danger' | 'success';
  confirmMessage?: string;
}

interface BulkActionsProps {
  selectedIds: string[];
  actions: BulkAction[];
  onClearSelection: () => void;
  totalCount?: number;
}

export function BulkActions({ selectedIds, actions, onClearSelection, totalCount }: BulkActionsProps) {
  if (selectedIds.length === 0) {
    return null;
  }

  const handleAction = async (action: BulkAction) => {
    if (action.confirmMessage) {
      const confirmed = confirm(action.confirmMessage.replace('{count}', selectedIds.length.toString()));
      if (!confirmed) return;
    }
    await action.action(selectedIds);
    onClearSelection();
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-surface border border-border rounded-card shadow-lg p-4 flex items-center gap-4">
        <div className="text-sm font-medium text-text">
          <span className="font-semibold text-primary">{selectedIds.length}</span>
          {totalCount && ` / ${totalCount}`} öğe seçildi
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant === 'danger' ? 'danger' : action.variant === 'success' ? 'success' : 'secondary'}
              size="sm"
              onClick={() => handleAction(action)}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Seçimi Temizle
          </Button>
        </div>
      </div>
    </div>
  );
}

