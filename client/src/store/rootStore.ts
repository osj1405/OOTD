import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import friendsReducer from './friendsSlice';

const rootStore = configureStore({ 
    reducer: {
        auth: authReducer,
        friends: friendsReducer
    },
})

export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch

export default rootStore