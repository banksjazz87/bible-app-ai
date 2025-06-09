import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface LoggedInState {
	value: boolean;
}

const initialState: LoggedInState = {
    value: false
}

export const loginSlice = createSlice({
    name: 'isLoggedIn',
    initialState,
    reducers: {
        updateLoginStatus: state => {
            state.value = !state.value;
        },
        initializeLoginState: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        }, 
        setLoginState: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        }
    }
});

export const { updateLoginStatus, initializeLoginState, setLoginState } = loginSlice.actions;
export const selectLoggedInStatus = (state: RootState) => state.isLoggedIn.value;
export default loginSlice.reducer;