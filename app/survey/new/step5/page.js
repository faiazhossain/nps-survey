'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep5 from '@/app/components/SurveyFormStep5';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NewSurveyStep5() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step6?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step6');
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step4?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step4');
    }
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep5 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
