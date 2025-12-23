'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginCredentials } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-card p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <span className="text-white text-2xl font-bold">Ş</span>
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">
              Şehitkamil Belediyesi
            </h1>
            <p className="text-text-secondary">Admin Paneli</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-input">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@sehitkamil.bel.tr"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

