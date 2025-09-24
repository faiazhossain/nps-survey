"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getAuthHeaders } from "../../utils/auth";

export default function SurveyHistory() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  console.log("🚀 ~ SurveyHistory ~ selectedSurvey:", selectedSurvey);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Fetch all surveys
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

  // Function to show survey details by filtering existing data
  const showSurveyDetails = (survey_id) => {
    const survey = surveys.find((s) => s.survey_id === survey_id);
    if (survey) {
      setSelectedSurvey(survey);
    }
  };

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
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6 tracking-tight'>
          সার্ভে হিস্ট্রি
        </h1>

        {error && (
          <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='text-lg text-gray-600 animate-pulse'>
              লোড হচ্ছে...
            </div>
          </div>
        ) : (
          <motion.div
            className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {surveys.map((survey) => (
              <motion.div
                key={survey.survey_id}
                className='bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300'
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  {/* Survey Basic Info */}
                  <div className='space-y-1'>
                    <div className='text-gray-500 text-xs'>সার্ভে আইডি</div>
                    <div className='font-semibold text-gray-800'>
                      #{toBengaliNumber(survey.survey_id)}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {formatDateToBengali(survey.created_at)}
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className='space-y-1'>
                    <div className='text-gray-500 text-xs'>এরিয়া</div>
                    <div className='font-medium text-gray-800'>
                      {survey.location_details?.ইউনিয়ন || "অজানা"}
                    </div>
                    <div className='text-gray-500 text-xs'>আসন</div>
                    <div className='font-medium text-gray-800'>
                      {survey.location_details?.আসন || "অজানা"}
                    </div>
                  </div>

                  {/* Status and Person Info */}
                  <div className='space-y-1'>
                    <div className='text-gray-500 text-xs'>নাম</div>
                    <div className='font-medium text-gray-800'>
                      {survey.person_details?.নাম || "অজানা"}
                    </div>
                    <div className='text-gray-500 text-xs'>স্ট্যাটাস</div>
                    <div
                      className={`font-medium ${
                        survey.status === "approved"
                          ? "text-green-600"
                          : survey.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {getStatusInBengali(survey.status)}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className='flex items-end justify-end'>
                    <button
                      onClick={() => showSurveyDetails(survey.survey_id)}
                      className='text-green-600 hover:text-green-700 font-medium text-xs bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-colors'
                    >
                      বিস্তারিত
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal for Survey Details */}
        {selectedSurvey && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  সার্ভে বিস্তারিত
                </h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className='text-gray-600 hover:text-gray-800 text-xl font-bold'
                >
                  ✕
                </button>
              </div>

              {detailsError && (
                <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 shadow-sm'>
                  {detailsError}
                </div>
              )}

              {detailsLoading ? (
                <div className='flex justify-center items-center py-8'>
                  <div className='text-lg text-gray-600 animate-pulse'>
                    লোড হচ্ছে...
                  </div>
                </div>
              ) : (
                <div className='grid gap-6'>
                  {/* Survey Basic Info */}
                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      সাধারণ তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-sm'>
                          সার্ভে আইডি
                        </span>
                        <p className='font-medium text-gray-800'>
                          #{toBengaliNumber(selectedSurvey.survey_id)}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>
                          তৈরির সময়
                        </span>
                        <p className='font-medium text-gray-800'>
                          {formatDateToBengali(selectedSurvey.created_at)}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>স্ট্যাটাস</span>
                        <p
                          className={`font-medium ${
                            selectedSurvey.status === "approved"
                              ? "text-green-600"
                              : selectedSurvey.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {getStatusInBengali(selectedSurvey.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Person Details */}
                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      ব্যক্তির তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-sm'>নাম</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.person_details?.নাম || "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>
                          জাতীয় পরিচয়পত্র
                        </span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.person_details?.জাতীয়_পরিচয়পত্র ||
                            "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>মোবাইল</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.person_details?.মোবাইল
                            ? toBengaliNumber(
                                selectedSurvey.person_details.মোবাইল
                              )
                            : "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>ইমেইল</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.person_details?.ইমেইল || "অজানা"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-gray-800'>
                      অবস্থানের তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-sm'>আসন</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.location_details?.আসন || "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>ইউনিয়ন</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.location_details?.ইউনিয়ন || "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>ওয়ার্ড</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.location_details?.ওয়ার্ড
                            ? toBengaliNumber(
                                selectedSurvey.location_details.ওয়ার্ড
                              )
                            : "অজানা"}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-sm'>গ্রাম</span>
                        <p className='font-medium text-gray-800'>
                          {selectedSurvey.location_details?.গ্রাম || "অজানা"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}
