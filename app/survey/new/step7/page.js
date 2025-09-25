'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep7 from '@/app/components/SurveyFormStep7';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NewSurveyStep7() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step8?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step8');
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step6?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step6');
    }
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep7 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
