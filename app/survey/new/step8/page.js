'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import SurveyFormStep8 from '@/app/components/SurveyFormStep8';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NewSurveyStep8() {
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to previous step
  const handlePrevious = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step7?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step7');
    }
  };

  return (
    <ProtectedRoute>
      <SurveyFormStep8 onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
