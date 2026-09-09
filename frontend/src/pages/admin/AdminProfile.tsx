import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { authService } from '../../services/authService';
import { updateUserProfile } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import { User, Lock, Shield, Mail, Phone, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Sync state when user profile is loaded
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanCurrent) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Required Field',
          message: 'Please provide your current password.',
        })
      );
      return;
    }

    if (cleanNew !== cleanConfirm) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Mismatch',
          message: 'New password and confirmation do not match.',
        })
      );
      return;
    }

    if (cleanNew.length < 6) {
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
      await authService.changePassword(cleanCurrent, cleanNew);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#25201D] flex items-center gap-2">
          <User size={24} className="text-[#B85C38]" />
          Administrator Profile & Security
        </h1>
        <p className="text-xs text-[#6F6761] mt-1">
          Manage your pitmaster credentials, contact information, and security passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-5 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E8DED6]">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F3EE] border border-[#E8DED6] flex items-center justify-center font-extrabold text-lg text-[#B85C38]">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="font-bold text-[#25201D] text-base">{user?.name || 'Administrator'}</h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Role: {user?.role || 'superadmin'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                placeholder="Admin Email"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDFC] border border-[#E8DED6] text-zinc-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Saving...' : 'Update Details'}
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8DED6] space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8DED6]">
            <KeyRound size={18} className="text-[#B85C38]" />
            <h3 className="font-bold text-[#25201D] text-sm">Security & Password Change</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none focus:border-[#E8DED6]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6761] hover:text-[#B85C38] transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none focus:border-[#E8DED6]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6761] hover:text-[#B85C38] transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold uppercase text-[#6F6761] block mb-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm password match"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#F7F3EE] border border-[#E8DED6] text-white focus:outline-none focus:border-[#E8DED6]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6761] hover:text-[#B85C38] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
