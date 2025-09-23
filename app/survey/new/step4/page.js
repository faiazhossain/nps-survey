"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import SurveyFormStep4 from "@/app/components/SurveyFormStep4";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NewSurveyStep4() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step5?id=${currentSurveyId}`);
    } else {
      router.push("/survey/new/step5");
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    router.push("/survey/new/step3");
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep4 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
