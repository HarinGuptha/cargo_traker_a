import { configureStore } from '@reduxjs/toolkit';
import shipmentReducer from './slices/shipmentSlice';

export const store = configureStore({
  reducer: {
    shipments: shipmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
