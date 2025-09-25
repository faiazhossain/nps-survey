'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthState, fetchUserProfile } from '../../store/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://npsbd.xyz/api/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: formData.username,
          password: formData.password,
          scope: '',
          client_id: 'string',
          client_secret: '********',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (formData.remember) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('token_type', data.token_type);
        } else {
          sessionStorage.setItem('access_token', data.access_token);
          sessionStorage.setItem('token_type', data.token_type);
        }

        dispatch(setAuthState(true));
        dispatch(fetchUserProfile());
        router.push('/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || 'লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <Image
            src='/images/nps_logo.png'
            alt='NPS Logo'
            width={120}
            height={120}
            className='mx-auto'
          />
          <h1 className='mt-6 text-black text-2xl font-bold'>
            আপনার একাউন্টে লগইন করুন
          </h1>
          <p className='mt-2 text-[#636970]'>
            সার্ভে শুরু করতে আপনার একাউন্টে প্রবেশ করুন
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          )}

          <div className='space-y-4 text-[#636970]'>
            <div>
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
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium'>
                পাসওয়ার্ড
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='*******'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#006747]'
                  required
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute inset-y-0 right-0 flex items-center pr-3'
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className='h-5 w-5 text-gray-400' />
                  ) : (
                    <AiOutlineEye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            <div className='flex items-center'>
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
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-md bg-gradient-to-b from-[#006747] to-[#005737] px-4 py-2 mt-4 text-white hover:bg-gradient-to-b hover:from-[#005747] hover:to-[#003f2f] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
