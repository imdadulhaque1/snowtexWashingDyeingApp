import {configureStore} from '@reduxjs/toolkit';
import payrollApi from '@rtk/features/api/apiSlice';

const store = configureStore({
  reducer: {
    [payrollApi.reducerPath]: payrollApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV !== 'production',
    }).concat(payrollApi.middleware),
});

export default store;
