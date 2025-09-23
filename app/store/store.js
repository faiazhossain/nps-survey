import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import surveyReducer from "./surveySlice";
import surveyCreateReducer from "./surveyCreateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    surveyCreate: surveyCreateReducer,
  },
});
