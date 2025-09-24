"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

export default function SurveyFormStep7({ onPrevious, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");
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
    "মাদক বাণিজ্য": 0,
    "ঘুষ গ্রহণ": 0,
    সন্ত্রাস: 0,
    লুটপাট: 0,
  });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating } = useSelector(
    (state) => state.surveyCreate
  );

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      alert("সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।");
      return;
    }

    if (!selectedCandidate || !selectedRelation) {
      alert("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            selected_candidate_details: {
              "আপনি কিভাবে এই প্রার্থীকে চিনেন?": selectedRelation,
              "এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?": qualifications,
              "এই প্রার্থীর কোন খারাপ দিক জানেন অথবা শুনেছেন?": hasBadQualities
                ? "হ্যাঁ"
                : "না",
              ...(hasBadQualities && { "খারাপ দিক সমূহ": badQualities }),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log("Step 7 completed");

      onNext();
    } catch (error) {
      console.error("Error in step 7:", error);
      setError("ধাপ ৭ এ সমস্যা হয়েছে।");
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
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
        ease: "easeIn",
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
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
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
              {/* Add candidate options here */}
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
              <option value='পারিবারিক'>পারিবারিক</option>
              <option value='রাজনৈতিক'>রাজনৈতিক</option>
              <option value='ব্যক্তিগত'>ব্যক্তিগত</option>
              <option value='সামাজিক'>সামাজিক</option>
            </select>
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
              disabled={isUpdating}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
              variants={buttonVariants}
              whileHover={isUpdating ? {} : "hover"}
              whileTap={isUpdating ? {} : "tap"}
            >
              {isUpdating ? "সংরক্ষণ হচ্ছে..." : "পরবর্তী ধাপে যান"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
