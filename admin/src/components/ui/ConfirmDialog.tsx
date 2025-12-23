'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <XCircle className="text-red-600" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-orange-600" size={24} />;
      case 'info':
        return <Info className="text-blue-600" size={24} />;
      case 'success':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return <AlertTriangle className="text-red-600" size={24} />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      case 'success':
        return 'success';
      default:
        return 'danger';
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      widthClass="max-w-md"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
            <p className="text-text-secondary">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Hook for easy usage
export function useConfirmDialog() {
  const [dialog, setDialog] = React.useState<Omit<ConfirmDialogProps, 'open' | 'onClose' | 'onConfirm'> | null>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const confirm = (
    title: string,
    message: string,
    options?: {
      variant?: 'danger' | 'warning' | 'info' | 'success';
      confirmText?: string;
      cancelText?: string;
    }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        title,
        message,
        variant: options?.variant || 'danger',
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
      });
      setOpen(true);

      const handleConfirm = async () => {
        setLoading(true);
        resolve(true);
        setOpen(false);
        setLoading(false);
        setDialog(null);
      };

      const handleCancel = () => {
        resolve(false);
        setOpen(false);
        setDialog(null);
      };

      // Store handlers temporarily
      (window as any).__confirmDialogHandlers = { handleConfirm, handleCancel };
    });
  };

  const Dialog = dialog ? (
    <ConfirmDialog
      {...dialog}
      open={open}
      loading={loading}
      onClose={() => {
        (window as any).__confirmDialogHandlers?.handleCancel();
      }}
      onConfirm={() => {
        (window as any).__confirmDialogHandlers?.handleConfirm();
      }}
    />
  ) : null;

  return { confirm, Dialog };
}

