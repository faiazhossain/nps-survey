"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthState, fetchUserProfile } from "../../store/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://npsbd.xyz/api/login", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: formData.username,
          password: formData.password,
          scope: "",
          client_id: "string",
          client_secret: "********",
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token
        if (formData.remember) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("token_type", data.token_type);
        } else {
          sessionStorage.setItem("access_token", data.access_token);
          sessionStorage.setItem("token_type", data.token_type);
        }

        // Update Redux state
        dispatch(setAuthState(true));

        // Fetch user profile after login
        dispatch(fetchUserProfile());

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || "লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

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
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {error && (
            <motion.div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className='space-y-4 text-[#636970]'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor='username' className='block text-sm font-medium'>
                ইমেইল
              </label>
              <input
                id='username'
                name='username'
                type='email'
                value={formData.username}
                onChange={handleInputChange}
                placeholder='abcd@example.com'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006747]'
                required
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
                value={formData.password}
                onChange={handleInputChange}
                placeholder='*******'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006747]'
                required
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
                checked={formData.remember}
                onChange={handleInputChange}
                className='h-4 w-4 rounded border-gray-300'
              />
              <label htmlFor='remember' className='ml-2 block text-sm'>
                লগইন মনে রাখুন
              </label>
            </motion.div>
          </div>

          <motion.button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-2 mt-4 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed'
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
