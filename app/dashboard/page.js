'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import { logout } from '../utils/auth';
import { useRouter } from 'next/navigation';
import { fetchUserProfile, clearAuth } from '../store/authSlice';
import { fetchSurveyStats } from '../store/surveySlice';
import { createSurvey, resetCreateState } from '../store/surveyCreateSlice';
import { CgLogOut } from 'react-icons/cg';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    user,
    isLoading: userLoading,
    error: userError,
  } = useSelector((state) => state.auth);
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useSelector((state) => state.survey);
  const {
    isLoading: createLoading,
    error: createError,
    success: createSuccess,
    currentSurveyId,
  } = useSelector((state) => state.surveyCreate);

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };

  useEffect(() => {
    // Fetch user profile and survey stats when dashboard loads
    if (!user) {
      dispatch(fetchUserProfile());
    }
    dispatch(fetchSurveyStats());
  }, [dispatch, user]);

  useEffect(() => {
    // Handle successful survey creation
    if (createSuccess && currentSurveyId) {
      dispatch(fetchSurveyStats()); // Refresh stats
      router.push(`/survey/new?id=${currentSurveyId}`); // Navigate with survey ID
      // Don't reset state immediately to allow navigation to complete
    }
  }, [createSuccess, currentSurveyId, dispatch, router]);

  const handleLogout = () => {
    logout();
    dispatch(clearAuth());
    router.push('/auth/login');
  };

  const handleStartNewSurvey = async () => {
    try {
      // Reset any previous state
      dispatch(resetCreateState());

      // Create survey and wait for completion
      const result = await dispatch(createSurvey({}));

      if (createSurvey.fulfilled.match(result)) {
        // Survey created successfully, navigate immediately
        const surveyId = result.payload.survey_id; // Use survey_id from API response
        router.push(`/survey/new?id=${surveyId}`);
        dispatch(fetchSurveyStats()); // Refresh stats after navigation
      } else {
        // If API fails, still allow navigation to survey form
        console.error('Survey creation failed, navigating anyway');
        router.push('/survey/new');
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      // Fallback: navigate to survey form even if API fails
      router.push('/survey/new');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Dhaka',
    };
    return date.toLocaleDateString('bn-BD', options);
  };

  // Get user type in Bengali
  const getUserTypeBangla = (userType) => {
    switch (userType) {
      case 'surveyer':
        return 'সার্ভেয়ার';
      case 'admin':
        return 'অ্যাডমিন';
      case 'superadmin':
        return 'সুপার অ্যাডমিন';
      default:
        return userType;
    }
  };

  // Convert numbers to Bengali numerals
  const toBengaliNumerals = (num) => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[digit]);
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen p-4 space-y-6'>
        <motion.div
          className='flex items-center justify-between p-4 bg-white rounded-lg shadow'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src='/images/nps_logo.png'
            alt='Profile'
            width={78}
            height={24}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className='px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded'
          >
            <CgLogOut className='text-2xl'></CgLogOut>
          </button>
        </motion.div>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                className='fixed inset-0 bg-black z-40'
                variants={backdropVariants}
                initial='hidden'
                animate='visible'
                exit='hidden'
                transition={{ duration: 0.3 }}
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                className='fixed inset-0 flex items-center justify-center z-50 px-4'
                variants={modalVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ duration: 0.3 }}
              >
                <div className='bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-800 text-center'>
                    লগআউট নিশ্চিত করুন
                  </h2>
                  <p className='text-sm text-gray-600 text-center'>
                    আপনি কি সত্যিই লগআউট করতে চান?
                  </p>
                  <div className='flex justify-between gap-4'>
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      className='flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      না
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setIsModalOpen(false);
                      }}
                      className='flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      লগআউট
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src='/images/profile.png'
            alt='Profile'
            width={52}
            height={52}
            className='rounded-full'
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {userLoading ? (
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-24'></div>
              </div>
            ) : user ? (
              <>
                <h2 className='text-xl font-semibold'>{user.name}</h2>
                <p className='text-sm text-[#636970]'>
                  {getUserTypeBangla(user.user_type)} • ফোন: {user.phone}
                </p>
                <p className='text-sm text-[#636970]'>{user.email}</p>
                <p className='text-xs text-[#636970]'>
                  যোগদান: {formatDate(user.created_at)}
                </p>
              </>
            ) : (
              <>
                <h2 className='text-xl font-semibold'>ব্যবহারকারী</h2>
                <p className='text-sm text-[#636970]'>প্রোফাইল লোড হচ্ছে...</p>
              </>
            )}
          </motion.div>
        </motion.div>

        {(userError || statsError || createError) && (
          <motion.div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {userError && `প্রোফাইল লোড করতে সমস্যা: ${userError}`}
            {statsError && `পরিসংখ্যান লোড করতে সমস্যা: ${statsError}`}
            {createError && `সার্ভে তৈরিতে সমস্যা: ${createError}`}
          </motion.div>
        )}

        <motion.div
          className='grid grid-cols-2 gap-4'
          initial='hidden'
          animate='visible'
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            className='bg-white p-4 rounded-lg shadow space-y-2'
            variants={cardVariants}
          >
            <div className='p-4 rounded-lg bg-green-200 w-fit'>
              <Image
                src='/images/serveyLogo/docadd.png'
                alt='docadd'
                width={20}
                height={20}
              />
            </div>
            <p className='text-sm text-[#636970]'>আপনার মোট সার্ভে</p>
            {statsLoading ? (
              <div className='animate-pulse h-8 bg-gray-200 rounded w-16'></div>
            ) : (
              <p className='text-2xl font-bold'>
                {toBengaliNumerals(stats.total_surveys)}
              </p>
            )}
          </motion.div>
          <motion.div
            className='bg-white p-4 rounded-lg shadow space-y-2'
            variants={cardVariants}
          >
            <div className='p-4 rounded-lg bg-blue-200 w-fit'>
              <Image
                src='/images/serveyLogo/check.png'
                alt='check'
                width={20}
                height={20}
              />
            </div>
            <p className='text-sm text-[#636970]'>অনুমোদিত সার্ভে</p>
            {statsLoading ? (
              <div className='animate-pulse h-8 bg-gray-200 rounded w-16'></div>
            ) : (
              <p className='text-2xl font-bold'>
                {toBengaliNumerals(stats.accepted_surveys)}
              </p>
            )}
          </motion.div>
          <motion.div
            className='bg-white p-4 rounded-lg shadow space-y-2'
            variants={cardVariants}
          >
            <div className='p-4 rounded-lg bg-red-200 w-fit'>
              <Image
                src='/images/serveyLogo/remove.png'
                alt='remove'
                width={20}
                height={20}
              />
            </div>
            <p className='text-sm text-[#636970]'>বাতিল সার্ভে</p>
            {statsLoading ? (
              <div className='animate-pulse h-8 bg-gray-200 rounded w-16'></div>
            ) : (
              <p className='text-2xl font-bold'>
                {toBengaliNumerals(stats.rejected_surveys)}
              </p>
            )}
          </motion.div>
          <motion.div
            className='bg-white p-4 rounded-lg shadow space-y-2'
            variants={cardVariants}
          >
            <div className='p-4 rounded-lg bg-orange-200 w-fit'>
              <Image
                src='/images/serveyLogo/add.png'
                alt='add'
                width={20}
                height={20}
              />
            </div>
            <p className='text-sm text-[#636970]'>অপেক্ষামান সার্ভে</p>
            {statsLoading ? (
              <div className='animate-pulse h-8 bg-gray-200 rounded w-16'></div>
            ) : (
              <p className='text-2xl font-bold'>
                {toBengaliNumerals(stats.pending_surveys)}
              </p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className='space-y-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.button
            onClick={handleStartNewSurvey}
            disabled={createLoading}
            className='block w-full text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed'
            whileHover={{ scale: createLoading ? 1 : 1.02 }}
            whileTap={{ scale: createLoading ? 1 : 0.98 }}
          >
            {createLoading ? 'সার্ভে তৈরি হচ্ছে...' : 'নতুন সার্ভে শুরু করুন'}
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href='/survey/history'
              className='block w-full text-center rounded-md bg-gradient-to-b from-[#DBFBF1] to-[#dbfbe9] px-4 py-3 text-green-700 hover:bg-gradient-to-b hover:from-[#d3fff1] hover:to-[#bcffee]'
            >
              আপনার সার্ভে হিস্ট্রি দেখুন
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
