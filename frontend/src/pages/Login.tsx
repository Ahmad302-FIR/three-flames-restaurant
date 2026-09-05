import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { addToast } from '../store/slices/uiSlice';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('asfandyar@example.com');
  const [password, setPassword] = useState('Customer@123');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.login(email, password);
      dispatch(loginSuccess(user));
      dispatch(
        addToast({
          type: 'success',
          title: `Welcome back, ${user.name}! 🔥`,
          message: 'Logged in successfully.',
        })
      );
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: err.message || 'Invalid credentials.',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@threeflames.pk');
    setPassword('Admin@123');
    setIsLoading(true);
    try {
      const user = await authService.login('admin@threeflames.pk', 'Admin@123');
      dispatch(loginSuccess(user));
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome Admin 🔥',
          message: 'Redirecting to restaurant operations portal...',
        })
      );
      navigate('/admin');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: err.message || 'Invalid admin credentials.',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCustomerLogin = async () => {
    setEmail('asfandyar@example.com');
    setPassword('Customer@123');
    setIsLoading(true);
    try {
      const user = await authService.login('asfandyar@example.com', 'Customer@123');
      dispatch(loginSuccess(user));
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome Customer 🔥',
          message: 'Logged in as demo customer.',
        })
      );
      navigate('/');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: err.message || 'Invalid credentials.',
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
          <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto mb-2">
            <FlameIcon size={30} />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">
            SIGN IN TO THREE FLAMES
          </h2>
          <p className="text-xs text-[#B8AAA0]">
            Access your order history, saved addresses, and express checkout.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3 rounded-2xl bg-[#1A100C] border border-white/5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A32] block text-center">
            ⚡ 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomerLogin}
              className="px-3 py-2 rounded-xl bg-[#080604] hover:bg-[#FF8A1F]/20 text-xs font-semibold text-white border border-[#FF8A1F]/30 transition-colors"
            >
              Demo Diner
            </button>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="px-3 py-2 rounded-xl bg-[#080604] hover:bg-[#FF8A1F]/20 text-xs font-semibold text-[#FF8A1F] border border-[#FF8A1F]/30 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
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
            SIGN IN
          </Button>
        </form>

        <div className="text-center text-xs text-[#B8AAA0] pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FF8A1F] font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
