import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [responseMessage, setResponseMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    
    if (isNaN(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only take the last character
    setOtp(newOtp);
    
    // Move to next input if current input is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
    
    // Check if all inputs are filled
    if (newOtp.every(num => num !== '')) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    const pasteNumbers = pasteData.split('').filter(char => !isNaN(char));
    
    if (pasteNumbers.length === length) {
      const newOtp = [...otp];
      pasteNumbers.forEach((num, i) => {
        if (i < length) {
          newOtp[i] = num;
        }
      });
      setOtp(newOtp);
      verifyOTP(newOtp.join(''));
    }
  };

  const verifyOTP = async (otpCode) => {
    setIsSubmitting(true);
    setResponseMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_KEY}/otp`, { otp: otpCode });
      setResponseMessage(response.data.message);
      if (response.data.success) {
        onComplete(otpCode);
        console.log(response.data)
        const userId = response.data.data._id
        Cookies.set('userId', userId, { expires: 7 });
        navigate("/");
      }
    } catch (err) {
      setResponseMessage(err.response?.data?.message || 'Verification failed. Please try again.');
      // Clear OTP on failure
      setOtp(Array(length).fill(''));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    setResponseMessage('Sending new code...');
    try {
      const response = await axios.post(`${import.meta.env.VITE_KEY}/resend-otp`);
      setResponseMessage(response.data.message);
    } catch (err) {
      setResponseMessage(err.response?.data?.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
        {responseMessage && (
          <p className={`mt-2 ${responseMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {responseMessage}
          </p>
        )}
        <p className="mt-2 text-gray-600">
          We've sent a {length}-digit code to your email address
        </p>
      </div>
      
      <div className="flex space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => (inputRefs.current[index] = el)}
            disabled={isSubmitting}
            className="w-12 h-12 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-gray-500">
          Didn't receive a code?{' '}
          <button 
            onClick={resendOTP}
            disabled={isSubmitting}
            className="text-indigo-600 font-medium hover:text-indigo-500 disabled:opacity-50"
          >
            Resend Code
          </button>
        </p>
      </div>
      
      <button
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150 disabled:opacity-50"
        disabled={!otp.every(num => num !== '') || isSubmitting}
        onClick={() => verifyOTP(otp.join(''))}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </>
        ) : 'Verify'}
      </button>
    </div>
  );
};

const OTPVerificationPage = () => {
  const handleOTPComplete = (otp) => {
    console.log('OTP verified:', otp);
    // Handle successful verification (e.g., redirect user)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <OTPInput length={4} onComplete={handleOTPComplete} />
      </div>
    </div>
  );
};

export default OTPVerificationPage;