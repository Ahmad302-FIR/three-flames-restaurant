import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store';
import { addToast } from '../store/slices/uiSlice';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Instant WhatsApp Ordering 🔥',
        message: 'No account registration required! You can order directly via WhatsApp.',
      })
    );
    const timer = setTimeout(() => {
      navigate('/menu', { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen bg-[#080604] pt-28 pb-20 text-[#FFF7ED] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/30 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center mx-auto text-[#FF8A1F]">
          <FlameIcon size={30} />
        </div>
        <h2 className="text-xl font-extrabold font-heading text-white">
          INSTANT WHATSAPP ORDERING
        </h2>
        <p className="text-xs text-[#B8AAA0] leading-relaxed">
          Customer registration is not needed. You can select dishes and order directly through WhatsApp without creating an account!
        </p>
        <div className="pt-2">
          <Button variant="primary" size="md" fullWidth onClick={() => navigate('/menu')}>
            Explore Food Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
