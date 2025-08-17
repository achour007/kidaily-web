import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
interface QuestionAnswer {
  questionId: string;
  answer: string;
  notes?: string;
}

interface DomainScore {
  domain: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  answers: QuestionAnswer[];
}

interface Evaluation {
  id: string;
  childId: string;
  date: string;
  ageInMonths: number;
  domainScores: Record<string, DomainScore>;
  notes?: string;
  status: string;
  overallScore?: number;
}

interface EvaluationState {
  evaluations: Evaluation[];
  currentEvaluation: Evaluation | null;
  loading: boolean;
  error: string | null;
}

// État initial
const initialState: EvaluationState = {
  evaluations: [],
  currentEvaluation: null,
  loading: false,
  error: null,
};

// Actions asynchrones
export const fetchEvaluations = createAsyncThunk(
  'evaluation/fetchEvaluations',
  async ({ childId }: { childId?: string } = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const url = childId 
        ? `https://kidaily-backend-cb9a147c3208.herokuapp.com/api/evaluations?childId=${childId}`
        : 'https://kidaily-backend-cb9a147c3208.herokuapp.com/api/evaluations';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération des évaluations');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'evaluation/createEvaluation',
  async (evaluationData: {
    childId: string;
    ageInMonths: number;
    domainScores: Record<string, DomainScore>;
    notes?: string;
  }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/evaluations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la création de l\'évaluation');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluation/updateEvaluation',
  async ({ id, evaluationData }: { id: string; evaluationData: Partial<Evaluation> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/evaluations/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la mise à jour de l\'évaluation');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

export const deleteEvaluation = createAsyncThunk(
  'evaluation/deleteEvaluation',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('Token non disponible');
      }

      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/evaluations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la suppression de l\'évaluation');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Erreur de connexion au serveur');
    }
  }
);

// Slice
const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEvaluation: (state, action: PayloadAction<Evaluation>) => {
      state.currentEvaluation = action.payload;
    },
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = action.payload;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Evaluation
      .addCase(createEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations.push(action.payload);
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Evaluation
      .addCase(updateEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.evaluations.findIndex(evaluation => evaluation.id === action.payload.id);
        if (index !== -1) {
          state.evaluations[index] = action.payload;
        }
        if (state.currentEvaluation?.id === action.payload.id) {
          state.currentEvaluation = action.payload;
        }
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Evaluation
      .addCase(deleteEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = state.evaluations.filter(evaluation => evaluation.id !== action.payload);
        if (state.currentEvaluation?.id === action.payload) {
          state.currentEvaluation = null;
        }
      })
      .addCase(deleteEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentEvaluation, clearCurrentEvaluation } = evaluationSlice.actions;
export default evaluationSlice.reducer; 