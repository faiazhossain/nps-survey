"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAuthHeaders } from "../utils/auth";
import { setPartyData } from "../store/surveyCreateSlice";

export default function SurveyFormStep5({ onPrevious, onNext }) {
  const [partyData, setPartyDataState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  // State for parties fetched from API
  const [parties, setParties] = useState([]);
  const [partiesLoading, setPartiesLoading] = useState(true);
  const [partiesError, setPartiesError] = useState("");

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating, selectedSeatId } = useSelector(
    (state) => state.surveyCreate
  );

  const partyNameRefs = useRef({});

  // Fetch parties from API
  useEffect(() => {
    const fetchParties = async () => {
      try {
        setPartiesLoading(true);
        const response = await fetch("https://npsbd.xyz/api/parties", {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setParties(data);
      } catch (err) {
        console.error("Error fetching parties:", err);
        setPartiesError("দলের তালিকা লোড করতে সমস্যা হয়েছে।");
      } finally {
        setPartiesLoading(false);
      }
    };

    fetchParties();
  }, []);

  // Fetch party details from API (unchanged)
  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        setLoading(true);
        if (!selectedSeatId) {
          setError(
            "আসন আইডি পাওয়া যায়নি। আগের ধাপে গিয়ে আসন নির্বাচন করুন।"
          );
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://npsbd.xyz/api/party/details/${selectedSeatId}`,
          {
            headers: {
              accept: "application/json",
              ...getAuthHeaders(),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const transformedData = data.দল.map((party, partyIndex) => {
          const partyName = Object.keys(party)[0];
          const candidates = party[partyName];
          return {
            id: `api_party_${partyIndex}`,
            name: partyName,
            isFromApi: true,
            candidates: candidates.map((candidate, index) => ({
              id: `${partyName}_${index}`,
              name: candidate,
              isNew: false,
              isSelected: false,
            })),
          };
        });

        setPartyDataState(transformedData);
      } catch (error) {
        console.error("Error fetching party details:", error);
        setError("পার্টি তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [selectedSeatId]);

  // Auto-hide toast after 3 seconds (unchanged)
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Add new candidate to a party (unchanged)
  const addNewCandidate = (partyName, newCandidateName) => {
    if (!newCandidateName || newCandidateName.trim() === "") {
      setToast({
        show: true,
        message: "প্রার্থীর নাম খালি রাখা যাবে না।",
      });
      return;
    }

    const currentParty = partyData.find((party) => party.name === partyName);
    if (
      currentParty &&
      currentParty.candidates.some(
        (candidate) =>
          candidate.name.toLowerCase().trim() ===
          newCandidateName.toLowerCase().trim()
      )
    ) {
      setToast({
        show: true,
        message: "এই প্রার্থী ইতিমধ্যে এই দলে রয়েছেন।",
      });
      return;
    }

    setPartyDataState((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const cleanedCandidates = party.candidates.filter(
            (candidate) => candidate.name !== "add_new"
          );

          const newCandidateId = `${partyName}_${cleanedCandidates.length}`;
          return {
            ...party,
            candidates: [
              ...cleanedCandidates,
              {
                id: newCandidateId,
                name: newCandidateName.trim(),
                isNew: true,
                isSelected: true,
              },
            ],
          };
        }
        return party;
      })
    );

    setToast({
      show: true,
      message: `"${newCandidateName.trim()}" সফলভাবে ${partyName} দলে যোগ করা হয়েছে।`,
    });
  };

  // Delete candidate from a party (unchanged)
  const deleteCandidate = (partyName, candidateIndex) => {
    setPartyDataState((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidates = party.candidates.filter(
            (_, index) => index !== candidateIndex
          );
          const updatedCandidates = newCandidates.map((candidate, index) => ({
            ...candidate,
            id: `${partyName}_${index}`,
          }));
          return {
            ...party,
            candidates: updatedCandidates,
          };
        }
        return party;
      })
    );
  };

  // Toggle candidate selection (unchanged)
  const toggleCandidateSelection = (partyName, candidateIndex) => {
    setPartyDataState((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidates = [...party.candidates];
          newCandidates[candidateIndex] = {
            ...newCandidates[candidateIndex],
            isSelected: !newCandidates[candidateIndex].isSelected,
          };
          return { ...party, candidates: newCandidates };
        }
        return party;
      })
    );
  };

  // Add new party
  const addNewParty = () => {
    const existingPartyNames = partyData.map((party) => party.name);
    const availablePartyObj = parties.find(
      (party) => !existingPartyNames.includes(party.party_name)
    );

    if (!availablePartyObj) {
      setToast({
        show: true,
        message: "সব দল ইতিমধ্যে যোগ করা হয়েছে।",
      });
      return;
    }

    const partyId = `party_${Date.now()}_${partyData.length}`;
    setPartyDataState((prevData) => [
      ...prevData,
      {
        id: partyId,
        name: availablePartyObj.party_name,
        isFromApi: false,
        candidates: [],
      },
    ]);

    setTimeout(() => {
      if (partyNameRefs.current[partyId]) {
        partyNameRefs.current[partyId].focus();
      }
    }, 0);
  };

  // Update party name
  const updatePartyName = (partyId, newName) => {
    const isDuplicate = partyData.some(
      (party) => party.name === newName && party.id !== partyId
    );

    if (isDuplicate) {
      setToast({
        show: true,
        message: `দলের নাম "${newName}" ইতিমধ্যে ব্যবহৃত হয়েছে।`,
      });
      return;
    }

    setPartyDataState((prevData) =>
      prevData.map((party) =>
        party.id === partyId
          ? {
              ...party,
              name: newName,
              candidates: party.candidates.map((candidate) => ({
                ...candidate,
                id: `${newName}_${candidate.id.split("_")[1]}`,
              })),
            }
          : party
      )
    );
  };

  // Update candidate name (unchanged)
  const updateCandidateName = (partyName, candidateIndex, newName) => {
    setPartyDataState((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidates = [...party.candidates];
          newCandidates[candidateIndex] = {
            ...newCandidates[candidateIndex],
            name: newName,
          };
          return { ...party, candidates: newCandidates };
        }
        return party;
      })
    );
  };

  // Start adding a new candidate (unchanged)
  const startAddingCandidate = (partyName) => {
    setPartyDataState((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidateId = `${partyName}_${party.candidates.length}`;
          return {
            ...party,
            candidates: [
              ...party.candidates,
              {
                id: newCandidateId,
                name: "add_new",
                isSelected: false,
              },
            ],
          };
        }
        return party;
      })
    );
  };

  // Handle next button click (unchanged)
  const handleNext = async () => {
    if (!currentSurveyId) {
      setToast({
        show: true,
        message: "সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।",
      });
      return;
    }

    const partiesWithCandidates = partyData.filter((party) =>
      party.candidates.some(
        (candidate) =>
          (candidate.isSelected || candidate.isNew) &&
          candidate.name &&
          candidate.name.trim() !== "" &&
          candidate.name !== "add_new"
      )
    );

    if (partiesWithCandidates.length === 0) {
      setToast({
        show: true,
        message:
          "অনুগ্রহ করে অন্তত একটি প্রার্থী নির্বাচন করুন বা নতুন প্রার্থী যোগ করুন।",
      });
      return;
    }

    dispatch(setPartyData(partyData));

    const availPartyDetailsData = {
      avail_party_details: {
        দল: partyData
          .filter((party) =>
            party.candidates.some(
              (candidate) => candidate.isSelected || candidate.isNew
            )
          )
          .map((party) => {
            const filteredCandidates = party.candidates
              .filter(
                (candidate) =>
                  (candidate.isSelected || candidate.isNew) &&
                  candidate.name.trim() !== "" &&
                  candidate.name !== "add_new"
              )
              .map((candidate) => candidate.name);

            if (filteredCandidates.length > 0) {
              return {
                [party.name]: filteredCandidates,
              };
            }
            return null;
          })
          .filter(Boolean),
      },
    };

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(availPartyDetailsData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log("Survey updated successfully with candidate details");

      onNext();
    } catch (error) {
      console.error("Error updating survey:", error);
      setToast({
        show: true,
        message: "সার্ভে আপডেট করতে সমস্যা হয়েছে।",
      });
    }
  };

  // Convert number to Bengali numeral (unchanged)
  const toBengaliNumber = (num) => {
    const bengaliNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => bengaliNumbers[parseInt(digit)])
      .join("");
  };

  // Animation variants (unchanged)
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
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

  // Filter available parties for select
  const getAvailablePartiesForSelect = (currentPartyId) => {
    const existingNames = partyData
      .filter((party) => party.id !== currentPartyId)
      .map((party) => party.name);
    return parties.filter((party) => !existingNames.includes(party.party_name));
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step5'
        className='min-h-screen p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto relative'
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
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            ধাপ ৫/৮
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

        {/* Parties Error Display */}
        {partiesError && (
          <motion.div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {partiesError}
          </motion.div>
        )}

        {/* Loading State */}
        {(loading || partiesLoading) && (
          <motion.div
            className='flex justify-center items-center py-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='text-lg text-gray-600'>তথ্য লোড হচ্ছে...</div>
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && !partiesLoading && (
          <motion.div className='space-y-6' variants={itemVariants}>
            {/* Section Title */}
            <motion.h2
              className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6'
              variants={itemVariants}
            >
              আপনার এলাকার রাজনৈতিক দলগুলার সম্ভাব্য প্রার্থীঃ
            </motion.h2>

            {/* Party Cards */}
            <div className='space-y-4 sm:space-y-6'>
              {partyData.map((party, partyIndex) => (
                <motion.div
                  key={party.id || party.name}
                  className='bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm'
                  variants={cardVariants}
                  initial='hidden'
                  animate='visible'
                  whileHover='hover'
                >
                  {/* Party Name */}
                  <div className='flex justify-between items-center mb-3 sm:mb-4'>
                    {party.isFromApi ? (
                      <p
                        className='text-base sm:text-lg font-semibold text-gray-800 p-2 bg-gray-50 border border-gray-200 rounded-md w-full select-none'
                        tabIndex='-1'
                        onClick={(e) => e.preventDefault()}
                      >
                        {party.name}
                      </p>
                    ) : (
                      <select
                        value={party.name}
                        onChange={(e) =>
                          updatePartyName(party.id, e.target.value)
                        }
                        ref={(el) => (partyNameRefs.current[party.id] = el)}
                        disabled={partiesLoading}
                        className='text-base sm:text-lg font-semibold text-gray-800 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {getAvailablePartiesForSelect(party.id).map(
                          (allowedParty) => (
                            <option
                              key={allowedParty.id}
                              value={allowedParty.party_name}
                            >
                              {allowedParty.party_name}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </div>

                  {/* Candidates */}
                  <div className='space-y-3'>
                    {party.candidates.map((candidate, candidateIndex) => (
                      <motion.div
                        key={candidate.id}
                        className={`space-y-2 sm:space-y-0 ${
                          candidate.isNew
                            ? "bg-green-50 border border-green-200 rounded-md p-2"
                            : ""
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: candidateIndex * 0.1 }}
                      >
                        {candidate.name === "add_new" ? (
                          <>
                            {/* Mobile Layout for add_new */}
                            <div className='sm:hidden'>
                              <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-1'>
                                নতুন প্রার্থীর নাম
                              </label>
                              <input
                                type='text'
                                placeholder='নতুন প্রার্থীর নাম লিখুন এবং Enter চাপুন'
                                autoFocus
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    e.target.value.trim() !== ""
                                  ) {
                                    addNewCandidate(party.name, e.target.value);
                                    e.target.value = "";
                                  } else if (e.key === "Escape") {
                                    setPartyDataState((prevData) =>
                                      prevData.map((p) =>
                                        p.name === party.name
                                          ? {
                                              ...p,
                                              candidates: p.candidates.filter(
                                                (c) => c.name !== "add_new"
                                              ),
                                            }
                                          : p
                                      )
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value.trim() !== "") {
                                    addNewCandidate(party.name, e.target.value);
                                  } else {
                                    setPartyDataState((prevData) =>
                                      prevData.map((p) =>
                                        p.name === party.name
                                          ? {
                                              ...p,
                                              candidates: p.candidates.filter(
                                                (c) => c.name !== "add_new"
                                              ),
                                            }
                                          : p
                                      )
                                    );
                                  }
                                }}
                                className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                              />
                            </div>

                            {/* Desktop Layout for add_new */}
                            <div className='hidden sm:flex items-center gap-3'>
                              <label className='text-sm font-medium text-gray-700 min-w-[140px] lg:min-w-[120px]'>
                                নতুন প্রার্থীর নাম
                              </label>
                              <input
                                type='text'
                                placeholder='নতুন প্রার্থীর নাম লিখুন এবং Enter চাপুন'
                                autoFocus
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    e.target.value.trim() !== ""
                                  ) {
                                    addNewCandidate(party.name, e.target.value);
                                    e.target.value = "";
                                  } else if (e.key === "Escape") {
                                    setPartyDataState((prevData) =>
                                      prevData.map((p) =>
                                        p.name === party.name
                                          ? {
                                              ...p,
                                              candidates: p.candidates.filter(
                                                (c) => c.name !== "add_new"
                                              ),
                                            }
                                          : p
                                      )
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value.trim() !== "") {
                                    addNewCandidate(party.name, e.target.value);
                                  } else {
                                    setPartyDataState((prevData) =>
                                      prevData.map((p) =>
                                        p.name === party.name
                                          ? {
                                              ...p,
                                              candidates: p.candidates.filter(
                                                (c) => c.name !== "add_new"
                                              ),
                                            }
                                          : p
                                      )
                                    );
                                  }
                                }}
                                className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Mobile Layout for existing candidates */}
                            <div className='sm:hidden'>
                              <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-1'>
                                {toBengaliNumber(candidateIndex + 1)} নং
                                প্রার্থীর নাম
                                {candidate.isNew && (
                                  <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                                    নতুন যোগ করা
                                  </span>
                                )}
                              </label>
                              <div className='flex items-center gap-2'>
                                <input
                                  type='checkbox'
                                  checked={candidate.isSelected}
                                  onChange={() =>
                                    toggleCandidateSelection(
                                      party.name,
                                      candidateIndex
                                    )
                                  }
                                  className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
                                />
                                {candidate.isNew ? (
                                  <input
                                    type='text'
                                    value={candidate.name}
                                    onChange={(e) =>
                                      updateCandidateName(
                                        party.name,
                                        candidateIndex,
                                        e.target.value
                                      )
                                    }
                                    className='flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                  />
                                ) : (
                                  <p className='flex-1 p-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-800'>
                                    {candidate.name}
                                  </p>
                                )}
                                {candidate.isNew && (
                                  <motion.button
                                    onClick={() =>
                                      deleteCandidate(
                                        party.name,
                                        candidateIndex
                                      )
                                    }
                                    className='p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 transition-colors'
                                    variants={buttonVariants}
                                    whileHover='hover'
                                    whileTap='tap'
                                    title='প্রার্থী মুছুন'
                                  >
                                    <Image
                                      src='/images/serveyLogo/remove.png'
                                      alt='Delete'
                                      width={16}
                                      height={16}
                                    />
                                  </motion.button>
                                )}
                              </div>
                            </div>

                            {/* Desktop Layout for existing candidates */}
                            <div className='hidden sm:flex items-center gap-3'>
                              <label className='text-sm font-medium text-gray-700 min-w-[140px] lg:min-w-[120px]'>
                                {toBengaliNumber(candidateIndex + 1)} নং
                                প্রার্থীর নাম
                              </label>
                              <input
                                type='checkbox'
                                checked={candidate.isSelected}
                                onChange={() =>
                                  toggleCandidateSelection(
                                    party.name,
                                    candidateIndex
                                  )
                                }
                                className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
                              />
                              {candidate.isNew ? (
                                <input
                                  type='text'
                                  value={candidate.name}
                                  onChange={(e) =>
                                    updateCandidateName(
                                      party.name,
                                      candidateIndex,
                                      e.target.value
                                    )
                                  }
                                  className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                />
                              ) : (
                                <p className='flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800'>
                                  {candidate.name}
                                </p>
                              )}
                              {candidate.isNew && (
                                <motion.button
                                  onClick={() =>
                                    deleteCandidate(party.name, candidateIndex)
                                  }
                                  className='p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 transition-colors'
                                  variants={buttonVariants}
                                  whileHover='hover'
                                  whileTap='tap'
                                  title='প্রার্থী মুছুন'
                                >
                                  <Image
                                    src='/images/serveyLogo/remove.png'
                                    alt='Delete'
                                    width={16}
                                    height={16}
                                  />
                                </motion.button>
                              )}
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                    {/* Add new candidate button */}
                    <motion.button
                      onClick={() => startAddingCandidate(party.name)}
                      className='flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md border border-green-200 transition-colors w-full sm:w-auto text-sm sm:text-base'
                      variants={buttonVariants}
                      whileHover='hover'
                      whileTap='tap'
                    >
                      <Image
                        src='/images/serveyLogo/add.png'
                        alt='Add'
                        width={16}
                        height={16}
                      />
                      নতুন প্রার্থী যোগ করুন
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Party Button */}
            <motion.div className='mt-4 sm:mt-6'>
              <motion.button
                onClick={addNewParty}
                disabled={partiesLoading || parties.length === 0}
                className='w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-md border border-blue-200 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                variants={buttonVariants}
                whileHover={
                  partiesLoading || parties.length === 0 ? {} : "hover"
                }
                whileTap={partiesLoading || parties.length === 0 ? {} : "tap"}
              >
                <Image
                  src='/images/serveyLogo/add.png'
                  alt='Add'
                  width={16}
                  height={16}
                />
                নতুন দল যোগ করুন
              </motion.button>
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
                onClick={handleNext}
                disabled={isUpdating}
                className='flex-grow text-center rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-3 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
                variants={buttonVariants}
                whileHover={isUpdating ? {} : "hover"}
                whileTap={isUpdating ? {} : "tap"}
              >
                {isUpdating ? "সংরক্ষণ হচ্ছে..." : "পরবর্তী ধাপে যান"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
