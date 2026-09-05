import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { addToast } from '../store/slices/uiSlice';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Fields',
          message: 'Please complete all required registration fields.',
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.register({
        name,
        email,
        phone,
        password,
      });
      dispatch(loginSuccess(user));
      dispatch(
        addToast({
          type: 'success',
          title: 'Account Created! 🔥',
          message: `Welcome to Three Flames, ${user.name}!`,
        })
      );
      navigate('/');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: err.message || 'Could not register.',
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
            JOIN THREE FLAMES
          </h2>
          <p className="text-xs text-[#B8AAA0]">
            Sign up for personalized recommendations, loyalty rewards, and fast orders.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asadullah Khan"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03xx-xxxxxxx"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            CREATE ACCOUNT
          </Button>
        </form>

        <div className="text-center text-xs text-[#B8AAA0] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF8A1F] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
