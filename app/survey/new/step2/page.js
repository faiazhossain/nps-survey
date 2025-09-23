"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import SurveyFormStep2 from "@/app/components/SurveyFormStep2";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NewSurveyStep2() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step3?id=${currentSurveyId}`);
    } else {
      router.push("/survey/new/step3");
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    router.push("/survey/new/step1");
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep2 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
