import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  lastEvaluation?: string;
  domainProgress?: Record<string, number>;
}

interface ChildState {
  children: Child[];
  currentChild: Child | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: ChildState = {
  children: [],
  currentChild: null,
  loading: false,
  error: null,
};

// Actions asynchrones
export const fetchChildren = createAsyncThunk(
  'child/fetchChildren',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération des enfants');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const createChild = createAsyncThunk(
  'child/createChild',
  async (childData: { name: string; dateOfBirth: string; gender: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la création de l\'enfant');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const updateChild = createAsyncThunk(
  'child/updateChild',
  async ({ id, childData }: { id: string; childData: Partial<Child> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la mise à jour de l\'enfant');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const deleteChild = createAsyncThunk(
  'child/deleteChild',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la suppression de l\'enfant');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

// Slice
const childSlice = createSlice({
  name: 'child',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChild: (state, action: PayloadAction<Child>) => {
      state.currentChild = action.payload;
    },
    clearCurrentChild: (state) => {
      state.currentChild = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Children
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Child
      .addCase(createChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChild.fulfilled, (state, action) => {
        state.loading = false;
        state.children.push(action.payload);
      })
      .addCase(createChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Child
      .addCase(updateChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.children.findIndex(child => child.id === action.payload.id);
        if (index !== -1) {
          state.children[index] = action.payload;
        }
        if (state.currentChild?.id === action.payload.id) {
          state.currentChild = action.payload;
        }
      })
      .addCase(updateChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Child
      .addCase(deleteChild.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChild.fulfilled, (state, action) => {
        state.loading = false;
        state.children = state.children.filter(child => child.id !== action.payload);
        if (state.currentChild?.id === action.payload) {
          state.currentChild = null;
        }
      })
      .addCase(deleteChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentChild, clearCurrentChild } = childSlice.actions;
export default childSlice.reducer; 