import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signUpI from "../assets/signUpI.png";
import api from '../api/axios';

export const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await api.post('/auth/login/', {
            identifier, // instead of email
            password
          });
          
      // Save token and user data to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Login success:', response.data);
      
      // Redirect to dashboard after successful login
      navigate('/predict');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.non_field_errors || 
        'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-row h-screen overflow-hidden px-4'>
      {/* Image Section */}
      <div className='w-1/2 h-[90%] rounded-xl overflow-hidden'>
        <img src={signUpI} alt="Login" className="w-full h-full object-cover rounded-xl" />
      </div>

      {/* Form Section */}
      <div className='flex flex-col justify-center items-center gap-3 w-1/2 h-full overflow-hidden'>
        <div className='flex flex-col gap-1 w-[75%]'>
          <h2 className='font-bold text-2xl text-black'>Sign in to your account</h2>
          <p className='text-black opacity-50 text-sm'>
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded w-[75%] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
          {/* Google Sign In Button */}
          <button 
            type="button"
            className='border text-sm text-[#28887A] border-[#28887A] w-[75%] py-1 rounded-md flex items-center justify-center gap-2'
          >
            {/* Google Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M17.64,9.2c0-0.637-0.057-1.251-0.164-1.84H9v3.481h4.844c-0.209,1.125-0.843,2.078-1.796,2.717v2.258h2.908C16.658,14.2,17.64,11.9,17.64,9.2z" fill="#4285F4"/>
                <path d="M9,18c2.43,0,4.467-0.806,5.956-2.18l-2.908-2.259c-0.806,0.54-1.837,0.86-3.048,0.86c-2.344,0-4.328-1.584-5.036-3.711H0.957v2.332C2.438,15.983,5.482,18,9,18z" fill="#34A853"/>
                <path d="M3.964,10.71C3.784,10.17,3.682,9.593,3.682,9c0-0.593,0.102-1.17,0.282-1.71V4.958H0.957C0.347,6.173,0,7.548,0,9s0.348,2.827,0.957,4.042L3.964,10.71z" fill="#FBBC05"/>
                <path d="M9,3.58c1.321,0,2.508,0.454,3.44,1.345l2.582-2.581C13.463,0.891,11.426,0,9,0C5.482,0,2.438,2.017,0.957,4.958L3.964,7.29C4.672,5.163,6.656,3.58,9,3.58z" fill="#EA4335"/>
              </g>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center w-[75%] gap-2 my-2">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-xs text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Email */}
          <div className='w-[75%]'>
          <label className='text-black text-xs block text-left mb-1'>Email or Username</label>
<input
  type="text"
  className="rounded-md px-2 py-1 border border-[#28887A] w-full text-sm text-black"
  placeholder="Enter your email or username"
  value={identifier}
  onChange={(e) => setIdentifier(e.target.value)}
  required
/>

          </div>

          {/* Password */}
          <div className='w-[75%] mt-2'>
            <label className='text-black text-xs block text-left mb-1'>Password</label>
            <input
              type="password"
              className="rounded-md px-2 py-1 border border-[#28887A] w-full text-sm text-black"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className='w-[75%] flex justify-end mt-1'>
            <a href="#" className='text-xs text-[#28887A] font-semibold'>
              I forgot my password
            </a>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className={`text-sm text-white bg-[#28887A] w-[75%] py-1 rounded-md mt-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign Up */}
        <div className='text-center text-sm mt-2'>
          <p className='text-black'>
            Don't have an account? <Link to="/signup" className="text-[#28887A] font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};