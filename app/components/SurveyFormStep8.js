"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAuthHeaders } from "../utils/auth";

export default function SurveyFormStep8({ onPrevious }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    publicWorks: "",
    popularParty: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating } = useSelector(
    (state) => state.surveyCreate
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!currentSurveyId) {
      alert("সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।");
      return;
    }

    if (!formData.publicWorks || !formData.popularParty) {
      alert("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }

    try {
      setLoading(true);
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
            candidate_work_details: {
              "সাধারণ মানুষের জন্য এই ব্যক্তি কি কি করেছেন?":
                formData.publicWorks,
              "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?":
                formData.popularParty,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log("Survey completed successfully");

      // Navigate to survey history page
      router.push("/survey/history");
    } catch (error) {
      console.error("Error submitting survey:", error);
      setError("সার্ভে জমা দিতে সমস্যা হয়েছে।");
    } finally {
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
        key='step8'
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
            ধাপ ৮/৮
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

        {/* Form Fields */}
        <motion.div className='space-y-6' variants={itemVariants}>
          <motion.div variants={itemVariants} className='mb-6'>
            <label htmlFor='publicWorks' className='block text-gray-700 mb-2'>
              সাধারণ মানুষের জন্য এই ব্যক্তি কি কি করেছেন?
            </label>
            <select
              id='publicWorks'
              name='publicWorks'
              value={formData.publicWorks}
              onChange={handleInputChange}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              required
            >
              <option value='' disabled></option>
              <option value='মসজিদ-মাদ্রাসা বা মন্দির নির্মান'>
                মসজিদ-মাদ্রাসা বা মন্দির নির্মান
              </option>
              <option value='মসজিদ-মাদ্রাসা বা মন্দির উন্নয়নে সহযোগিতা'>
                মসজিদ-মাদ্রাসা বা মন্দির উন্নয়নে সহযোগিতা
              </option>
              <option value='অসহায় মানুষকে আর্থিক সহযোগিতা'>
                অসহায় মানুষকে আর্থিক সহযোগিতা
              </option>
              <option value='অসহায় মানুষের চিকিৎসার ব্যবস্থা করে দেওয়া'>
                অসহায় মানুষের চিকিৎসার ব্যবস্থা করে দেওয়া
              </option>
              <option value='শিক্ষা প্রতিষ্ঠান নির্মান'>
                শিক্ষা প্রতিষ্ঠান নির্মান
              </option>
              <option value='অন্যান্য (উল্লেখ করুন)'>
                অন্যান্য (উল্লেখ করুন)
              </option>
            </select>
            {formData.publicWorks === "অন্যান্য (উল্লেখ করুন)" && (
              <textarea
                id='publicWorksOther'
                name='publicWorksOther'
                value={formData.publicWorksOther || ""}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] mt-2'
                placeholder='অন্যান্য কাজের বিবরণ লিখুন'
                required
              />
            )}
          </motion.div>

          <motion.div variants={itemVariants} className='mb-6'>
            <label htmlFor='popularParty' className='block text-gray-700 mb-2'>
              আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে
              জনপ্রিয়?
            </label>
            <select
              id='popularParty'
              name='popularParty'
              value={formData.popularParty}
              onChange={handleInputChange}
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              required
            >
              <option value='' disabled>
                একটি দল নির্বাচন করুন
              </option>
              {[
                "বিএনপি",
                "বাংলাদেশ জামায়াতে ইসলামী",
                "এনসিপি",
                "আওয়ামী লীগ",
                "জাতীয় পার্টি",
                "ওয়ার্কার্স পার্টি",
                "গণ অধিকার পরিষদ",
                "ইসলামী শাসনতন্ত্র আন্দোলন",
                "এলডিপি",
                "বাসদ",
                "জাসদ",
                "সিপিবি",
                "কল্যাণ পার্টি",
                "জাগপা",
                "জেপি",
                "বিজেপি",
                "জেএসডি",
                "জাতীয় দল",
                "অন্যান্য",
                "এখনোও বলতে পারছিনা",
              ].map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </motion.div>
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
            onClick={handleSubmit}
            disabled={loading || isUpdating}
            className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
            variants={buttonVariants}
            whileHover={loading || isUpdating ? {} : "hover"}
            whileTap={loading || isUpdating ? {} : "tap"}
          >
            {loading ? "জমা দেওয়া হচ্ছে..." : "ফর্ম জমা দিন"}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
