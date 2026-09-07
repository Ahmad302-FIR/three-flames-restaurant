import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { authService } from '../services/authService';
import { addToast } from '../store/slices/uiSlice';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Registration step state: 'form' | 'otp'
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP inputs & states
  const [otp, setOtp] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(45);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Timer countdown effect for OTP resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Focus OTP input when transitioning to OTP screen
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 150);
    }
  }, [step]);

  // Helper to mask email for display: j***e@example.com
  const maskEmail = (emailStr: string) => {
    if (!emailStr.includes('@')) return emailStr;
    const [userPart, domain] = emailStr.split('@');
    if (userPart.length <= 2) {
      return `${userPart[0]}*@${domain}`;
    }
    return `${userPart[0]}${'*'.repeat(Math.min(userPart.length - 2, 5))}${userPart[userPart.length - 1]}@${domain}`;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password || !confirmPassword) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Fields',
          message: 'Please complete all required registration fields.',
        })
      );
      return;
    }

    if (password.length < 6) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Password Too Short',
          message: 'Password must be at least 6 characters.',
        })
      );
      return;
    }

    if (password !== confirmPassword) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Passwords Do Not Match',
          message: 'Please make sure your password and confirmation password match.',
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.register({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
      });

      setRegisteredEmail(cleanEmail);
      setStep('otp');
      setCountdown(45);
      setOtp('');

      dispatch(
        addToast({
          type: 'success',
          title: 'Verification Code Sent! 📩',
          message: res.message || 'An OTP has been sent to your email address. Please enter it to verify your account.',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: err.message || 'Could not initiate registration.',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Invalid Code',
          message: 'Please enter a valid 6-digit numeric verification code.',
        })
      );
      return;
    }

    setIsVerifying(true);
    try {
      const res = await authService.verifyEmailOtp(registeredEmail, cleanOtp);

      dispatch(
        addToast({
          type: 'success',
          title: 'Account Verified! 🔥',
          message: res.message || 'Email verified and account created successfully. Please log in.',
        })
      );

      // Clear all state
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setOtp('');

      // Redirect user directly to Login page (manual login required)
      navigate('/login');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Verification Failed',
          message: err.message || 'Verification failed. Please try again.',
        })
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      const res = await authService.resendEmailOtp(registeredEmail);
      setCountdown(45);
      setOtp('');
      dispatch(
        addToast({
          type: 'success',
          title: 'New Code Sent! 📩',
          message: res.message || 'A new verification code has been sent to your email.',
        })
      );
      otpInputRef.current?.focus();
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Resend Failed',
          message: err.message || 'Could not resend verification code.',
        })
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl space-y-6">
        {step === 'form' ? (
          <>
            {/* STEP 1: Registration Form */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto mb-2">
                <FlameIcon size={30} />
              </div>
              <h2 className="text-2xl font-extrabold font-heading text-white">
                JOIN THREE FLAMES
              </h2>
              <p className="text-xs text-[#B8AAA0]">
                Sign up for personalized dining, loyalty rewards, and fast order checkout.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                    autoComplete="name"
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
                    autoComplete="email"
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
                    autoComplete="tel"
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
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

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-xs text-white focus:outline-none focus:border-[#FF8A1F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#FF8A1F] transition-colors"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                CREATE ACCOUNT
              </Button>
            </form>

            <div className="text-center text-xs text-[#B8AAA0] pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF8A1F] font-bold hover:underline">
                Sign In Here
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* STEP 2: Email OTP Verification Screen */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto mb-2 text-[#FF8A1F]">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-extrabold font-heading text-white">
                VERIFY YOUR EMAIL
              </h2>
              <p className="text-xs text-[#B8AAA0]">
                We sent a 6-digit verification code to:
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-[#1A100C] border border-[#FF8A1F]/30 text-[#FF8A1F] font-mono text-xs font-bold">
                {maskEmail(registeredEmail)}
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B8AAA0] block text-center mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <div className="relative max-w-[260px] mx-auto">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(val);
                    }}
                    placeholder="••••••"
                    required
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-extrabold text-[#FF8A1F] py-3.5 px-4 rounded-2xl bg-[#1A100C] border-2 border-[#FF8A1F]/50 focus:outline-none focus:border-[#FF8A1F] focus:ring-2 focus:ring-[#FF8A1F]/20 transition-all placeholder:text-[#4A3B32] placeholder:tracking-[0.4em]"
                  />
                </div>
                <p className="text-[11px] text-[#8C7E75] text-center mt-2">
                  Code expires in 10 minutes.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isVerifying}
                disabled={otp.length !== 6}
                rightIcon={<ShieldCheck size={18} />}
              >
                VERIFY EMAIL
              </Button>

              <div className="text-center space-y-3 pt-1">
                {countdown > 0 ? (
                  <p className="text-xs text-[#8C7E75]">
                    Resend code in{' '}
                    <span className="text-[#FF8A1F] font-mono font-bold">
                      {countdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-xs font-bold text-[#FF8A1F] hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
                    {isResending ? 'Sending...' : 'Resend Verification Code'}
                  </button>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('form');
                      setOtp('');
                    }}
                    className="text-xs text-[#B8AAA0] hover:text-[#FF8A1F] transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={13} />
                    Change Email or Edit Details
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

