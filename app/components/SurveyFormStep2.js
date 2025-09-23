"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SurveyFormStep2({ onPrevious, onNext }) {
  const [step, setStep] = useState(2);

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

        {/* Form Fields */}
        <motion.form className='space-y-6' variants={itemVariants}>
          <motion.div className='space-y-4' variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <label htmlFor='division' className='block text-gray-700 mb-2'>
                বিভাগ
              </label>
              <motion.select
                id='division'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='dhaka'>ঢাকা</option>
                <option value='chittagong'>চট্টগ্রাম</option>
                <option value='rajshahi'>রাজশাহী</option>
                <option value='khulna'>খুলনা</option>
                <option value='barisal'>বরিশাল</option>
                <option value='sylhet'>সিলেট</option>
                <option value='rangpur'>রংপুর</option>
                <option value='mymensingh'>ময়মনসিংহ</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='district' className='block text-gray-700 mb-2'>
                জেলা
              </label>
              <motion.select
                id='district'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='brahmanbaria'>ব্রাহ্মনবাড়িয়া</option>
                <option value='dhaka'>ঢাকা</option>
                <option value='chittagong'>চট্টগ্রাম</option>
                <option value='comilla'>কুমিল্লা</option>
                <option value='sylhet'>সিলেট</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='thana' className='block text-gray-700 mb-2'>
                থানা
              </label>
              <motion.select
                id='thana'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='brahmanbaria-sadar'>ব্রাহ্মনবাড়িয়া সদর</option>
                <option value='kasba'>কসবা</option>
                <option value='nasirnagar'>নাসিরনগর</option>
                <option value='sarail'>সরাইল</option>
                <option value='ashuganj'>আশুগঞ্জ</option>
                <option value='akhaura'>আখাউড়া</option>
                <option value='bancharampur'>বাঞ্ছারামপুর</option>
                <option value='bijoynagar'>বিজয়নগর</option>
                <option value='nabinagar'>নবীনগর</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='constituency'
                className='block text-gray-700 mb-2'
              >
                আসন
              </label>
              <motion.input
                type='text'
                id='constituency'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='union' className='block text-gray-700 mb-2'>
                ইউনিয়ন/পৌরসভা/সিটি কর্পোরেশন
              </label>
              <motion.select
                id='union'
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='union'>ইউনিয়ন</option>
                <option value='pourashava'>পৌরসভা</option>
                <option value='city-corporation'>সিটি কর্পোরেশন</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='ward' className='block text-gray-700 mb-2'>
                ওয়ার্ড
              </label>
              <motion.input
                type='text'
                id='ward'
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
              onClick={onNext}
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
