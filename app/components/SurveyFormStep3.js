'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthHeaders } from '../utils/auth';

export default function SurveyFormStep3({ onPrevious, onNext }) {
  const [demands, setDemands] = useState({
    দারিদ্র্যমুক্তি: 0,
    'উন্নত শিক্ষাব্যবস্থা': 0,
    'পরিবেশ দূষণ রোধ': 0,
    'উন্নত স্বাস্থ্যসেবা': 0,
    'উন্নত যোগাযোগ': 0,
    নিরাপত্তা: 0,
    কর্মসংস্থান: 0,
    'দ্রব্যমূল্য নিয়ন্ত্রন': 0,
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '' });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, error, updateSuccess } = useSelector(
    (state) => state.surveyCreate
  );

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Handle checkbox change
  const handleCheckboxChange = (demand) => {
    setDemands((prevDemands) => ({
      ...prevDemands,
      [demand]: prevDemands[demand] === 0 ? 1 : 0,
    }));
  };

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      setToast({
        show: true,
        message: 'সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।',
      });
      return;
    }

    // Check if at least one demand is selected
    const selectedDemands = Object.values(demands).filter(
      (value) => value === 1
    );
    if (selectedDemands.length === 0) {
      setToast({
        show: true,
        message: 'অনুগ্রহ করে অন্তত একটি চাওয়া নির্বাচন করুন।',
      });
      return;
    }

    // Prepare the demand details data
    const demandDetails = {
      demand_details: {
        'বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?': {
          ...demands,
        },
      },
    };

    try {
      // Send PATCH request to update survey with demand details
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(demandDetails),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log('Survey updated successfully with demands');

      // Navigate to next step after successful API call
      onNext();
    } catch (error) {
      console.error('Error updating survey:', error);
      setToast({
        show: true,
        message: 'সার্ভে আপডেট করতে সমস্যা হয়েছে।',
      });
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

  const checkboxVariants = {
    checked: { scale: 1.05 },
    unchecked: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
    },
  };

  const toastVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step3'
        className='min-h-screen p-4 max-w-3xl mx-auto relative'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              className='fixed top-4 transform -translate-x-1/2 w-11/12 max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-50'
              variants={toastVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <p className='text-sm text-center'>{toast.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Header */}
        <motion.div
          className='flex items-center gap-2 mb-6'
          variants={itemVariants}
        ></motion.div>

        {/* Form Header */}
        <motion.div
          className='flex justify-between items-center mb-8'
          variants={itemVariants}
        >
          <motion.h1
            className='text-2xl font-bold'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            সার্ভে ফর্ম
          </motion.h1>
          <motion.div
            className='bg-[#DBFBF1] px-2 py-1 rounded-md text-gray-600'
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            ধাপ ৩/৮
          </motion.div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            সার্ভে আপডেট করতে সমস্যা: {error}
          </motion.div>
        )}

        {/* Form Fields */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          className='space-y-6'
          variants={itemVariants}
        >
          <motion.div className='space-y-6' variants={containerVariants}>
            <motion.div variants={itemVariants} className='mb-4'>
              <h2 className='text-xl font-semibold mb-4'>
                বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি
                কি?
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.keys(demands).map((demand) => (
                  <motion.div
                    key={demand}
                    className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-green-50'
                    variants={itemVariants}
                    whileHover='hover'
                    animate={demands[demand] === 1 ? 'checked' : 'unchecked'}
                  >
                    <input
                      type='checkbox'
                      id={demand}
                      checked={demands[demand] === 1}
                      onChange={() => handleCheckboxChange(demand)}
                      className='w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <label
                      htmlFor={demand}
                      className='flex-grow cursor-pointer'
                    >
                      {demand}
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className='flex gap-4 justify-around pt-6'
            variants={itemVariants}
          >
            <motion.button
              type='button'
              onClick={onPrevious}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#DBFBF1] to-[#dbfbe9] px-4 py-3 text-green-700 hover:bg-gradient-to-b hover:from-[#d3fff1] hover:to-[#bcffee]'
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
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed'
              variants={buttonVariants}
              whileHover={isUpdating ? {} : 'hover'}
              whileTap={isUpdating ? {} : 'tap'}
            >
              {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরবর্তী ধাপে যান'}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
