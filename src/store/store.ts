import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './slices/placesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    places: placesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
