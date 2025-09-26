import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthHeaders } from '../utils/auth';

// Async thunk for creating a new survey
export const createSurvey = createAsyncThunk(
  'surveyCreate/createSurvey',
  async (surveyData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://npsbd.xyz/api/surveys/', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create survey');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating survey with person details
export const updateSurveyWithPersonDetails = createAsyncThunk(
  'surveyCreate/updateSurveyWithPersonDetails',
  async ({ surveyId, personDetails }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${surveyId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            person_details: personDetails,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update survey');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating survey with location details
export const updateSurveyWithLocationDetails = createAsyncThunk(
  'surveyCreate/updateSurveyWithLocationDetails',
  async ({ surveyId, locationDetails }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${surveyId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            location_details: locationDetails,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 'Failed to update location details'
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const surveyCreateSlice = createSlice({
  name: 'surveyCreate',
  initialState: {
    isLoading: false,
    error: null,
    success: false,
    createdSurvey: null,
    currentSurveyId: null,
    isUpdating: false,
    updateSuccess: false,
    selectedSeatId: null, // Add selectedSeatId to store
    partyData: [], // Add partyData to store party information from Step 5
    selectedCandidates: {}, // Add selectedCandidates to store from Step 6
  },
  reducers: {
    clearCreateError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    resetCreateState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.createdSurvey = null;
      state.currentSurveyId = null;
      state.isUpdating = false;
      state.updateSuccess = false;
      state.selectedSeatId = null; // Reset the selectedSeatId
      state.partyData = []; // Reset the partyData
      state.selectedCandidates = {}; // Reset the selectedCandidates
    },
    setCurrentSurveyId: (state, action) => {
      state.currentSurveyId = action.payload;
    },
    setSelectedSeatId: (state, action) => {
      // Add new action to set the selectedSeatId
      state.selectedSeatId = action.payload;
    },
    setPartyData: (state, action) => {
      // Add new action to set the partyData
      state.partyData = action.payload;
    },
    setSelectedCandidates: (state, action) => {
      // Add new action to set the selectedCandidates from Step 6
      state.selectedCandidates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSurvey.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSurvey.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.createdSurvey = action.payload;
        state.currentSurveyId = action.payload.survey_id; // Use survey_id from API response
        state.error = null;
      })
      .addCase(createSurvey.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateSurveyWithPersonDetails.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateSurveyWithPersonDetails.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        state.createdSurvey = action.payload;
        state.error = null;
      })
      .addCase(updateSurveyWithPersonDetails.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      .addCase(updateSurveyWithLocationDetails.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateSurveyWithLocationDetails.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        state.createdSurvey = action.payload;
        state.error = null;
      })
      .addCase(updateSurveyWithLocationDetails.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const {
  clearCreateError,
  clearUpdateSuccess,
  resetCreateState,
  setCurrentSurveyId,
  setSelectedSeatId, // Export the new action
  setPartyData, // Export the new action
  setSelectedCandidates, // Export the new action
} = surveyCreateSlice.actions;
export default surveyCreateSlice.reducer;
