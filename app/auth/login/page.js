"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <motion.div
        className='w-full max-w-md space-y-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src='/images/nps_logo.png'
            alt='NPS Logo'
            width={120}
            height={120}
            className='mx-auto'
          />
          <motion.h1
            className='mt-6 text-black text-2xl font-bold'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            আপনার একাউন্টে লগইন করুন
          </motion.h1>
          <motion.p
            className='mt-2 text-[#636970]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            সার্ভে শুরু করতে আপনার একাউন্টে প্রবেশ করুন
          </motion.p>
        </motion.div>

        <motion.form
          className='mt-8 space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className='space-y-4 text-[#636970]'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor='email' className='block text-sm font-medium'>
                ইমেইল
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Loisbecket@gmail.com'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor='password' className='block text-sm font-medium'>
                পাসওয়ার্ড
              </label>
              <input
                id='password'
                name='password'
                type='password'
                placeholder='*******'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
              />
            </motion.div>

            <motion.div
              className='flex items-center'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <input
                id='remember'
                name='remember'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300'
              />
              <label htmlFor='remember' className='ml-2 block text-sm'>
                লগইন মনে রাখুন
              </label>
            </motion.div>
          </div>

          <motion.button
            type='submit'
            className='w-full rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-2 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f]'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            লগইন করুন
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
