import { Friends } from "../types/Friend";
import { createSlice } from "@reduxjs/toolkit";

interface FriendsState {
    followings: Friends[],
    followers: Friends[]
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
        },
        resetFriends(state){
            state.followings = []
            state.followers = []
        },
    }
})

export const { setFollowing, setFollower, resetFriends} = friendsSlice.actions;
export default friendsSlice.reducer;
