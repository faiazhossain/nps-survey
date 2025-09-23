"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated } from "../utils/auth";
import { setAuthState, fetchUserProfile } from "../store/authSlice";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated: reduxAuthState } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const hasToken = isAuthenticated();

    if (!hasToken) {
      router.push("/auth/login");
      return;
    }

    // Sync Redux state with token existence
    if (hasToken && !reduxAuthState) {
      dispatch(setAuthState(true));
      dispatch(fetchUserProfile());
    }
  }, [router, dispatch, reduxAuthState]);

  if (!isAuthenticated()) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#006747] mx-auto'></div>
          <p className='mt-4 text-gray-600'>লগইন যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return children;
}
