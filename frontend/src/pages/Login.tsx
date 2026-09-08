import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { addToast } from '../store/slices/uiSlice';
import { Button } from '../components/common/Button';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Fields',
          message: 'Please provide both email and password.',
        })
      );
      return;
    }

    setIsLoading(true);

    try {
      const user = await authService.login(cleanEmail, password);
      dispatch(loginSuccess(user));
      dispatch(
        addToast({
          type: 'success',
          title: `Welcome, ${user.name}! 🔥`,
          message: 'Administrator session authenticated.',
        })
      );
      navigate(from.startsWith('/admin') ? from : '/admin');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Authentication Denied',
          message: err.message || 'Invalid administrator credentials.',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto mb-2 text-[#FF8A1F]">
            <ShieldCheck size={30} />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">
            RESTAURANT ADMIN PORTAL
          </h2>
          <p className="text-xs text-[#B8AAA0]">
            Sign in with authorized administrator credentials to manage dishes, menu catalog, and restaurant operations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin@threeflames.pk"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#FF8A1F] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight size={16} />}
          >
            SIGN IN TO ADMIN PORTAL
          </Button>
        </form>

        <div className="text-center text-xs text-[#B8AAA0] pt-2">
          <Link to="/" className="text-[#FF8A1F] hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={13} /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
