import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscCalendar, VscCheck, VscStarFull } from 'react-icons/vsc';
import { AiFillGift } from 'react-icons/ai';
import { INVESTMENT_PLANS } from '../data/investmentPlans';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function planDisplayTitle(name) {
  if (!name) return '';
  const t = String(name).trim();
  return /\bplan\b/i.test(t) ? t : `${t} Plan`;
}

const Plans = ({ onInvestPlan, mode = 'dashboard' }) => {
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
  const investmentPlans = INVESTMENT_PLANS;

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

  const isPreLaunch = mode === 'preLaunch';

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-0">
      {/* Pre-Launch Staking hero + offer */}
      {isPreLaunch && (
        <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-purple-600/20 to-fuchsia-600/15 p-4 sm:p-6 md:p-8">
          <div className="absolute -right-6 -top-6 text-8xl sm:text-9xl opacity-10 pointer-events-none select-none" aria-hidden>🎁</div>
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-amber-300/50">
                <AiFillGift className="text-white w-10 h-10 sm:w-12 sm:h-12" aria-hidden />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-amber-300/90 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Limited time</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Pre Launching Staking</h2>
              <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm">
                <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                  <span className="font-semibold text-amber-300">Pre Launching Staking Offer —</span>{' '}
                  If you stake money during this period, you will get{' '}
                  <span className="font-bold text-green-400 text-lg sm:text-xl">4X</span>{' '}
                  return on your investment.
                </p>
                <p className="text-white/50 text-xs mt-2">Same plans as the main dashboard. Stake now to lock in this launch multiplier.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header (dashboard) */}
      {!isPreLaunch && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Investment Plans</h2>
          <p className="text-white/60 text-sm sm:text-base">Choose the perfect plan that matches your investment goals</p>
        </div>
      )}

      {!isPreLaunch ? null : (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Staking plans</h3>
          <p className="text-white/60 text-sm sm:text-base">Pick a plan — each card is eligible for the pre-launch offer while it lasts</p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {investmentPlans.map((plan) => {
          const example = calculateExample(plan);
          const isDemoPlanPurchased = plan.name === 'Demo Plan' && hasPurchasedDemoPlan;
          return (
            <div
              key={plan.id}
              className={`relative bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm transition-all ${
                isDemoPlanPurchased 
                  ? 'opacity-60' 
                  : 'hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20'
              } ${isPreLaunch ? 'ring-1 ring-amber-400/25' : ''}`}
            >
              {isPreLaunch && (
                <div
                  className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-1 shadow-md"
                  title="Pre-launch staking gift offer"
                >
                  <AiFillGift className="text-white w-4 h-4" aria-hidden />
                  <span className="text-white text-[10px] sm:text-xs font-bold uppercase">Gift</span>
                </div>
              )}
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

              <h3 className="text-2xl font-bold text-white mb-2">{planDisplayTitle(plan.name)}</h3>
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

              {/* Invest in this plan - same shape as Invest's plan (id, name, minAmount, maxAmount, dailyReturn, duration, totalReturn, color) */}
              {onInvestPlan && (
                <button
                  type="button"
                  onClick={() => onInvestPlan({ id: plan.id, name: plan.name, minAmount: plan.minAmount, maxAmount: plan.maxAmount, dailyReturn: plan.dailyReturn, duration: plan.duration, totalReturn: plan.totalReturn, color: plan.color })}
                  disabled={isDemoPlanPurchased}
                  className={`w-full mt-4 min-h-[44px] rounded-lg font-semibold transition-opacity ${
                    isDemoPlanPurchased ? 'opacity-50 cursor-not-allowed bg-white/10 text-white/60' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90'
                  }`}
                >
                  {isDemoPlanPurchased ? 'Already Purchased' : 'Invest in this plan'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <VscCalendar className="text-purple-400" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">How It Works</h3>
          </div>
          <ol className="space-y-3 text-white/80 text-sm">
            {isPreLaunch && (
              <li className="flex gap-3 rounded-lg bg-amber-500/10 border border-amber-400/20 p-3 -mt-1 mb-2">
                <span className="text-amber-400 font-bold">★</span>
                <span>
                  <strong className="text-amber-200">Pre-launch window:</strong> Stake during this period to qualify for the{' '}
                  <strong className="text-green-400">4X</strong> return on investment offer shown above.
                </span>
              </li>
            )}
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

        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              {isPreLaunch ? (
                <AiFillGift className="text-green-400" size={24} />
              ) : (
                <VscCheck className="text-green-400" size={24} />
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">{isPreLaunch ? 'Launch gift' : 'Benefits'}</h3>
          </div>
          <ul className="space-y-3 text-white/80 text-sm">
            {isPreLaunch && (
              <li className="flex items-start gap-3">
                <AiFillGift className="text-amber-400 mt-0.5 flex-shrink-0" size={18} />
                <span>
                  <strong className="text-white">4X ROI</strong> — promotional multiplier for stakes placed during the pre-launch staking period (see platform terms).
                </span>
              </li>
            )}
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

