import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';

const rootStore = configureStore({ 
    reducer: {
        auth: authReducer,
    },
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export default rootStore