'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useToast } from '@/components/ui/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = 'E-posta adresi gereklidir';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli bir e-posta adresi giriniz';

    if (!password) newErrors.password = 'Şifre gereklidir';
    else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalıdır';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      await authService.login({ email, password });
      showToast('success', 'Giriş başarılı! Yönlendiriliyorsunuz...');
      
      // Kısa bir gecikme sonrası dashboard'a yönlendir
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error: any) {
      const errorMessage = error.message || 'Giriş başarısız. Lütfen tekrar deneyin.';
      setErrors({ general: errorMessage });
      showToast('error', errorMessage, 'Giriş Hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-12">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Şehitkamil Belediyesi</h1>
            <h2 className="text-xl font-semibold text-slate-700 mb-1">Yönetim Paneli</h2>
            <p className="text-base text-emerald-700 font-medium">Giriş Yapın</p>
          </div>

          {/* Login Form - Arka plan yok */}
          <div className="p-8">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Genel Hata Mesajı */}
              {errors.general && (
                <div className="text-center">
                  <p className="text-sm text-red-600 font-medium">{errors.general}</p>
                </div>
              )}

              {/* E-posta */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-emerald-700">
                  E-posta
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="ornek@email.com"
                    autoComplete="email"
                    style={{ paddingLeft: '56px', paddingTop: '16px', paddingBottom: '16px' }}
                    className={[
                      'w-full rounded-lg bg-emerald-50/50 text-slate-900 placeholder:text-slate-400',
                      'pr-5 text-base border transition-all',
                      errors.email
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-emerald-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500',
                      'focus:outline-none',
                    ].join(' ')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium mt-2">{errors.email}</p>
                )}
              </div>

              {/* Şifre */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-emerald-700">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none z-10">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Şifrenizi giriniz"
                    autoComplete="current-password"
                    style={{ paddingLeft: '56px', paddingRight: '48px', paddingTop: '16px', paddingBottom: '16px' }}
                    className={[
                      'w-full rounded-lg bg-emerald-50/50 text-slate-900 placeholder:text-slate-400',
                      'text-base border transition-all',
                      errors.password
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                        : 'border-emerald-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500',
                      'focus:outline-none',
                    ].join(' ')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-colors z-10"
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium mt-2">{errors.password}</p>
                )}
              </div>

              {/* Giriş Yap Butonu - Büyük ve ayrık */}
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    paddingLeft: '120px',
                    paddingRight: '120px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                  }}
                  className={[
                    'rounded-lg text-base font-semibold text-white',
                    'bg-gradient-to-r from-emerald-600 to-emerald-700',
                    'hover:from-emerald-700 hover:to-emerald-800',
                    'shadow-lg shadow-emerald-200',
                    'focus:outline-none focus:ring-4 focus:ring-emerald-200',
                    'disabled:opacity-70 disabled:cursor-not-allowed',
                    'transition-all transform hover:scale-[1.02] active:scale-[0.98]',
                    'flex items-center justify-center',
                  ].join(' ')}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer - En Altta */}
      <div className="text-center mt-auto py-6">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Şehitkamil Belediyesi. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
