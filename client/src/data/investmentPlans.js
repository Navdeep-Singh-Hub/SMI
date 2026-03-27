/** Shared investment plan definitions (Dashboard + Pre-Launch Staking). */
export const INVESTMENT_PLANS = [
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
