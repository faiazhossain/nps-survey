"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
        {/* Header with Dashboard Button */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>
            সার্ভে হিস্ট্রি
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 shadow-md hover:shadow-lg'
          >
            ড্যাশবোর্ড
          </button>
        </div>

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
                      {survey.location_details?.ইউনিয়ন || "পাওয়া যায়নি "}
                    </div>
                    <div className='text-gray-500 text-xs'>আসন</div>
                    <div className='font-medium text-gray-800'>
                      {survey.location_details?.আসন || "পাওয়া যায়নি "}
                    </div>
                  </div>

                  {/* Status and Person Info */}
                  <div className='space-y-1'>
                    <div className='text-gray-500 text-xs'>নাম</div>
                    <div className='font-medium text-gray-800'>
                      {survey.person_details?.নাম || "পাওয়া যায়নি "}
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
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='bg-white rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl'>
              {/* Header */}
              <div className='flex justify-between items-center mb-6 border-b pb-3'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  সার্ভে বিস্তারিত
                </h2>
                <button
                  onClick={() => setSelectedSurvey(null)}
                  className='text-gray-500 hover:text-gray-700 text-xl font-medium transition-colors'
                >
                  ✕
                </button>
              </div>

              {detailsError && (
                <div className='bg-red-50 border-l-2 border-red-500 text-red-700 p-3 rounded-md mb-6 text-sm'>
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
                <div className='space-y-6'>
                  {/* Survey Basic Info Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      সাধারণ তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          সার্ভে আইডি
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          #{toBengaliNumber(selectedSurvey.survey_id)}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          তৈরির সময়
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {formatDateToBengali(selectedSurvey.created_at)}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          আপডেটের সময়
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {formatDateToBengali(selectedSurvey.updated_at)}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          স্ট্যাটাস
                        </span>
                        <p
                          className={`text-base font-semibold ${
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
                      {selectedSurvey.approved_by && (
                        <div>
                          <span className='text-gray-500 text-xs font-medium'>
                            অনুমোদিত
                          </span>
                          <p className='text-base font-semibold text-gray-800'>
                            {selectedSurvey.approved_by}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Person Details Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      ব্যক্তির তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          নাম
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.নাম || "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          জাতীয় পরিচয়পত্র
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.জাতীয়_পরিচয়পত্র ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          মোবাইল
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.মোবাইল
                            ? toBengaliNumber(
                                selectedSurvey.person_details.মোবাইল
                              )
                            : "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          ইমেইল
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.ইমেইল ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          ধর্ম
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.ধর্ম ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          পেশা
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.পেশা ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          বয়স
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.বয়স
                            ? toBengaliNumber(
                                selectedSurvey.person_details.বয়স
                              )
                            : "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          লিঙ্গ
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.person_details?.লিঙ্গ ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Details Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      অবস্থানের তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          আসন
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.আসন ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          জেলা
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.জেলা ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          থানা
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.থানা ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          বিভাগ
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.বিভাগ ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          ইউনিয়ন
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.ইউনিয়ন ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          ওয়ার্ড
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.location_details?.ওয়ার্ড
                            ? toBengaliNumber(
                                selectedSurvey.location_details.ওয়ার্ড
                              )
                            : "পাওয়া যায়নি "}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Demand Details Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      চাহিদার তথ্য
                    </h3>
                    <div className='space-y-2'>
                      <span className='text-gray-500 text-xs font-medium'>
                        বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান
                        চাওয়া কি কি?
                      </span>
                      <ul className='list-disc list-inside text-base text-gray-800'>
                        {Object.entries(
                          selectedSurvey.demand_details?.[
                            "বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?"
                          ] || {}
                        ).map(
                          ([key, value]) =>
                            value === 1 && (
                              <li key={key} className='font-medium'>
                                {key}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Party and Candidate Details Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      দল ও প্রার্থীর তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          মূল্যবান দল
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.worthful_party_name || "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          জনপ্রিয় দল
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.candidate_work_details?.[
                            "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?"
                          ] || "পাওয়া যায়নি "}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <span className='text-gray-500 text-xs font-medium'>
                        উপলব্ধ দল ও প্রার্থী
                      </span>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {selectedSurvey.avail_party_details?.দল?.map(
                          (party, index) => (
                            <div
                              key={index}
                              className='border rounded-md p-3 bg-gray-50'
                            >
                              <p className='text-base font-semibold text-gray-800'>
                                {Object.keys(party)[0]}
                              </p>
                              <ul className='list-disc list-inside text-gray-700 text-sm'>
                                {party[Object.keys(party)[0]].map(
                                  (candidate, i) => (
                                    <li key={i}>{candidate}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selected Candidate Details Card */}
                  <div className='bg-white border rounded-lg shadow-sm p-5'>
                    <h3 className='text-xl font-semibold text-gray-900 border-b pb-2 mb-4'>
                      নির্বাচিত প্রার্থীর তথ্য
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          নির্বাচিত প্রার্থী
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.candidate_details?.দল?.find(
                            (p) => p[selectedSurvey.worthful_party_name]
                          )?.[selectedSurvey.worthful_party_name] ||
                            "পাওয়া যায়নি "}
                        </p>
                      </div>
                      <div>
                        <span className='text-gray-500 text-xs font-medium'>
                          প্রার্থীকে চেনার মাধ্যম
                        </span>
                        <p className='text-base font-semibold text-gray-800'>
                          {selectedSurvey.selected_candidate_details?.[
                            "আপনি কিভাবে এই প্রার্থীকে চিনেন?"
                          ] || "পাওয়া যায়নি "}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2 mb-4'>
                      <span className='text-gray-500 text-xs font-medium'>
                        প্রার্থীর যোগ্যতার মাপকাঠি
                      </span>
                      <ul className='list-disc list-inside text-base text-gray-800'>
                        {Object.entries(
                          selectedSurvey.selected_candidate_details?.[
                            "এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?"
                          ] || {}
                        ).map(
                          ([key, value]) =>
                            value === 1 && (
                              <li key={key} className='font-medium'>
                                {key}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                    <div>
                      <span className='text-gray-500 text-xs font-medium'>
                        প্রার্থীর কাজ
                      </span>
                      <p className='text-base font-semibold text-gray-800'>
                        {selectedSurvey.candidate_work_details?.[
                          "সাধারণ মানুষের জন্য এই ব্যক্তি কি কি করেছেন?"
                        ] || "পাওয়া যায়নি "}
                      </p>
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
