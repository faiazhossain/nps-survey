"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function NewSurvey() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step when this page loads
    router.push("/survey/new/step1");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Redirecting to survey...</p>
      </div>
    </ProtectedRoute>
  );
}
