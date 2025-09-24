'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

export default function SurveyFormStep7({ onPrevious, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating } = useSelector(
    (state) => state.surveyCreate
  );

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      alert('সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।');
      return;
    }

    try {
      // Here you can add API call for step 7 if needed
      console.log('Step 7 completed');
      
      // Navigate to next step
      onNext();
    } catch (error) {
      console.error('Error in step 7:', error);
      alert('ধাপ ৭ এ সমস্যা হয়েছে।');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step7'
        className='min-h-screen p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {/* Location Header */}
        <motion.div
          className='flex items-center gap-2 mb-4 sm:mb-6'
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src='/images/serveyLogo/mapPoint.png'
              alt='Location'
              width={20}
              height={20}
              className='sm:w-6 sm:h-6'
            />
          </motion.div>
          <div>
            <p className='text-sm sm:text-base text-gray-600'>
              বর্তমান অবস্থান
            </p>
            <p className='text-sm sm:text-base font-medium'>
              ব্রাহ্মনবাড়িয়া পুলিশ লাইনস
            </p>
          </div>
        </motion.div>

        {/* Form Header */}
        <motion.div
          className='flex justify-between items-center mb-6 sm:mb-8'
          variants={itemVariants}
        >
          <motion.h1
            className='text-xl sm:text-2xl font-bold'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            সার্ভে ফর্ম
          </motion.h1>
          <motion.div
            className='bg-[#DBFBF1] px-2 py-1 rounded-md text-gray-600 text-sm sm:text-base'
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            ধাপ ৭/৮
          </motion.div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div className='space-y-6' variants={itemVariants}>
          {/* Section Title */}
          <motion.h2
            className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center'
            variants={itemVariants}
          >
            ধাপ ৭ - আসছে শীঘ্রই
          </motion.h2>

          {/* Placeholder Content */}
          <motion.div 
            className='bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm text-center'
            variants={itemVariants}
          >
            <div className='mb-6'>
              <Image
                src='/images/serveyLogo/check.png'
                alt='Coming Soon'
                width={64}
                height={64}
                className='mx-auto mb-4'
              />
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                এই ধাপটি শীঘ্রই যোগ করা হবে
              </h3>
              <p className='text-gray-600'>
                আমরা এই বিভাগে কাজ করছি। দয়া করে পরবর্তী ধাপে এগিয়ে যান।
              </p>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-around pt-4 sm:pt-6'
            variants={itemVariants}
          >
            <motion.button
              type='button'
              onClick={onPrevious}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#DBFBF1] to-[#dbfbe9] px-4 py-3 text-green-700 hover:bg-gradient-to-b hover:from-[#d3fff1] hover:to-[#bcffee] text-sm sm:text-base'
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
            >
              আগের ধাপ
            </motion.button>
            <motion.button
              type='button'
              onClick={handleNext}
              disabled={isUpdating}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
              variants={buttonVariants}
              whileHover={isUpdating ? {} : 'hover'}
              whileTap={isUpdating ? {} : 'tap'}
            >
              {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরবর্তী ধাপে যান'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}