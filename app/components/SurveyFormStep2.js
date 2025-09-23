"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateSurveyWithLocationDetails } from "../store/surveyCreateSlice";

export default function SurveyFormStep2({ onPrevious, onNext }) {
  const [formData, setFormData] = useState({
    division: "",
    district: "",
    thana: "",
    constituency: "",
    union: "",
    ward: "",
  });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, error, updateSuccess } = useSelector(
    (state) => state.surveyCreate
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle successful update
  useEffect(() => {
    if (updateSuccess) {
      onNext();
    }
  }, [updateSuccess, onNext]);

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      alert("সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।");
      return;
    }

    // Validate required fields
    if (
      !formData.division ||
      !formData.district ||
      !formData.thana ||
      !formData.constituency ||
      !formData.union ||
      !formData.ward
    ) {
      alert("অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন।");
      return;
    }

    const locationDetails = {
      বিভাগ: formData.division,
      জেলা: formData.district,
      থানা: formData.thana,
      আসন: formData.constituency,
      ইউনিয়ন: formData.union,
      ওয়ার্ড: formData.ward,
    };

    dispatch(
      updateSurveyWithLocationDetails({
        surveyId: currentSurveyId,
        locationDetails,
      })
    );
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

  const selectVariants = {
    focus: {
      scale: 1.01,
      boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step2'
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
            ধাপ ২/৮
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
          <motion.div className='space-y-4' variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <label htmlFor='division' className='block text-gray-700 mb-2'>
                বিভাগ *
              </label>
              <motion.select
                id='division'
                name='division'
                value={formData.division}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
                required
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='ঢাকা'>ঢাকা</option>
                <option value='চট্টগ্রাম'>চট্টগ্রাম</option>
                <option value='রাজশাহী'>রাজশাহী</option>
                <option value='খুলনা'>খুলনা</option>
                <option value='বরিশাল'>বরিশাল</option>
                <option value='সিলেট'>সিলেট</option>
                <option value='রংপুর'>রংপুর</option>
                <option value='ময়মনসিংহ'>ময়মনসিংহ</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='district' className='block text-gray-700 mb-2'>
                জেলা *
              </label>
              <motion.select
                id='district'
                name='district'
                value={formData.district}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
                required
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='ঢাকা'>ঢাকা</option>
                <option value='ব্রাহ্মনবাড়িয়া'>ব্রাহ্মনবাড়িয়া</option>
                <option value='চট্টগ্রাম'>চট্টগ্রাম</option>
                <option value='কুমিল্লা'>কুমিল্লা</option>
                <option value='সিলেট'>সিলেট</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='thana' className='block text-gray-700 mb-2'>
                থানা *
              </label>
              <motion.select
                id='thana'
                name='thana'
                value={formData.thana}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
                required
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='গুলশান'>গুলশান</option>
                <option value='ব্রাহ্মনবাড়িয়া সদর'>
                  ব্রাহ্মনবাড়িয়া সদর
                </option>
                <option value='কসবা'>কসবা</option>
                <option value='নাসিরনগর'>নাসিরনগর</option>
                <option value='সরাইল'>সরাইল</option>
                <option value='আশুগঞ্জ'>আশুগঞ্জ</option>
                <option value='আখাউড়া'>আখাউড়া</option>
                <option value='বাঞ্ছারামপুর'>বাঞ্ছারামপুর</option>
                <option value='বিজয়নগর'>বিজয়নগর</option>
                <option value='নবীনগর'>নবীনগর</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='constituency'
                className='block text-gray-700 mb-2'
              >
                আসন *
              </label>
              <motion.input
                type='text'
                id='constituency'
                name='constituency'
                value={formData.constituency}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='union' className='block text-gray-700 mb-2'>
                ইউনিয়ন/পৌরসভা/সিটি কর্পোরেশন *
              </label>
              <motion.select
                id='union'
                name='union'
                value={formData.union}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
                required
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='গুলশান'>গুলশান</option>
                <option value='ইউনিয়ন'>ইউনিয়ন</option>
                <option value='পৌরসভা'>পৌরসভা</option>
                <option value='সিটি কর্পোরেশন'>সিটি কর্পোরেশন</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='ward' className='block text-gray-700 mb-2'>
                ওয়ার্ড *
              </label>
              <motion.input
                type='text'
                id='ward'
                name='ward'
                value={formData.ward}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
                required
              />
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
              whileHover={isUpdating ? {} : "hover"}
              whileTap={isUpdating ? {} : "tap"}
            >
              {isUpdating ? "সংরক্ষণ হচ্ছে..." : "পরবর্তী ধাপে যান"}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
