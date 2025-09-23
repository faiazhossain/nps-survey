"use client";
import SurveyForm from "@/app/components/SurveyForm";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function NewSurvey() {
  return (
    <ProtectedRoute>
      <SurveyForm />
    </ProtectedRoute>
  );
}
