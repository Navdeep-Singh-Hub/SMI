import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscCalendar, VscCheck, VscStarFull } from 'react-icons/vsc';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Plans = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [hasPurchasedDemoPlan, setHasPurchasedDemoPlan] = useState(false);

  useEffect(() => {
    checkDemoPlanStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkDemoPlanStatus = async () => {
    try {
      const token = await getAccessTokenSilently();
      if (!token) return;

      const response = await fetch(`${API_BASE}/invest/check-demo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHasPurchasedDemoPlan(data.hasPurchasedDemoPlan || false);
      }
    } catch (error) {
      console.error('Error checking demo plan status:', error);
    }
  };
  const investmentPlans = [
    {
      id: 1,
      name: 'Demo Plan',
      minAmount: 50,
      maxAmount: 499,
      dailyReturn: 2.5,
      duration: 7,
      totalReturn: 17.5,
      color: 'from-blue-500 to-blue-600',
      icon: '💎',
      description: 'Perfect for beginners looking to start their investment journey',
      features: [
        'Daily returns paid directly to wallet',
        'Principal returned at plan completion',
        '24/7 customer support',
        'Risk-free trial period'
      ]
    },
    {
      id: 2,
      name: 'Bronze',
      minAmount: 500,
      maxAmount: 1999,
      dailyReturn: 3.0,
      duration: 14,
      totalReturn: 42.0,
      color: 'from-orange-500 to-orange-600',
      icon: '🥉',
      description: 'Ideal for investors ready to scale up their portfolio',
      features: [
        'Higher daily returns',
        '14-day investment period',
        'Priority support',
        'Early withdrawal option available'
      ]
    },
    {
      id: 3,
      name: 'Silver',
      minAmount: 2000,
      maxAmount: 9999,
      dailyReturn: 3.5,
      duration: 21,
      totalReturn: 73.5,
      color: 'from-gray-400 to-gray-500',
      icon: '🥈',
      description: 'For serious investors seeking substantial returns',
      features: [
        'Premium returns rate',
        'Extended 21-day duration',
        'Dedicated account manager',
        'Bonus rewards on completion'
      ]
    },
    {
      id: 4,
      name: 'Gold',
      minAmount: 10000,
      maxAmount: 49999,
      dailyReturn: 4.0,
      duration: 30,
      totalReturn: 120.0,
      icon: '🥇',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Exclusive plan for high-value investors',
      features: [
        'Maximum daily returns',
        '30-day investment cycle',
        'Personal investment advisor',
        'VIP support channel',
        'Exclusive bonus opportunities'
      ]
    },
    {
      id: 5,
      name: 'Platinum',
      minAmount: 50000,
      maxAmount: 999999,
      dailyReturn: 5.0,
      duration: 30,
      totalReturn: 150.0,
      icon: '💠',
      color: 'from-purple-500 to-purple-600',
      description: 'Ultimate investment experience for premium investors',
      features: [
        'Highest return rate available',
        'Flexible duration options',
        'One-on-one investment consultation',
        'Exclusive investment opportunities',
        'Priority access to new features',
        'Customized investment strategies'
      ]
    }
  ];

  const calculateExample = (plan) => {
    const exampleAmount = Math.min(plan.minAmount + 100, plan.maxAmount);
    const dailyEarning = (exampleAmount * plan.dailyReturn) / 100;
    const totalEarning = dailyEarning * plan.duration;
    return {
      amount: exampleAmount,
      daily: dailyEarning.toFixed(2),
      total: totalEarning.toFixed(2)
    };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Investment Plans</h2>
        <p className="text-white/60">Choose the perfect plan that matches your investment goals</p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {investmentPlans.map((plan) => {
          const example = calculateExample(plan);
          const isDemoPlanPurchased = plan.name === 'Demo Plan' && hasPurchasedDemoPlan;
          return (
            <div
              key={plan.id}
              className={`bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm transition-all ${
                isDemoPlanPurchased 
                  ? 'opacity-60' 
                  : 'hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20'
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-3xl ${
                  isDemoPlanPurchased ? 'opacity-50' : ''
                }`}>
                  {plan.icon}
                </div>
                <div className="flex items-center gap-2">
                  {isDemoPlanPurchased && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <span className="text-yellow-400 text-xs font-semibold">Purchased</span>
                    </div>
                  )}
                  {plan.id === 5 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <VscStarFull className="text-yellow-400" size={16} />
                      <span className="text-yellow-400 text-xs font-semibold">Premium</span>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name} Plan</h3>
              <p className="text-white/60 text-sm mb-4">{plan.description}</p>

              {/* Plan Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Investment Range:</span>
                  <span className="text-white font-semibold">
                    ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Daily Return:</span>
                  <span className="text-green-400 font-bold text-lg">{plan.dailyReturn}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Duration:</span>
                  <span className="text-white font-semibold">{plan.duration} days</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-white/60 text-sm">Total Return:</span>
                  <span className="text-green-400 font-bold text-xl">{plan.totalReturn}%</span>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
                <p className="text-white/60 text-xs mb-2">Example with ${example.amount.toLocaleString()}:</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Daily Earning:</span>
                    <span className="text-green-400 font-semibold">${example.daily}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Total Earning:</span>
                    <span className="text-green-400 font-bold">${example.total}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-semibold mb-2">Features:</p>
                <ul className="space-y-1.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/70 text-xs">
                      <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <VscCalendar className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">How It Works</h3>
          </div>
          <ol className="space-y-3 text-white/80 text-sm">
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <span>Choose your preferred investment plan based on your budget and goals</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Invest any amount within the plan's minimum and maximum range</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <span>Receive daily returns directly to your wallet at the specified percentage</span>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Your principal investment is returned at the end of the plan duration</span>
            </li>
          </ol>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <VscCheck className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Benefits</h3>
          </div>
          <ul className="space-y-3 text-white/80 text-sm">
            <li className="flex items-start gap-3">
              <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
              <span>All returns are guaranteed and paid daily</span>
            </li>
            <li className="flex items-start gap-3">
              <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
              <span>Principal investment is fully protected and returned</span>
            </li>
            <li className="flex items-start gap-3">
              <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
              <span>Multiple plans to suit different investment levels</span>
            </li>
            <li className="flex items-start gap-3">
              <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
              <span>Transparent and secure investment process</span>
            </li>
            <li className="flex items-start gap-3">
              <VscCheck className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
              <span>24/7 customer support for all investors</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Plans;

