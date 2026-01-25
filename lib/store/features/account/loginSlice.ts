import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';

export interface UserDetails {
    isLoggedIn: boolean;
    userName: string | null;
    email: string | null;
    userRole: string | null;
    maxRequests: number | null;

}

const initialState: UserDetails = {
    isLoggedIn: false,
    userName: null,
    email: null,
    userRole: null,
    maxRequests: 0,
}

export const loginSlice = createSlice({
    name: 'isLoggedIn',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<UserDetails>) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userName = action.payload.userName;
            state.email = action.payload.email;
            state.userRole = action.payload.userRole;
            state.maxRequests = action.payload.maxRequests;
        }, 
        logoutUser: (state) => {
            state.isLoggedIn = false;
            state.userName = null;
            state.email = null;
        }
    }
});

export const { logoutUser, loginUser } = loginSlice.actions;
export const getUserData = (state: RootState) => state.loggedInData;
export default loginSlice.reducer;