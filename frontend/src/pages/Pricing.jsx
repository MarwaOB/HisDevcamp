import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/axios';  // Make sure you've set this up correctly


const Pricing = () => {
  const [billingType, setBillingType] = useState('yearly');

  const plans = {
    monthly: [
      {
        title: 'Basic Plan',
        price: '8000 DZ/Month',
        planCode: 'BASIC_MONTHLY',
        description: 'Prediction limited to 150 try. Features: Basic Prediction, statistics.',
      },
      {
        title: 'Premium Plan',
        price: '10000 DZ/Month',
        planCode: 'PREMIUM_MONTHLY',
        description: 'Prediction unlimited. Features: Prediction, statistics, generate reporting.',
      },
    ],
    yearly: [
      {
        title: 'Basic Plan',
        price: '80000 DZ/Year',
        planCode: 'BASIC_ANNUAL',
        description: 'Prediction limited to 1500 try. Features: Basic Prediction, statistics and annual discount.',
      },
      {
        title: 'Premium Plan',
        price: '100000 DZ/Year',
        planCode: 'PREMIUM_ANNUAL',
        description: 'Prediction unlimited. Features: Prediction, statistics, generate reporting and annual discount.',
      },
    ],
  };

  const handleSubscribe = async (planCode) => {
    try {
      const res = await api.post('/auth/choose-plan/', {
        plan: planCode,  // Changed from planCode to plan
      });
  
      alert(res.data.message);
    } catch (error) {
      console.error(error.response?.data);
      alert(
        error.response?.data?.error || 'Failed to subscribe. Please try again.'
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-white ml-[200px] p-6">
      {/* Header */}
      <div className="flex justify-end items-center mb-8 gap-4">
        <button className="rounded-full bg-yellow-300 w-10 h-10 text-center font-bold">EI</button>
        <div>
          <p className="font-medium text-sm">ELBAR</p>
          <p className="text-xs text-gray-500">Imane</p>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-serif text-center font-semibold mb-6">
        Flexible Plans For Every Need
      </h1>

      {/* Billing Toggle */}
      <div className="flex justify-center space-x-2 mb-10">
        {['monthly', 'yearly'].map((type) => (
          <button
            key={type}
            className={`px-4 py-1 rounded border ${
              billingType === type ? 'bg-teal-700 text-white' : 'bg-white text-gray-700'
            }`}
            onClick={() => setBillingType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Billing
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-8 justify-center items-start max-w-2xl mx-auto">
        {plans[billingType].map((plan, index) => (
          <div
            key={index}
            className={`p-6 min-h-[400px] rounded-lg shadow-md flex flex-col justify-between ${
              index === 0
                ? 'bg-white border border-[#1f6d60] text-[#000000]'
                : 'bg-[#1f6d60] text-[#ffffff]'
            }`}
          >
            <div>
              <h2 className="text-sm font-semibold">{plan.title}</h2>
              <p className="text-xl font-medium mt-2">{plan.price}</p>
              <p className="text-sm mt-4 whitespace-pre-line">{plan.description}</p>
            </div>
            <button
              onClick={() => handleSubscribe(plan.planCode)}
              className={`mt-6 py-2 rounded w-[150px] justify-center border mx-auto ${
                index === 0
                  ? 'bg-[#1f6d60] text-white hover:bg-white hover:text-black border-[#1f6d60]'
                  : 'bg-white text-black hover:bg-white hover:text-[#1f6d60] border-white'
              }`}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
