'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthHeaders } from '../utils/auth';

export default function SurveyFormStep3({ onPrevious, onNext }) {
  const [selectedParty, setSelectedParty] = useState('');

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, error, updateSuccess } = useSelector(
    (state) => state.surveyCreate
  );

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
      alert('সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।');
      return;
    }

    if (!selectedParty) {
      alert('দয়া করে একটি রাজনৈতিক দল নির্বাচন করুন।');
      return;
    }

    // Prepare the demand details data
    const worthful_party_name = {
      worthful_party_name: selectedParty,
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
          body: JSON.stringify(worthful_party_name),
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
      alert('সার্ভে আপডেট করতে সমস্যা হয়েছে।');
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

  // List of Bangladeshi political parties in Bengali
  const politicalParties = [
    'বাংলাদেশ আওয়ামী লীগ',
    'বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)',
    'জাতীয় পার্টি (জাপা)',
    'জাতীয় পার্টি (মঞ্জু)',
    'বাংলাদেশের কমিউনিস্ট পার্টি',
    'বাংলাদেশের কমিউনিস্ট পার্টি (মার্কসবাদী-লেনিনবাদী)',
    'বাংলাদেশের সমাজতান্ত্রিক দল',
    'বাংলাদেশের ওয়ার্কার্স পার্টি',
    'বাংলাদেশের সাম্যবাদী দল (মার্কসবাদী-লেনিনবাদী)',
    'ইসলামী ফ্রন্ট বাংলাদেশ',
    'কৃষক শ্রমিক জনতা লীগ',
    'গণতন্ত্রী দল',
    'লিবারেল ডেমোক্রেটিক পার্টি',
    'জাতীয় সমাজতান্ত্রিক দল',
    'ইসলামী ঐক্য জোট',
    'বাংলাদেশ সম্যবাদী দল (মার্কসবাদী-লেনিনবাদী) (বড়ুয়া)',
    'বাংলাদেশ জাতীয় সমাজতান্ত্রিক দল',
    'জাতীয় বামপন্থী সমাজতান্ত্রিক দল',
    'বাংলাদেশের বিপ্লবী ওয়ার্কার্স পার্টি',
    'খেলাফত মজলিস',
    'বাংলাদেশ ফ্রিডম পার্টি',
    'বাংলাদেশ ন্যাশনাল আওয়ামী পার্টি',
    'বাংলাদেশ খেলাফত মজলিস',
    'ইসলামী আন্দোলন বাংলাদেশ',
    'বাংলাদেশ ইসলামী ফ্রন্ট',
    'বাংলাদেশ জামায়াতে ইসলামী',
    'গণফ্রন্ট',
    'জাতীয় জোট',
    'অন্যান্য',
  ];

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step3'
        className='min-h-screen p-4 max-w-3xl mx-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {/* Location Header */}
        <motion.div
          className='flex items-center gap-2 mb-6'
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src='/images/serveyLogo/mapPoint.png'
              alt='Location'
              width={24}
              height={24}
            />
          </motion.div>
          <div>
            <p className='text-gray-600'>বর্তমান অবস্থান</p>
            <p className='font-medium'>ব্রাহ্মনবাড়িয়া পুলিশ লাইনস</p>
          </div>
        </motion.div>

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
            ধাপ ৪/৮
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
                আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?
              </h2>
              <div className='relative'>
                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                >
                  <option value=''>একটি দল নির্বাচন করুন</option>
                  {politicalParties.map((party, index) => (
                    <option key={index} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
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
              disabled={isUpdating || !selectedParty}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed'
              variants={buttonVariants}
              whileHover={isUpdating || !selectedParty ? {} : 'hover'}
              whileTap={isUpdating || !selectedParty ? {} : 'tap'}
            >
              {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরবর্তী ধাপে যান'}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
