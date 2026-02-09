import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, UserLogin, UserSignup } from "./types";
import { userLogin, userLogout, currentUser, userRegister } from "../../api/user.api";


export const signup = createAsyncThunk(
    "auth/register-user", 
    async (payload: UserSignup, thunkAPI) => {
        try {
            const response = await userRegister(payload);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed"
            return thunkAPI.rejectWithValue({message})
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (payload: UserLogin, thunkAPI) => {
        try {
            const response = await userLogin(payload);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed";
            return thunkAPI.rejectWithValue({message})
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    "auth/current-user",
    async (_, thunkAPI) => {
        try {
            const response = await currentUser();
            return response.data;
        } catch {
            return thunkAPI.rejectWithValue(null)
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout", 
    async (_, thunkAPI) => {
        try {
            await userLogout();    
            return null
        } catch (error: any) {
            return thunkAPI.rejectWithValue({message: "Logout failed"})
        }
})


const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        }
    },
    extraReducers:  (builder) => {
        builder
            // signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
            })

            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload?.user || null;
                state.isAuthenticated = true;
                state.loading = false;
            })

            .addCase(signup.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null
            })

            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload?.user || null;
                state.isAuthenticated = true;
                state.loading = false;
            })

            .addCase(login.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false
                state.user = null
            })

            // current user
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload?.user || null;
                state.isAuthenticated = true;
                state.loading = false
            })

            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            })

            //logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false
            });
    }
})

export const { clearAuth } = authSlice.actions
export default authSlice.reducer