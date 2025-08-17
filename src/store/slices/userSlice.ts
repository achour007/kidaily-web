import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profession?: string;
  organization?: string;
  bio?: string;
  language?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Actions asynchrones
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la mise à jour du profil');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setProfile } = userSlice.actions;
export default userSlice.reducer; 