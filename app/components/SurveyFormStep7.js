'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthHeaders } from '../utils/auth';

export default function SurveyFormStep7({ onPrevious, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [customRelation, setCustomRelation] = useState(''); // For "অন্যভাবে" option
  const [qualifications, setQualifications] = useState({
    সততা: 0,
    আদর্শবান: 0,
    দেশপ্রেমিক: 0,
    উচ্চশিক্ষিত: 0,
    জনপ্রিয়: 0,
    দূরদর্শিতা: 0,
    সত্যবাদী: 0,
    রুচিশীল: 0,
    মানবিক: 0,
  });
  const [hasBadQualities, setHasBadQualities] = useState(null);
  const [badQualities, setBadQualities] = useState({
    দূর্নীতি: 0,
    চাঁদাবাজি: 0,
    দখলদারিত্ব: 0,
    হয়রানি: 0,
    'মাদক বাণিজ্য': 0,
    'ঘুষ গ্রহণ': 0,
    সন্ত্রাস: 0,
    লুটপাট: 0,
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '' });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, selectedCandidates } = useSelector(
    (state) => state.surveyCreate
  );

  // Get all selected candidates from Step 6 for the dropdown options
  const candidateOptions = selectedCandidates
    ? Object.values(selectedCandidates).filter(
        (candidate) => candidate && candidate.trim() !== ''
      )
    : [];

  // Relation options
  const relationOptions = [
    'ক. ব্যক্তিগতভাবে',
    'খ. গণমাধ্যম',
    'গ. সামাজিক গণমাধ্যম (ফেইসবুক / ইউটিউব)',
    'ঘ. রাজনৈতিক মিছিল / অনুষ্ঠানে',
    'ঙ. অন্যভাবে (উল্লেখ করুন)',
  ];

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      setToast({
        show: true,
        message: 'সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।',
      });
      return;
    }

    if (!selectedCandidate || !selectedRelation.trim()) {
      setToast({
        show: true,
        message: 'অনুগ্রহ করে সব তথ্য পূরণ করুন।',
      });
      return;
    }

    // Check if "অন্যভাবে" is selected but custom text is not provided
    if (
      selectedRelation === 'ঙ. অন্যভাবে (উল্লেখ করুন)' &&
      !customRelation.trim()
    ) {
      setToast({
        show: true,
        message: 'অনুগ্রহ করে বিস্তারিত লিখুন।',
      });
      return;
    }

    if (hasBadQualities === null) {
      setToast({
        show: true,
        message: 'অনুগ্রহ করে হ্যাঁ বা না নির্বাচন করুন।',
      });
      return;
    }

    // Check if at least one qualification is selected
    const selectedQualifications = Object.values(qualifications).filter(
      (value) => value === 1
    );
    if (selectedQualifications.length === 0) {
      setToast({
        show: true,
        message: 'অনুগ্রহ করে অন্তত একটি যোগ্যতা নির্বাচন করুন।',
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            selected_candidate_details: {
              'এদের মধ্যে কাকে বেশী যোগ্য বলে মনে হয়?': selectedCandidate,
              'আপনি কিভাবে এই প্রার্থীকে চিনেন?':
                selectedRelation === 'ঙ. অন্যভাবে (উল্লেখ করুন)'
                  ? customRelation
                  : selectedRelation,
              'এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?': {
                সততা: qualifications.সততা,
                মানবিক: qualifications.মানবিক,
                রুচিশীল: qualifications.রুচিশীল,
                আদর্শবান: qualifications.আদর্শবান,
                জনপ্রিয়: qualifications.জনপ্রিয়,
                সত্যবাদী: qualifications.সত্যবাদী,
                দূরদর্শিতা: qualifications.দূরদর্শিতা,
                দেশপ্রেম: qualifications.দেশপ্রেমিক,
                উচ্চশিক্ষিত: qualifications.উচ্চশিক্ষিত,
              },
              'এই প্রার্থীর কোন খারাপ দিক জানেন অথবা শুনেছেন?': badQualities,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log('Step 7 completed');

      setLoading(false);
      onNext();
    } catch (error) {
      console.error('Error in step 7:', error);
      setToast({
        show: true,
        message: 'ধাপ ৭ এ সমস্যা হয়েছে।',
      });
      setLoading(false);
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
        key='step7'
        className='min-h-screen p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto relative'
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
          className='flex items-center gap-2 mb-4 sm:mb-6'
          variants={itemVariants}
        ></motion.div>

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
          {/* Candidate Selection */}
          <motion.div variants={itemVariants} className='mb-6'>
            <label htmlFor='candidate' className='block text-gray-700 mb-2'>
              এদের মধ্যে কাকে বেশী যোগ্য বলে মনে হয়?
            </label>
            <select
              id='candidate'
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              required
            >
              <option value=''>নির্বাচন করুন</option>
              {candidateOptions.map((candidate, index) => (
                <option key={index} value={candidate}>
                  {candidate}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Relation Selection */}
          <motion.div variants={itemVariants} className='mb-6'>
            <label htmlFor='relation' className='block text-gray-700 mb-2'>
              আপনি কিভাবে এই প্রার্থীকে চিনেন?
            </label>
            <select
              id='relation'
              value={selectedRelation}
              onChange={(e) => setSelectedRelation(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              required
            >
              <option value=''>নির্বাচন করুন</option>
              {relationOptions.map((relation, index) => (
                <option key={index} value={relation}>
                  {relation}
                </option>
              ))}
            </select>
            {selectedRelation === 'ঙ. অন্যভাবে (উল্লেখ করুন)' && (
              <textarea
                id='customRelation'
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-20 mt-3'
                required
                placeholder='এই প্রার্থীকে চেনার বিবরণ লিখুন...'
              />
            )}
          </motion.div>

          {/* Qualifications Checkboxes */}
          <motion.div variants={itemVariants} className='mb-6'>
            <h3 className='text-gray-700 mb-3'>
              এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {Object.keys(qualifications).map((quality) => (
                <motion.div
                  key={quality}
                  className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-green-50'
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type='checkbox'
                    id={quality}
                    checked={qualifications[quality] === 1}
                    onChange={() =>
                      setQualifications((prev) => ({
                        ...prev,
                        [quality]: prev[quality] === 0 ? 1 : 0,
                      }))
                    }
                    className='w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500'
                  />
                  <label htmlFor={quality} className='flex-grow cursor-pointer'>
                    {quality}
                  </label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bad Qualities Section */}
          <motion.div variants={itemVariants} className='mb-6'>
            <h3 className='text-gray-700 mb-3'>
              এই প্রার্থীর কোন খারাপ দিক জানেন অথবা শুনেছেন?
            </h3>
            <div className='flex gap-4 mb-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='radio'
                  name='hasBadQualities'
                  checked={hasBadQualities === true}
                  onChange={() => setHasBadQualities(true)}
                  className='w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500'
                />
                <span>হ্যাঁ</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input
                  type='radio'
                  name='hasBadQualities'
                  checked={hasBadQualities === false}
                  onChange={() => setHasBadQualities(false)}
                  className='w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500'
                />
                <span>না</span>
              </label>
            </div>

            {hasBadQualities && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='grid grid-cols-1 md:grid-cols-2 gap-3'
              >
                {Object.keys(badQualities).map((quality) => (
                  <motion.div
                    key={quality}
                    className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-red-50'
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type='checkbox'
                      id={`bad_${quality}`}
                      checked={badQualities[quality] === 1}
                      onChange={() =>
                        setBadQualities((prev) => ({
                          ...prev,
                          [quality]: prev[quality] === 0 ? 1 : 0,
                        }))
                      }
                      className='w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500'
                    />
                    <label
                      htmlFor={`bad_${quality}`}
                      className='flex-grow cursor-pointer'
                    >
                      {quality}
                    </label>
                  </motion.div>
                ))}
              </motion.div>
            )}
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
              disabled={loading || isUpdating}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
              variants={buttonVariants}
              whileHover={loading || isUpdating ? {} : 'hover'}
              whileTap={loading || isUpdating ? {} : 'tap'}
            >
              {loading || isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরবর্তী ধাপে যান'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
