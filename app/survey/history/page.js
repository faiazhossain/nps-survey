"use client";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function SurveyHistory() {
  return (
    <ProtectedRoute>
      <div className='min-h-screen p-4'>
        <h1 className='text-2xl font-bold mb-4'>সার্ভে হিস্ট্রি</h1>
        {/* Survey history list will be implemented later */}
      </div>
    </ProtectedRoute>
  );
}
