"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SurveyForm from "@/app/components/SurveyForm";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NewSurveyStep1() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step2?id=${currentSurveyId}`);
    } else {
      router.push("/survey/new/step2");
    }
  };

  return (
    <ProtectedRoute>
      <SurveyForm onNext={handleNext} />
    </ProtectedRoute>
  );
}
