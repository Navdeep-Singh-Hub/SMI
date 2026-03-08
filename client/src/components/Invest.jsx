import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscCreditCard, VscGraph, VscCalendar, VscCheck } from 'react-icons/vsc';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Invest = ({ initialPlanForInvest = null, onClearInitialPlan }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'active'
  const [hasPurchasedDemoPlan, setHasPurchasedDemoPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);

  const investmentPlans = [
    {
      id: 1,
      name: 'Demo Plan',
      minAmount: 50,
      maxAmount: 499,
      dailyReturn: 2.5,
      duration: 7,
      totalReturn: 17.5,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Bronze',
      minAmount: 500,
      maxAmount: 1999,
      dailyReturn: 3.0,
      duration: 14,
      totalReturn: 42.0,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 3,
      name: 'Silver',
      minAmount: 2000,
      maxAmount: 9999,
      dailyReturn: 3.5,
      duration: 21,
      totalReturn: 73.5,
      color: 'from-gray-400 to-gray-500'
    },
    {
      id: 4,
      name: 'Gold',
      minAmount: 10000,
      maxAmount: 49999,
      dailyReturn: 4.0,
      duration: 30,
      totalReturn: 120.0,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 5,
      name: 'Platinum',
      minAmount: 50000,
      maxAmount: 999999,
      dailyReturn: 5.0,
      duration: 30,
      totalReturn: 150.0,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const fetchActiveInvestments = async () => {
    try {
      setLoadingActive(true);
      const token = await getAccessTokenSilently();
      if (!token) return;
      const response = await fetch(`${API_BASE}/invest/active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveInvestments(data.investments || []);
      }
    } catch (err) {
      console.error('Fetch active investments error:', err);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    checkDemoPlanStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'active') fetchActiveInvestments();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // When parent passes a plan from Plans page, pre-select it and show invest form
  useEffect(() => {
    if (initialPlanForInvest) {
      setSelectedPlan(initialPlanForInvest);
      setActiveTab('plans');
      if (typeof onClearInitialPlan === 'function') onClearInitialPlan();
    }
  }, [initialPlanForInvest]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const calculateReturns = (amount, dailyReturn, duration) => {
    const dailyEarning = (amount * dailyReturn) / 100;
    const totalEarning = dailyEarning * duration;
    return {
      daily: dailyEarning.toFixed(2),
      total: totalEarning.toFixed(2)
    };
  };

  const calculateTodaysEarnings = (amount, dailyReturn) => {
    return (amount * dailyReturn) / 100;
  };

  const getTotalTodaysEarnings = () => {
    return activeInvestments.reduce((total, investment) => {
      return total + calculateTodaysEarnings(investment.amount, investment.dailyReturn);
    }, 0);
  };

  const handleInvest = (plan) => {
    // Prevent selecting Demo Plan if already purchased
    if (plan.name === 'Demo Plan' && hasPurchasedDemoPlan) {
      alert('Demo Plan can only be purchased once. You have already purchased this plan.');
      return;
    }
    setSelectedPlan(plan);
    setActiveTab('plans');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInvestmentAmount(value);
    }
  };

  const handleSubmitInvestment = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !investmentAmount) return;

    const amount = parseFloat(investmentAmount);
    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      alert(`Amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}`);
      return;
    }

    // Prevent Demo Plan purchase if already purchased
    if (selectedPlan.name === 'Demo Plan' && hasPurchasedDemoPlan) {
      alert('Demo Plan can only be purchased once. You have already purchased this plan.');
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      if (!token) {
        alert('Please login to continue');
        return;
      }

      const response = await fetch(`${API_BASE}/invest/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: amount
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Investment of $${amount} in ${selectedPlan.name} plan created successfully!`);
        setInvestmentAmount('');
        setSelectedPlan(null);
        if (selectedPlan.name === 'Demo Plan') setHasPurchasedDemoPlan(true);
        window.dispatchEvent(new Event('balanceUpdated'));
        fetchActiveInvestments();
      } else {
        alert(data.message || 'Failed to create investment. Please try again.');
        if (data.alreadyPurchased) {
          setHasPurchasedDemoPlan(true);
        }
      }
    } catch (error) {
      console.error('Investment error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Invest</h2>
        <p className="text-white/60 text-sm sm:text-base">Choose an investment plan and start earning</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-white/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab('plans')}
          className={`min-h-[44px] px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'plans'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Investment Plans
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`min-h-[44px] px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'active'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Active ({activeInvestments.length})
        </button>
      </div>

      {activeTab === 'plans' && (
        <>
          {/* Investment Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {investmentPlans.map((plan) => {
              const isDemoPlanPurchased = plan.name === 'Demo Plan' && hasPurchasedDemoPlan;
              return (
                <div
                  key={plan.id}
                  className={`bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm transition-all ${
                    selectedPlan?.id === plan.id ? 'ring-2 ring-purple-500' : ''
                  } ${
                    isDemoPlanPurchased 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-white/15 cursor-pointer'
                  }`}
                >
                  {isDemoPlanPurchased && (
                    <div className="mb-3 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
                      <span className="text-yellow-400 text-xs font-semibold">Already Purchased</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4 ${
                    isDemoPlanPurchased ? 'opacity-50' : ''
                  }`}>
                    <VscCreditCard className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name} Plan</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Min Investment:</span>
                    <span className="text-white font-semibold">${plan.minAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Max Investment:</span>
                    <span className="text-white font-semibold">${plan.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Daily Return:</span>
                    <span className="text-green-400 font-semibold">{plan.dailyReturn}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Duration:</span>
                    <span className="text-white font-semibold">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                    <span className="text-white/60">Total Return:</span>
                    <span className="text-green-400 font-bold">{plan.totalReturn}%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleInvest(plan)}
                  disabled={isDemoPlanPurchased}
                  className={`w-full min-h-[44px] py-2 rounded-lg bg-gradient-to-r ${plan.color} text-white font-semibold transition-opacity ${
                    isDemoPlanPurchased 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:opacity-90'
                  }`}
                >
                  {isDemoPlanPurchased ? 'Already Purchased' : 'Select Plan'}
                </button>
              </div>
            );
            })}
          </div>

          {/* Investment Form */}
          {selectedPlan && (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${selectedPlan.color} rounded-lg`}>
                  <VscGraph className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Invest in {selectedPlan.name} Plan</h3>
                  <p className="text-white/60 text-sm">Enter your investment amount</p>
                </div>
              </div>

              <form onSubmit={handleSubmitInvestment} className="space-y-6">
                <div>
                  <label htmlFor="investAmount" className="block text-white/80 mb-2 font-medium">
                    Investment Amount (USD)
                  </label>
                  <input
                    id="investAmount"
                    type="text"
                    value={investmentAmount}
                    onChange={handleAmountChange}
                    placeholder={`Min: $${selectedPlan.minAmount.toLocaleString()} - Max: $${selectedPlan.maxAmount.toLocaleString()}`}
                    className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                  {investmentAmount && (
                    <div className="mt-3 p-4 bg-white/5 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Daily Earnings:</span>
                        <span className="text-green-400 font-semibold">
                          ${calculateReturns(parseFloat(investmentAmount) || 0, selectedPlan.dailyReturn, 1).daily}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Total Earnings ({selectedPlan.duration} days):</span>
                        <span className="text-green-400 font-bold">
                          ${calculateReturns(parseFloat(investmentAmount) || 0, selectedPlan.dailyReturn, selectedPlan.duration).total}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    disabled={!investmentAmount || parseFloat(investmentAmount) <= 0 || loading || (selectedPlan.name === 'Demo Plan' && hasPurchasedDemoPlan)}
                    className="flex-1 min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Confirm Investment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(null);
                      setInvestmentAmount('');
                    }}
                    className="min-h-[44px] px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {activeTab === 'active' && (
        <div className="space-y-4">
          {loadingActive ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60">Loading...</p>
            </div>
          ) : activeInvestments.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <p className="text-white/60">No active investments yet. Invest in a plan to see them here.</p>
            </div>
          ) : (
            <>
              {/* Today's Earnings Summary */}
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white/60 text-xs sm:text-sm mb-1">Today's Total Earnings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-400 truncate">${getTotalTodaysEarnings().toFixed(2)}</p>
                    <p className="text-white/60 text-xs mt-2">From {activeInvestments.length} active investment{activeInvestments.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-500/20 rounded-xl flex-shrink-0">
                    <VscGraph className="text-green-400" size={28} />
                  </div>
                </div>
              </div>

              {activeInvestments.map((investment) => {
                const todaysEarning = calculateTodaysEarnings(investment.amount, investment.dailyReturn);
                return (
              <div
                key={investment.id || investment._id}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{investment.plan} Plan</h3>
                    <p className="text-white/60 text-sm">Investment Amount: <span className="text-white font-semibold">${investment.amount.toLocaleString()}</span></p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <VscGraph className="text-purple-400" size={18} />
                      <span className="text-white/60 text-xs sm:text-sm">Daily Return</span>
                    </div>
                    <p className="text-green-400 font-bold text-base sm:text-lg">{investment.dailyReturn}%</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <VscGraph className="text-green-400" size={18} />
                      <span className="text-white/60 text-xs sm:text-sm">Today's Earnings</span>
                    </div>
                    <p className="text-green-400 font-bold text-base sm:text-lg">${todaysEarning.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <VscCalendar className="text-purple-400" size={18} />
                      <span className="text-white/60 text-xs sm:text-sm">Days Remaining</span>
                    </div>
                    <p className="text-white font-bold text-base sm:text-lg">{investment.daysRemaining}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <VscCheck className="text-purple-400" size={18} />
                      <span className="text-white/60 text-xs sm:text-sm">Total Earned</span>
                    </div>
                    <p className="text-green-400 font-bold text-base sm:text-lg">${investment.totalEarned.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <VscCalendar className="text-purple-400" size={18} />
                      <span className="text-white/60 text-xs sm:text-sm">End Date</span>
                    </div>
                    <p className="text-white font-bold text-base sm:text-lg">{new Date(investment.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            );
            })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Invest;
