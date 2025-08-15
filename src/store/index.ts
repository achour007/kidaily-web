import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import childReducer from './slices/childSlice';
import evaluationReducer from './slices/evaluationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    child: childReducer,
    evaluation: evaluationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 