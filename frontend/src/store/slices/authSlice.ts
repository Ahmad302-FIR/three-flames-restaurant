import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';

interface AuthState {
  user: UserProfile | null;
  isAdminAuthenticated: boolean;
  adminUser: {
    name: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
}

const loadAuthFromStorage = (): AuthState => {
  try {
    const savedUser = localStorage.getItem('tf_user_v1');
    const token = localStorage.getItem('tf_token_v1');
    const user: UserProfile | null = savedUser ? JSON.parse(savedUser) : null;
    const hasValidAdminRole = Boolean(
      token && user && ['admin', 'superadmin', 'staff'].includes(user.role)
    );

    return {
      user,
      isAuthenticated: Boolean(user && token),
      isAdminAuthenticated: hasValidAdminRole,
      adminUser: hasValidAdminRole && user ? { name: user.name, email: user.email, role: user.role } : null,
    };
  } catch (e) {
    console.error('Failed to load auth state', e);
  }

  return {
    user: null,
    isAdminAuthenticated: false,
    adminUser: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadAuthFromStorage();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      const user = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      const isAdmin = ['admin', 'superadmin', 'staff'].includes(user.role);
      state.isAdminAuthenticated = isAdmin;
      if (isAdmin) {
        state.adminUser = { name: user.name, email: user.email, role: user.role };
        localStorage.setItem('tf_admin_v1', JSON.stringify(state.adminUser));
      } else {
        state.adminUser = null;
        localStorage.removeItem('tf_admin_v1');
      }
      localStorage.setItem('tf_user_v1', JSON.stringify(user));
    },

    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('tf_user_v1', JSON.stringify(state.user));
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.adminUser = null;
      state.isAuthenticated = false;
      state.isAdminAuthenticated = false;
      localStorage.removeItem('tf_user_v1');
      localStorage.removeItem('tf_admin_v1');
      localStorage.removeItem('tf_token_v1');
    },

    adminLoginSuccess: (state, action: PayloadAction<{ name: string; email: string; role: string }>) => {
      state.adminUser = action.payload;
      state.isAdminAuthenticated = ['admin', 'superadmin', 'staff'].includes(action.payload.role);
      localStorage.setItem('tf_admin_v1', JSON.stringify(action.payload));
    },

    adminLogout: (state) => {
      state.adminUser = null;
      state.isAdminAuthenticated = false;
      localStorage.removeItem('tf_admin_v1');
      if (state.user && ['admin', 'superadmin', 'staff'].includes(state.user.role)) {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('tf_user_v1');
        localStorage.removeItem('tf_token_v1');
      }
    },
  },
});

export const {
  loginSuccess,
  updateUserProfile,
  logoutUser,
  adminLoginSuccess,
  adminLogout,
} = authSlice.actions;

export default authSlice.reducer;
