"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen p-4 space-y-6'>
      <motion.div
        className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src='/images/nps_logo.png'
          alt='Profile'
          width={78}
          height={24}
        />
      </motion.div>

      <motion.div
        className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src='/images/profile.png'
          alt='Profile'
          width={52}
          height={52}
          className='rounded-full'
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className='text-xl font-semibold'>মাহমুদ হাসান তবীব</h2>
          <p className='text-sm text-[#636970]'>২৮ আগস্ট, ২০২৫</p>
        </motion.div>
      </motion.div>

      <motion.div
        className='grid grid-cols-2 gap-4'
        initial='hidden'
        animate='visible'
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          className='bg-white p-4 rounded-lg shadow space-y-2'
          variants={cardVariants}
        >
          <div className='p-4 rounded-lg bg-green-200 w-fit'>
            <Image
              src='/images/serveyLogo/docadd.png'
              alt='docadd'
              width={20}
              height={20}
            />
          </div>
          <p className='text-sm text-[#636970]'>আপনার মোট সার্ভে</p>
          <p className='text-2xl font-bold'>১০২</p>
        </motion.div>
        <motion.div
          className='bg-white p-4 rounded-lg shadow space-y-2'
          variants={cardVariants}
        >
          <div className='p-4 rounded-lg bg-blue-200 w-fit'>
            <Image
              src='/images/serveyLogo/check.png'
              alt='check'
              width={20}
              height={20}
            />
          </div>
          <p className='text-sm text-[#636970]'>অনুমোদিত সার্ভে</p>
          <p className='text-2xl font-bold'>৯০</p>
        </motion.div>
        <motion.div
          className='bg-white p-4 rounded-lg shadow space-y-2'
          variants={cardVariants}
        >
          <div className='p-4 rounded-lg bg-red-200 w-fit'>
            <Image
              src='/images/serveyLogo/remove.png'
              alt='remove'
              width={20}
              height={20}
            />
          </div>
          <p className='text-sm text-[#636970]'>বাতিল সার্ভে</p>
          <p className='text-2xl font-bold'>০৪</p>
        </motion.div>
        <motion.div
          className='bg-white p-4 rounded-lg shadow space-y-2'
          variants={cardVariants}
        >
          <div className='p-4 rounded-lg bg-orange-200 w-fit'>
            <Image
              src='/images/serveyLogo/add.png'
              alt='add'
              width={20}
              height={20}
            />
          </div>
          <p className='text-sm text-[#636970]'>অপেক্ষামান সার্ভে</p>
          <p className='text-2xl font-bold'>০৮</p>
        </motion.div>
      </motion.div>

      <motion.div
        className='space-y-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href='/survey/new'
            // className='block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700'
            className='block w-full text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f]'
          >
            নতুন সার্ভে শুরু করুন
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href='/survey/history'
            className='block w-full text-center rounded-md bg-gradient-to-b from-[#DBFBF1] to-[#dbfbe9] px-4 py-3 text-green-700 hover:bg-gradient-to-b hover:from-[#d3fff1] hover:to-[#bcffee]'
          >
            আপনার সার্ভে হিস্ট্রি দেখুন
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
