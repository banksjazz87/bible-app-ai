import { createSlice } from '@reduxjs/toolkit';
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
        }
    }
});

export const { updateLoginStatus } = loginSlice.actions;
export const selectLoggedInStatus = (state: RootState) => state.isLoggedIn.value;
export default loginSlice.reducer;