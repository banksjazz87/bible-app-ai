import { configureStore } from "@reduxjs/toolkit";
import loginSlice from '../store/features/account/loginSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            isLoggedIn: loginSlice
        }
    });
}

//Define our types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];