'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep3 from '@/app/components/SurveyFormStep3';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { clearUpdateSuccess } from '@/app/store/surveyCreateSlice';

export default function NewSurveyStep3() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step4?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step4');
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    // Clear the updateSuccess state to prevent auto-forward navigation
    dispatch(clearUpdateSuccess());

    if (currentSurveyId) {
      router.push(`/survey/new/step2?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step2');
    }
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep3 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
