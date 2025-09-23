import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../utils/auth";

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://npsbd.xyz/api/me", {
        method: "GET",
        headers: {
          accept: "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthState, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
