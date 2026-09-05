import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { authService } from '../../services/authService';
import { updateUserProfile } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import { User, Lock, Shield, Mail, Phone, KeyRound, CheckCircle2 } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name || 'Chef Tariq Afridi');
  const [phone, setPhone] = useState(user?.phone || '0334-4226655');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const updated = await authService.updateProfile({ name, phone });
      dispatch(updateUserProfile(updated));
      dispatch(
        addToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your administrator profile details were updated.',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: err.message || 'Could not update profile.',
        })
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Mismatch',
          message: 'New password and confirmation do not match.',
        })
      );
      return;
    }

    if (newPassword.length < 6) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Too Short',
          message: 'Password must be at least 6 characters.',
        })
      );
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      dispatch(
        addToast({
          type: 'success',
          title: 'Password Changed',
          message: 'Your admin credentials have been securely updated.',
        })
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Password Update Failed',
          message: err.message || 'Incorrect current password or update error.',
        })
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
          <User size={24} className="text-[#FF8A1F]" />
          Administrator Profile & Security
        </h1>
        <p className="text-xs text-[#B8AAA0] mt-1">
          Manage your pitmaster credentials, contact information, and security passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="p-6 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-[#1A100C] border border-[#FF8A1F]/40 flex items-center justify-center font-extrabold text-lg text-[#FF8A1F]">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{user?.name || 'Administrator'}</h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Role: {user?.role || 'superadmin'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={user?.email || 'admin@threeflames.pk'}
                disabled
                className="w-full px-3 py-2.5 rounded-xl bg-[#080604] border border-white/10 text-zinc-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Saving...' : 'Update Details'}
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-3xl bg-[#120B08] border border-[#FF8A1F]/20 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <KeyRound size={18} className="text-[#FF8A1F]" />
            <h3 className="font-bold text-white text-sm">Security & Password Change</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Current Password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#B8AAA0] block mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password match"
                className="w-full px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#FF8A1F]/30 text-white focus:outline-none"
              />
            </div>

            <Button variant="secondary" size="sm" type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? 'Securing...' : 'Change Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
