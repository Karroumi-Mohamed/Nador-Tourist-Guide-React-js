import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import placesReducer from "./slices/placesSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        places: placesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['places/fetchPlaces/fulfilled'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
