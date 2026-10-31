import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@chaiwala.com');
  const [password, setPassword] = useState('chaiwala123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Email or password is incorrect.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-[var(--linen)] text-[var(--dark-roast)]">
      <div className="max-w-md w-full bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-warm-md)] space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--clay)] hover:text-[var(--terracotta)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[var(--terracotta)] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-[var(--dark-roast)]">Staff Fulfilment Portal</h1>
          <p className="text-xs text-[var(--clay)]">
            Counter and kitchen order management access
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FFF0F0] border border-[#E5484D]/30 rounded-xl text-xs text-[#E5484D] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[var(--dark-roast)] block mb-1.5">Staff Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--clay)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-[var(--dark-roast)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[var(--dark-roast)] block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--clay)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-[var(--dark-roast)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--terracotta)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#85321D] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Order Board'}
          </button>
        </form>

        <div className="p-3.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-xs text-[var(--clay)] text-center space-y-1">
          <p className="font-semibold text-[var(--dark-roast)]">Demo Administrator Access:</p>
          <p>
            Email: <code className="bg-[var(--parchment)] px-1.5 py-0.5 rounded border border-[var(--warm-border)] font-mono text-[11px] text-[var(--dark-roast)]">admin@chaiwala.com</code>
          </p>
          <p>
            Password: <code className="bg-[var(--parchment)] px-1.5 py-0.5 rounded border border-[var(--warm-border)] font-mono text-[11px] text-[var(--dark-roast)]">chaiwala123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
