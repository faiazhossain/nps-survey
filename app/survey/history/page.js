"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getAuthHeaders } from "../../utils/auth";
import Link from "next/link";

export default function SurveyHistory() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          "https://npsbd.xyz/api/surveys/?page=1&page_size=100",
          {
            headers: {
              accept: "application/json",
              ...getAuthHeaders(),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch surveys");
        }

        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setError("সার্ভে তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Function to convert status to Bengali
  const getStatusInBengali = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "অনুমোদিত";
      case "rejected":
        return "বাতিল";
      case "pending":
        return "অপেক্ষামান";
      default:
        return status;
    }
  };

  // Function to convert number to Bengali
  const toBengaliNumber = (num) => {
    const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => bengaliNumbers[parseInt(digit)])
      .join("");
  };

  // Function to format date to Bengali
  const formatDateToBengali = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString("bn-BD", { month: "long" });
    const year = date.getFullYear();

    const formattedTime = `${toBengaliNumber(
      hours.toString().padStart(2, "0")
    )}:${toBengaliNumber(minutes.toString().padStart(2, "0"))} ${
      hours >= 12 ? "PM" : "AM"
    }`;
    return `${formattedTime}, ${toBengaliNumber(
      day
    )} ${month}, ${toBengaliNumber(year)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen p-4 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>সার্ভে হিস্ট্রি</h1>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='flex justify-center items-center py-8'>
            <div className='text-lg text-gray-600'>লোড হচ্ছে...</div>
          </div>
        ) : (
          <motion.div
            className='space-y-4'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {surveys.map((survey) => (
              <motion.div
                key={survey.survey_id}
                className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm'
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                  {/* Survey Basic Info */}
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-600'>সার্ভে আইডিঃ</span>
                      <br />
                      <span className='font-semibold'>
                        #{toBengaliNumber(survey.survey_id)}
                      </span>
                    </div>
                    <div className='text-sm text-gray-500'>
                      {formatDateToBengali(survey.created_at)}
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-600'>এরিয়াঃ</span>
                      <br />
                      <span className='font-medium'>
                        {survey.location_details?.ইউনিয়ন || "অজানা"}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>আসনঃ</span>
                      <br />
                      <span className='font-medium'>
                        {survey.location_details?.আসন || "অজানা"}
                      </span>
                    </div>
                  </div>

                  {/* Status and Person Info */}
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-600'>নামঃ</span>
                      <br />
                      <span className='font-medium'>
                        {survey.person_details?.নাম || "অজানা"}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-600'>স্ট্যাটাসঃ</span>
                      <br />
                      <span
                        className={`font-medium ${
                          survey.status === "approved"
                            ? "text-green-600"
                            : survey.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {getStatusInBengali(survey.status)}
                      </span>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className='flex items-end justify-end'>
                    <Link
                      href={`/survey/${survey.survey_id}`}
                      className='text-green-600 hover:text-green-700 font-medium'
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}
