import { Friends } from "../types/Friend";
import { createSlice } from "@reduxjs/toolkit";

interface FriendsState {
    followings: Friends[] | null,
    followers: Friends[] | null,
}

const initialState: FriendsState = {
    followings: [],
    followers: []
}

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setFollowing(state, action){
            state.followings = action.payload
        },
        setFollower(state, action){
            state.followers = action.payload
        }
    }
})

export const { setFollowing, setFollower } = friendsSlice.actions;
export default friendsSlice.reducer;
