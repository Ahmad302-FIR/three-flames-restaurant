import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { addToast } from '../store/slices/uiSlice';
import { Button } from '../components/common/Button';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const adminUser = useAppSelector((state) => state.auth.adminUser);
  const isAdminAuthenticated = useAppSelector((state) => state.auth.isAdminAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fromState = (location.state as any)?.from;
  const from = typeof fromState === 'string' ? fromState : fromState?.pathname || '/admin';
  const targetRoute = (from.startsWith('/admin') && from !== '/admin/login') ? from : '/admin';

  // If already logged in as authorized admin, redirect to dashboard
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tf_token_v1') : null;
    const role = user?.role || adminUser?.role;
    if (token && role && ['admin', 'superadmin', 'staff'].includes(role)) {
      navigate(targetRoute, { replace: true });
    }
  }, [user, adminUser, navigate, targetRoute]);

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
      const authenticatedUser = await authService.login(cleanEmail, password);

      if (!authenticatedUser || !['admin', 'superadmin', 'staff'].includes(authenticatedUser.role)) {
        throw new Error('Access denied. Administrator clearance required.');
      }

      dispatch(loginSuccess(authenticatedUser));
      dispatch(
        addToast({
          type: 'success',
          title: `Welcome, ${authenticatedUser.name}! 🔥`,
          message: 'Administrator session authenticated.',
        })
      );
      navigate(targetRoute, { replace: true });
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
    <div className="min-h-screen bg-[#1C1815] pt-28 pb-20 text-[#F3EDE5] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#28221D] border border-[#51463D] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#332B25] border border-[#51463D] flex items-center justify-center mx-auto mb-2 text-[#C97845]">
            <ShieldCheck size={30} />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">
            RESTAURANT ADMIN PORTAL
          </h2>
          <p className="text-xs text-[#BDB1A5]">
            Sign in with authorized administrator credentials to manage dishes, menu catalog, and restaurant operations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] block mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BDB1A5]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="info.ahmadkhan.com@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#332B25] border border-[#51463D] text-xs text-white focus:outline-none focus:border-[#51463D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#BDB1A5] block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BDB1A5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#332B25] border border-[#51463D] text-xs text-white focus:outline-none focus:border-[#51463D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#BDB1A5] hover:text-[#C97845] transition-colors"
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

        <div className="text-center text-xs text-[#BDB1A5] pt-2">
          <Link to="/" className="text-[#C97845] hover:underline inline-flex items-center gap-1">
            <ArrowLeft size={13} /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
