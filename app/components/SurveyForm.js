"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurveyFormStep2 from "./SurveyFormStep2";

export default function SurveyForm() {
  const [step, setStep] = useState(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
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

  // Render Step 2 component
  if (step === 2) {
    return (
      <SurveyFormStep2
        onPrevious={() => setStep(1)}
        onNext={() => setStep(3)}
      />
    );
  }

  // Step 1 component
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step1'
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
            whileHover={{ scale: 1.1 }}
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
          <h1 className='text-2xl font-bold'>সার্ভে ফর্ম</h1>
          <motion.div
            className='bg-[#DBFBF1] px-2 py-1 rounded-md text-gray-600'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            ধাপ ১/৮
          </motion.div>
        </motion.div>

        {/* Form Fields */}
        <motion.form className='space-y-6' variants={itemVariants}>
          <motion.div className='space-y-4' variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <label
                htmlFor='name'
                className='block text-gray-500 mb-2 text-[14px]'
              >
                নাম
              </label>
              <motion.input
                type='text'
                id='name'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='age'
                className='block text-gray-500 mb-2 text-[14px]'
              >
                বয়স
              </label>
              <motion.input
                type='number'
                id='age'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='gender'
                className='block text-gray-500 mb-2 text-[14px]'
              >
                লিঙ্গ
              </label>
              <motion.select
                id='gender'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='male'>পুরুষ</option>
                <option value='female'>মহিলা</option>
                <option value='other'>অন্যান্য</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='religion'
                className='block text-gray-500 mb-2 text-[14px]'
              >
                ধর্ম
              </label>
              <motion.select
                id='religion'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='islam'>ইসলাম</option>
                <option value='hinduism'>হিন্দু</option>
                <option value='buddhism'>বৌদ্ধ</option>
                <option value='christianity'>খ্রিস্টান</option>
                <option value='other'>অন্যান্য</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='occupation'
                className='block text-gray-500 mb-2 text-[14px]'
              >
                পেশা
              </label>
              <motion.input
                type='text'
                id='occupation'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className='flex gap-4 justify-around pt-6'
            variants={itemVariants}
          >
            <motion.div
              className='flex-grow'
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
            >
              <Link
                href='/dashboard'
                className='block text-center rounded-md bg-gradient-to-b from-[#DBFBF1] to-[#dbfbe9] px-4 py-3 text-green-700 hover:bg-gradient-to-b hover:from-[#d3fff1] hover:to-[#bcffee]'
              >
                ফিরে যান
              </Link>
            </motion.div>
            <motion.button
              type='button'
              onClick={() => setStep(2)}
              className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f]'
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
            >
              পরবর্তী ধাপে যান
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
