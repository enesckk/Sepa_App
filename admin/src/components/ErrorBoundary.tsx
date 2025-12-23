'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-surface rounded-card shadow-card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">Bir Hata Oluştu</h1>
            <p className="text-text-secondary mb-6">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            {this.state.error && process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 rounded border border-red-200 text-left">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleReset} leftIcon={<RefreshCw size={16} />}>
                Yeniden Dene
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'} leftIcon={<Home size={16} />}>
                Ana Sayfa
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

