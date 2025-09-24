'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthHeaders } from '../utils/auth';

export default function SurveyFormStep5({ onPrevious, onNext }) {
  const [partyData, setPartyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { currentSurveyId, isUpdating } = useSelector(
    (state) => state.surveyCreate
  );

  // Fetch party details from API
  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://npsbd.xyz/api/party/details/201',
          {
            headers: {
              accept: 'application/json',
              ...getAuthHeaders(),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to a more manageable format
        const transformedData = data.দল.map((party) => {
          const partyName = Object.keys(party)[0];
          const candidates = party[partyName];
          return {
            name: partyName,
            candidates: candidates.map((candidate, index) => ({
              id: `${partyName}_${index}`,
              name: candidate,
            })),
          };
        });

        setPartyData(transformedData);
      } catch (error) {
        console.error('Error fetching party details:', error);
        setError('পার্টি তথ্য লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetails();
  }, []);

  // Add new candidate to a party
  const addNewCandidate = (partyName, newCandidateName) => {
    setPartyData((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidateId = `${partyName}_${party.candidates.length}`;
          return {
            ...party,
            candidates: [
              ...party.candidates,
              { id: newCandidateId, name: newCandidateName },
            ],
          };
        }
        return party;
      })
    );
  };

  // Delete candidate from a party
  const deleteCandidate = (partyName, candidateIndex) => {
    setPartyData((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidates = party.candidates.filter(
            (_, index) => index !== candidateIndex
          );
          // Reassign IDs to maintain consistency
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

  // Add new party
  const addNewParty = () => {
    const newPartyName = `নতুন দল ${partyData.length + 1}`;
    setPartyData((prevData) => [
      ...prevData,
      {
        name: newPartyName,
        candidates: [],
      },
    ]);
  };

  // Update party name
  const updatePartyName = (oldName, newName) => {
    setPartyData((prevData) =>
      prevData.map((party) =>
        party.name === oldName
          ? {
              ...party,
              name: newName,
              candidates: party.candidates.map((candidate) => ({
                ...candidate,
                id: `${newName}_${candidate.id.split('_')[1]}`,
              })),
            }
          : party
      )
    );
  };

  // Update candidate selection
  const updateCandidateSelection = (
    partyName,
    candidateIndex,
    selectedName
  ) => {
    setPartyData((prevData) =>
      prevData.map((party) => {
        if (party.name === partyName) {
          const newCandidates = [...party.candidates];
          newCandidates[candidateIndex] = {
            id: `${partyName}_${candidateIndex}`,
            name: selectedName,
          };
          return { ...party, candidates: newCandidates };
        }
        return party;
      })
    );
  };

  // Handle next button click
  const handleNext = async () => {
    if (!currentSurveyId) {
      alert('সার্ভে ID পাওয়া যায়নি। আগের ধাপে ফিরে যান।');
      return;
    }

    // Prepare the candidate details data in the required format
    const availPartyDetailsData = {
      avail_party_details: {
        দল: partyData
          .filter((party) => party.candidates.length > 0)
          .map((party) => {
            const filteredCandidates = party.candidates
              .filter(
                (candidate) =>
                  candidate.name.trim() !== '' && candidate.name !== 'add_new'
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
      // Send PATCH request to update survey with candidate details
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/${currentSurveyId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(availPartyDetailsData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      console.log('Survey updated successfully with candidate details');

      // Navigate to next step after successful API call
      onNext();
    } catch (error) {
      console.error('Error updating survey:', error);
      alert('সার্ভে আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  // Convert number to Bengali numeral
  const toBengaliNumber = (num) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .split('')
      .map((digit) => bengaliNumbers[parseInt(digit)])
      .join('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
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
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
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
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.2,
      },
    },
  };

  // Get all candidates for dropdown
  const allCandidates = partyData
    .flatMap((party) => party.candidates.map((candidate) => candidate.name))
    .filter((name) => name.trim() !== '');

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key='step5'
        className='min-h-screen p-2 sm:p-4 lg:p-6 max-w-4xl mx-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {/* Location Header */}
        <motion.div
          className='flex items-center gap-2 mb-4 sm:mb-6'
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src='/images/serveyLogo/mapPoint.png'
              alt='Location'
              width={20}
              height={20}
              className='sm:w-6 sm:h-6'
            />
          </motion.div>
          <div>
            <p className='text-sm sm:text-base text-gray-600'>
              বর্তমান অবস্থান
            </p>
            <p className='text-sm sm:text-base font-medium'>
              ব্রাহ্মনবাড়িয়া পুলিশ লাইনস
            </p>
          </div>
        </motion.div>

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
            animate={{ opacity: 1, scale: 1 }}
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

        {/* Loading State */}
        {loading && (
          <motion.div
            className='flex justify-center items-center py-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className='text-lg text-gray-600'>তথ্য লোড হচ্ছে...</div>
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && (
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
                  key={party.name}
                  className='bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm'
                  variants={cardVariants}
                  initial='hidden'
                  animate='visible'
                  whileHover='hover'
                >
                  {/* Party Name */}
                  <div className='flex justify-between items-center mb-3 sm:mb-4'>
                    <input
                      type='text'
                      value={party.name}
                      onChange={(e) =>
                        updatePartyName(party.name, e.target.value)
                      }
                      className='text-base sm:text-lg font-semibold text-gray-800 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full'
                    />
                  </div>

                  {/* Candidates */}
                  <div className='space-y-3'>
                    {party.candidates.map((candidate, candidateIndex) => (
                      <motion.div
                        key={candidate.id}
                        className='space-y-2 sm:space-y-0'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: candidateIndex * 0.1 }}
                      >
                        {/* Mobile Layout */}
                        <div className='sm:hidden'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {toBengaliNumber(candidateIndex + 1)} নং প্রার্থীর
                            নাম
                          </label>
                          <div className='flex items-center gap-2'>
                            <select
                              value={candidate.name}
                              onChange={(e) =>
                                updateCandidateSelection(
                                  party.name,
                                  candidateIndex,
                                  e.target.value
                                )
                              }
                              className='flex-1 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            >
                              <option value=''>প্রার্থী নির্বাচন করুন</option>
                              {allCandidates.map((candidateName, index) => (
                                <option key={index} value={candidateName}>
                                  {candidateName}
                                </option>
                              ))}
                              <option value='add_new'>
                                নতুন প্রার্থী যোগ করুন
                              </option>
                            </select>
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
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className='hidden sm:flex items-center gap-3'>
                          <label className='text-sm font-medium text-gray-700 min-w-[140px] lg:min-w-[120px]'>
                            {toBengaliNumber(candidateIndex + 1)} নং প্রার্থীর
                            নাম
                          </label>
                          <select
                            value={candidate.name}
                            onChange={(e) =>
                              updateCandidateSelection(
                                party.name,
                                candidateIndex,
                                e.target.value
                              )
                            }
                            className='flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                          >
                            <option value=''>প্রার্থী নির্বাচন করুন</option>
                            {allCandidates.map((candidateName, index) => (
                              <option key={index} value={candidateName}>
                                {candidateName}
                              </option>
                            ))}
                            <option value='add_new'>
                              নতুন প্রার্থী যোগ করুন
                            </option>
                          </select>
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
                        </div>

                        {candidate.name === 'add_new' && (
                          <input
                            type='text'
                            placeholder='নতুন প্রার্থীর নাম লিখুন'
                            onBlur={(e) => {
                              if (e.target.value.trim() !== '') {
                                addNewCandidate(party.name, e.target.value);
                              }
                            }}
                            className='w-full sm:ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base'
                          />
                        )}
                      </motion.div>
                    ))}
                    {/* Add new candidate button */}
                    <motion.button
                      onClick={() =>
                        updateCandidateSelection(
                          party.name,
                          party.candidates.length,
                          'add_new'
                        )
                      }
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
                className='w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-md border border-blue-200 transition-colors text-sm sm:text-base'
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
                whileHover={isUpdating ? {} : 'hover'}
                whileTap={isUpdating ? {} : 'tap'}
              >
                {isUpdating ? 'সংরক্ষণ হচ্ছে...' : 'পরবর্তী ধাপে যান'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
