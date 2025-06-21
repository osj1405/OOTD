import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { User } from "../types/User";

interface AuthState {
    supabaseSession: Session | null;
    backendJWTToken: string | null;
    user: User | null;
}
const initialState: AuthState = {
    supabaseSession: null,
    backendJWTToken: null,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession(state, action){
            state.supabaseSession = action.payload.supabaseSession;
            state.backendJWTToken = action.payload.backendJWTToken;
            state.user = action.payload.user;
        },
        logout(state){
            state.supabaseSession = null;
            state.backendJWTToken = null;
            state.user = null
        },
        setUser(state, action){
            state.user = action.payload.user;
        }
    }
})

export const {setSession, logout, setUser } = authSlice.actions;

export default authSlice.reducer;