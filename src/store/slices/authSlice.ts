import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserProfile } from '../../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialLoading = false;
    },
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setInitialLoading, logout } = authSlice.actions;
export default authSlice.reducer;
