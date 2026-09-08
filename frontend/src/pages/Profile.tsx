import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addToast } from '../store/slices/uiSlice';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      navigate('/admin/profile', { replace: true });
      return;
    }

    dispatch(
      addToast({
        type: 'info',
        title: 'Instant Guest Ordering',
        message: 'No account needed! Three Flames Restaurant orders are placed directly via WhatsApp.',
      })
    );
    navigate('/menu', { replace: true });
  }, [user, navigate, dispatch]);

  return null;
};
