'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep2 from '@/app/components/SurveyFormStep2';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { clearUpdateSuccess } from '@/app/store/surveyCreateSlice';

export default function NewSurveyStep2() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step3?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step3');
    }
  };

  // Handle navigation to previous step
  const handlePrevious = () => {
    console.log('🚀 ~ handlePrevious ~ currentSurveyId:', currentSurveyId);
    console.log('🚀 ~ handlePrevious ~ Navigating to step1');

    // Clear the updateSuccess state to prevent auto-forward navigation
    dispatch(clearUpdateSuccess());

    const targetUrl = currentSurveyId
      ? `/survey/new/step1?id=${currentSurveyId}`
      : '/survey/new/step1';

    console.log('🚀 ~ handlePrevious ~ Target URL:', targetUrl);
    router.push(targetUrl);
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep2 onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
