import { createSlice } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { User } from "../types/User";

interface AuthState {
    supabaseSession: Session | null;
    backendJWTToken: string | null;
    user: User | null;
    initialized: boolean;
}
const initialState: AuthState = {
    supabaseSession: null,
    backendJWTToken: null,
    user: null,
    initialized: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession(state, action){
            state.supabaseSession = action.payload.supabaseSession;
            state.backendJWTToken = action.payload.backendJWTToken;
            state.user = action.payload.user;
            state.initialized = true;
        },
        logout(state){
            state.supabaseSession = null;
            state.backendJWTToken = null;
            state.user = null
            state.initialized = true;
        },
        setUser(state, action){
            state.user = action.payload.user;
        },
        setInitialized(state, action){
            state.initialized = action.payload;
        },
    }
})

export const {setSession, logout, setUser, setInitialized } = authSlice.actions;

export default authSlice.reducer;
