"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSurveyWithLocationDetails,
  setSelectedSeatId,
} from "../store/surveyCreateSlice";
import { getAuthHeaders } from "../utils/auth";

export default function SurveyFormStep2({ onPrevious, onNext }) {
  const [formData, setFormData] = useState({
    division: "",
    divisionId: null,
    district: "",
    districtId: null,
    thana: "",
    thanaId: null,
    constituency: "",
    constituencyId: null,
    union: "",
    unionId: null,
    ward: "",
  });

  // States for dropdown options
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [seats, setSeats] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({
    divisions: false,
    districts: false,
    thanas: false,
    seats: false,
  });

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "" });

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, error, updateSuccess } = useSelector(
    (state) => state.surveyCreate
  );

  // Fetch divisions on component load
  useEffect(() => {
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (formData.divisionId) {
      fetchDistricts(formData.divisionId);
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        district: "",
        districtId: null,
        thana: "",
        thanaId: null,
        constituency: "",
        constituencyId: null,
        union: "",
        unionId: null,
      }));
      setDistricts([]);
      setThanas([]);
      setSeats([]);
    }
  }, [formData.divisionId]);

  // Fetch thanas and seats when district changes
  useEffect(() => {
    if (formData.districtId) {
      fetchThanas(formData.districtId);
      fetchSeats(formData.districtId);
      // Reset dependent fields
      setFormData((prev) => ({
        ...prev,
        thana: "",
        thanaId: null,
        union: "",
        unionId: null,
      }));
      setThanas([]);
    }
  }, [formData.districtId]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      setLoading((prev) => ({ ...prev, divisions: true }));
      const response = await fetch("https://npsbd.xyz/api/divisions", {
        method: "GET",
        headers: {
          accept: "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch divisions");

      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    } finally {
      setLoading((prev) => ({ ...prev, divisions: false }));
    }
  };

  // Fetch districts from API
  const fetchDistricts = async (divisionId) => {
    try {
      setLoading((prev) => ({ ...prev, districts: true }));
      const response = await fetch(
        `https://npsbd.xyz/api/divisions/${divisionId}/districts`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch districts");

      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  // Fetch thanas from API
  const fetchThanas = async (districtId) => {
    try {
      setLoading((prev) => ({ ...prev, thanas: true }));
      const response = await fetch(
        `https://npsbd.xyz/api/districts/${districtId}/thanas`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch thanas");

      const data = await response.json();
      setThanas(data);
    } catch (error) {
      console.error("Error fetching thanas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, thanas: false }));
    }
  };

  // Fetch seats (constituencies) from API
  const fetchSeats = async (districtId) => {
    try {
      setLoading((prev) => ({ ...prev, seats: true }));
      const response = await fetch(
        `https://npsbd.xyz/api/districts/${districtId}/seats`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch seats");

      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoading((prev) => ({ ...prev, seats: false }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "division") {
      const selectedDivision = divisions.find((div) => div.bn_name === value);
      setFormData((prev) => ({
        ...prev,
        division: value,
        divisionId: selectedDivision ? selectedDivision.id : null,
      }));
    } else if (name === "district") {
      const selectedDistrict = districts.find((dist) => dist.bn_name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selectedDistrict ? selectedDistrict.id : null,
      }));
    } else if (name === "thana") {
      const selectedThana = thanas.find((th) => th.bn_name === value);
      setFormData((prev) => ({
        ...prev,
        thana: value,
        thanaId: selectedThana ? selectedThana.id : null,
      }));
    } else if (name === "constituency") {
      const selectedSeat = seats.find((seat) => seat.bn_name === value);
      console.log("🚀 ~ handleInputChange ~ selectedSeat:", selectedSeat);

      // Store the seat ID in Redux
      if (selectedSeat && selectedSeat.id) {
        dispatch(setSelectedSeatId(selectedSeat.id));
      }

      setFormData((prev) => ({
        ...prev,
        constituency: value,
        constituencyId: selectedSeat ? selectedSeat.id : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      setToast({
        show: true,
        message: "সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।",
      });
      return;
    }

    // Validate required fields
    if (
      !formData.division ||
      !formData.district ||
      !formData.thana ||
      !formData.constituency ||
      (!formData.union && !formData.ward)
    ) {
      setToast({
        show: true,
        message:
          "অনুগ্রহ করে সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন। ইউনিয়ন/পৌরসভা/সিটি কর্পোরেশন অথবা ওয়ার্ড এর মধ্যে অন্তত একটি পূরণ করতে হবে।",
      });
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

    try {
      // Send API request to update location details
      await dispatch(
        updateSurveyWithLocationDetails({
          surveyId: currentSurveyId,
          locationDetails,
        })
      );

      // After API call completes successfully, navigate to the next step
      onNext();
    } catch (error) {
      console.error("Error updating location details:", error);
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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className='inline-block ml-2 animate-spin h-4 w-4 border-2 border-green-500 rounded-full border-t-transparent'></div>
  );

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step2'
        className='min-h-screen p-4 max-w-3xl mx-auto relative'
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
                বিভাগ *{loading.divisions && <LoadingSpinner />}
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
                disabled={loading.divisions}
              >
                <option value=''>নির্বাচন করুন</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.bn_name}>
                    {division.bn_name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='district' className='block text-gray-700 mb-2'>
                জেলা *{loading.districts && <LoadingSpinner />}
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
                disabled={!formData.division || loading.districts}
              >
                <option value=''>নির্বাচন করুন</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.bn_name}>
                    {district.bn_name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='thana' className='block text-gray-700 mb-2'>
                থানা *{loading.thanas && <LoadingSpinner />}
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
                disabled={!formData.district || loading.thanas}
              >
                <option value=''>নির্বাচন করুন</option>
                {thanas.map((thana) => (
                  <option key={thana.id} value={thana.bn_name}>
                    {thana.bn_name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor='constituency'
                className='block text-gray-700 mb-2'
              >
                আসন *{loading.seats && <LoadingSpinner />}
              </label>
              <motion.select
                id='constituency'
                name='constituency'
                value={formData.constituency}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                variants={selectVariants}
                whileFocus='focus'
                required
                disabled={!formData.district || loading.seats}
              >
                <option value=''>নির্বাচন করুন</option>
                {seats.map((seat) => (
                  <option key={seat.id} value={seat.bn_name}>
                    {seat.bn_name}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='union' className='block text-gray-700 mb-2'>
                ইউনিয়ন/পৌরসভা/সিটি কর্পোরেশন
              </label>
              <motion.input
                type='text'
                id='union'
                name='union'
                value={formData.union}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent'
                whileFocus={{
                  scale: 1.01,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor='ward' className='block text-gray-700 mb-2'>
                ওয়ার্ড
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
