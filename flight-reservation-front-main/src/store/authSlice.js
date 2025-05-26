import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    email: null,
    accessToken: null,
    user: null,
    isAdmin: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { email, accessToken, userId, admin } = action.payload;

            state.isLoggedIn = true;
            state.email = email;
            state.accessToken = accessToken;
            state.user = userId;
            state.isAdmin = admin || false;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("email", email);
            localStorage.setItem("user", JSON.stringify(userId));
            localStorage.setItem("isAdmin", JSON.stringify(admin));
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.email = null;
            state.accessToken = null;
            state.user = null;
            state.isAdmin = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("email");
            localStorage.removeItem("user");
            localStorage.removeItem("isAdmin");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;