'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep6 from '@/app/components/SurveyFormStep6';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NewSurveyStep6() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step7?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step7');
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step5?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step5');
    }
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep6 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
