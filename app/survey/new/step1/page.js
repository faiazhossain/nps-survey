'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SurveyForm from '@/app/components/SurveyForm';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { resetCreateState } from '@/app/store/surveyCreateSlice';

export default function NewSurveyStep1() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentSurveyId } = useSelector((state) => state.surveyCreate);

  // Handle navigation to next step
  const handleNext = () => {
    if (currentSurveyId) {
      router.push(`/survey/new/step2?id=${currentSurveyId}`);
    } else {
      router.push('/survey/new/step2');
    }
  };

  // Handle navigation back to dashboard
  const handlePrevious = () => {
    // Reset survey create state to avoid auto-redirect back to survey
    dispatch(resetCreateState());
    router.push('/dashboard');
  };

  return (
    <ProtectedRoute>
      <SurveyForm onNext={handleNext} onPrevious={handlePrevious} />
    </ProtectedRoute>
  );
}
