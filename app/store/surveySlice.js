import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "../utils/auth";

// Async thunk for fetching survey statistics
export const fetchSurveyStats = createAsyncThunk(
  "survey/fetchSurveyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://npsbd.xyz/api/surveys/stats/mine", {
        method: "GET",
        headers: {
          accept: "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch survey statistics");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    stats: {
      total_surveys: 0,
      accepted_surveys: 0,
      pending_surveys: 0,
      rejected_surveys: 0,
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSurveyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSurveyStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSurveyStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchSurveyStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSurveyError } = surveySlice.actions;
export default surveySlice.reducer;
