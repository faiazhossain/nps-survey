"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAuthHeaders } from "../utils/auth";
import { setSelectedCandidates } from "../store/surveyCreateSlice";

export default function SurveyFormStep6({ onPrevious, onNext }) {
  const [localSelectedCandidates, setLocalSelectedCandidates] = useState({});
  const [error, setError] = useState("");

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "" });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, partyData } = useSelector(
    (state) => state.surveyCreate
  );

  // Initialize selected candidates when party data is available
  useEffect(() => {
    if (partyData && partyData.length > 0) {
      const initialSelections = {};
      partyData.forEach((party) => {
        initialSelections[party.name] = "";
      });
      setLocalSelectedCandidates(initialSelections);
    }
  }, [partyData]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Check if party data is available
  const hasPartyData = partyData && partyData.length > 0;

  // Transform party data to get all candidates for each party
  const transformedPartyData = hasPartyData
    ? partyData
        .map((party) => ({
          name: party.name,
          candidates: party.candidates
            .filter(
              (candidate) =>
                candidate.name &&
                candidate.name.trim() !== "" &&
                candidate.name !== "add_new"
            )
            .map((candidate) => candidate.name),
        }))
        .filter((party) => party.candidates.length > 0)
    : [];

  // Handle candidate selection
  const handleCandidateSelection = (partyName, candidateName) => {
    setLocalSelectedCandidates((prev) => ({
      ...prev,
      [partyName]: candidateName,
    }));
  };
  console.log(
    "🚀 ~ handleCandidateSelection ~ handleCandidateSelection:",
    handleCandidateSelection
  );

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      setToast({
        show: true,
        message: "সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।",
      });
      return;
    }

    // Debug logs
    console.log("Selected Candidates:", localSelectedCandidates);
    console.log("Transformed Party Data:", transformedPartyData);
    console.log("Party Data Keys:", Object.keys(localSelectedCandidates));

    // Check if every party has a selected candidate
    // Use transformedPartyData to ensure we're checking the right parties
    const allFieldsFilled = transformedPartyData.every((party) => {
      const isSelected =
        localSelectedCandidates[party.name] &&
        localSelectedCandidates[party.name].trim() !== "";
      console.log(
        `Party ${party.name}: ${
          isSelected ? "Selected" : "Not Selected"
        } - Value: "${localSelectedCandidates[party.name]}"`
      );
      return isSelected;
    });

    console.log("All Fields Filled:", allFieldsFilled);

    if (!allFieldsFilled) {
      setToast({
        show: true,
        message: "অনুগ্রহ করে প্রতিটি দলের জন্য একটি প্রার্থী নির্বাচন করুন।",
      });
      return;
    }

    // Prepare candidate details data
    const candidateDetailsData = {
      candidate_details: {
        দল: Object.entries(localSelectedCandidates)
          .filter(([partyName, candidateName]) => candidateName.trim() !== "")
          .map(([partyName, candidateName]) => ({
            [partyName]: candidateName,
          })),
      },
    };

    try {
      // Send PATCH request to update survey with selected candidates
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(candidateDetailsData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log("Survey updated successfully with selected candidates");

      // Dispatch selected candidates to Redux store
      dispatch(setSelectedCandidates(localSelectedCandidates));

      // Navigate to next step
      onNext();
    } catch (error) {
      console.error("Error updating survey:", error);
      setToast({
        show: true,
        message: "সার্ভে আপডেট করতে সমস্যা হয়েছে।",
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
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
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step6'
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
            ধাপ ৬/৮
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

        {/* No Party Data Message */}
        {!hasPartyData && (
          <motion.div
            className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            কোন দলের তথ্য পাওয়া যায়নি। আগের ধাপে ফিরে গিয়ে দল ও প্রার্থী যোগ
            করুন।
          </motion.div>
        )}

        {/* Main Content */}
        {hasPartyData && transformedPartyData.length > 0 && (
          <motion.div className='space-y-6' variants={itemVariants}>
            {/* Section Title */}
            <motion.h2
              className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6'
              variants={itemVariants}
            >
              আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?
            </motion.h2>

            {/* Party Cards */}
            <div className='space-y-4 sm:space-y-6'>
              {transformedPartyData.map((party, partyIndex) => (
                <motion.div
                  key={party.name}
                  className='bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm'
                  variants={cardVariants}
                  initial='hidden'
                  animate='visible'
                  whileHover='hover'
                >
                  {/* Party Name */}
                  <div className='mb-3 sm:mb-4'>
                    <label className='block text-base sm:text-lg font-semibold text-gray-800 mb-2'>
                      দলের নামঃ {party.name}
                    </label>
                  </div>

                  {/* Candidate Selection */}
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      প্রার্থীর নাম
                    </label>

                    {/* Mobile Layout - Dropdown */}
                    <div className='sm:hidden'>
                      <select
                        value={localSelectedCandidates[party.name] || ""}
                        onChange={(e) =>
                          handleCandidateSelection(party.name, e.target.value)
                        }
                        className='w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      >
                        <option value=''>প্রার্থী নির্বাচন করুন</option>
                        {party.candidates.map((candidate, index) => (
                          <option key={index} value={candidate}>
                            {candidate}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desktop Layout - Radio buttons */}
                    <div className='hidden sm:block'>
                      <div className='space-y-2'>
                        {party.candidates.map((candidate, index) => (
                          <label
                            key={index}
                            className='flex items-center space-x-3 cursor-pointer'
                          >
                            <input
                              type='radio'
                              name={`party_${party.name}`}
                              value={candidate}
                              checked={
                                localSelectedCandidates[party.name] ===
                                candidate
                              }
                              onChange={(e) =>
                                handleCandidateSelection(
                                  party.name,
                                  e.target.value
                                )
                              }
                              className='w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500'
                            />
                            <span className='text-sm text-gray-700'>
                              {candidate}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Selected candidate display for mobile */}
                    {localSelectedCandidates[party.name] && (
                      <div className='sm:hidden mt-2 p-2 bg-green-50 border border-green-200 rounded-md'>
                        <span className='text-sm text-green-700'>
                          নির্বাচিত: {localSelectedCandidates[party.name]}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

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
        )}
      </motion.div>
    </AnimatePresence>
  );
}
