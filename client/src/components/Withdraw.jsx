import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscArrowUp, VscCreditCard, VscHistory, VscCheck } from 'react-icons/vsc';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Withdraw = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    accountName: '',
    bankName: '',
    swiftCode: '',
    cryptoAddress: ''
  });
  const [activeTab, setActiveTab] = useState('withdraw');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const cryptoCurrencies = [
    { code: 'btc', name: 'Bitcoin', icon: '₿', network: 'Bitcoin' },
    { code: 'eth', name: 'Ethereum', icon: 'Ξ', network: 'Ethereum' },
    { code: 'usdttrc20', name: 'USDT (TRC20)', icon: '💵', network: 'TRON' },
    { code: 'usdtbep20', name: 'USDT (BEP20)', icon: '💵', network: 'Binance Smart Chain' },
    { code: 'ltc', name: 'Litecoin', icon: 'Ł', network: 'Litecoin' },
    { code: 'bch', name: 'Bitcoin Cash', icon: '₿', network: 'Bitcoin Cash' },
    { code: 'xrp', name: 'Ripple', icon: '✕', network: 'Ripple' },
    { code: 'doge', name: 'Dogecoin', icon: 'Ð', network: 'Dogecoin' },
  ];

  const pendingWithdrawals = 0; // TODO: from API when withdrawal requests exist
  const minWithdraw = 50;
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [kycStatus, setKycStatus] = useState('none');
  const [profileComplete, setProfileComplete] = useState(true);

  const fetchWithdrawalRules = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setKycStatus(data.kycStatus || 'none');
        setProfileComplete(!!data.profileComplete);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWithdrawalHistory = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/withdraw/history`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (e) {
      console.error('Fetch withdrawal history error:', e);
    }
  };

  useEffect(() => {
    fetchWithdrawalRules();
    const onProfile = () => fetchWithdrawalRules();
    window.addEventListener('profileUpdated', onProfile);
    return () => window.removeEventListener('profileUpdated', onProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE}/user/balance`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setAvailableBalance(data.balance ?? 0);
        }
      } catch (e) {
        console.error('Fetch balance error:', e);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
    const handler = () => fetchBalance();
    window.addEventListener('balanceUpdated', handler);
    return () => window.removeEventListener('balanceUpdated', handler);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (activeTab === 'history') fetchWithdrawalHistory();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWithdrawAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const amount = parseFloat(withdrawAmount);

    if (amount < minWithdraw) {
      setSubmitError(`Minimum withdrawal amount is $${minWithdraw}`);
      return;
    }

    if (amount > availableBalance) {
      setSubmitError('Insufficient balance');
      return;
    }

    if (paymentMethod === 'bank') {
      setSubmitError('Bank transfer is coming soon. Please use cryptocurrency withdrawal.');
      return;
    }

    if (paymentMethod === 'crypto' && !accountDetails.cryptoAddress.trim()) {
      setSubmitError('Please enter your crypto wallet address');
      return;
    }

    if (!profileComplete) {
      setSubmitError('Complete your profile (phone and address) under Profile before withdrawing.');
      return;
    }
    if (kycStatus !== 'approved') {
      setSubmitError(
        kycStatus === 'pending'
          ? 'KYC is under review. Withdrawals are enabled after approval.'
          : 'Complete KYC verification in Profile before withdrawing.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_BASE}/withdraw/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount,
          payMethod: paymentMethod,
          cryptoCurrency: selectedCrypto,
          cryptoAddress: accountDetails.cryptoAddress.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawAmount('');
        setAccountDetails((prev) => ({ ...prev, cryptoAddress: '' }));
        window.dispatchEvent(new Event('balanceUpdated'));
        fetchWithdrawalHistory();
        setActiveTab('history');
        alert(`Withdrawal request of $${amount.toFixed(2)} submitted successfully.`);
      } else {
        setSubmitError(data.message || 'Withdrawal request failed.');
        if (data.kycStatus) setKycStatus(data.kycStatus);
        if (data.profileIncomplete) fetchWithdrawalRules();
      }
    } catch (err) {
      console.error('Withdraw submit error:', err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-1 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Withdraw</h2>
        <p className="text-white/60 text-sm sm:text-base">Withdraw your earnings to your preferred payment method</p>
      </div>

      {!profileComplete && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm">
          Add your <strong>mobile number</strong> and <strong>address</strong> in <strong>Profile</strong> before you can withdraw.
        </div>
      )}
      {profileComplete && kycStatus !== 'approved' && (
        <div className="mb-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-cyan-100 text-sm">
          {kycStatus === 'pending' ? (
            <>Your KYC documents are <strong>under review</strong>. Withdrawals unlock after approval.</>
          ) : (
            <>
              <strong>KYC is required to withdraw.</strong> Go to <strong>Profile</strong> and upload Aadhaar (front &amp; back), PAN, and your photo holding Aadhaar — then wait for approval.
            </>
          )}
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscCreditCard className="text-green-400" size={24} />
            <span className="text-white/60 text-sm">Available Balance</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white truncate">
            {loadingBalance ? '...' : `$${Number(availableBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscArrowUp className="text-yellow-400" size={24} />
            <span className="text-white/60 text-sm">Pending Withdrawals</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white truncate">${pendingWithdrawals.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscCheck className="text-purple-400" size={24} />
            <span className="text-white/60 text-sm">Minimum Withdrawal</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">${minWithdraw}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-white/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`min-h-[44px] px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'withdraw'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Withdraw Funds
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`min-h-[44px] px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Withdrawal History
        </button>
      </div>

      {activeTab === 'withdraw' && (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <VscArrowUp className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Request Withdrawal</h3>
              <p className="text-white/60 text-sm">Enter amount and payment details</p>
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="withdrawAmount" className="block text-white/80 mb-2 font-medium">
                Withdrawal Amount (USD)
              </label>
              <input
                id="withdrawAmount"
                type="text"
                value={withdrawAmount}
                onChange={handleAmountChange}
                placeholder={`Minimum: $${minWithdraw}`}
                className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              {withdrawAmount && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-white/60">Processing Fee (2%):</span>
                  <span className="text-white/80">
                    ${(parseFloat(withdrawAmount) * 0.02 || 0).toFixed(2)}
                  </span>
                </div>
              )}
              {withdrawAmount && (
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-white/60">You will receive:</span>
                  <span className="text-green-400 font-semibold">
                    ${(parseFloat(withdrawAmount) * 0.98 || 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-white/80 mb-3 font-medium">Payment Method</label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled
                  className="p-4 rounded-lg border-2 border-gray-500/30 bg-gray-500/10 opacity-50 cursor-not-allowed relative"
                >
                  <div className="flex items-center gap-3">
                    <VscCreditCard className="text-white/50" size={24} />
                    <div className="text-left">
                      <p className="text-white/50 font-semibold">Bank Transfer</p>
                      <p className="text-red-400 text-sm font-semibold">Coming Soon</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <VscCreditCard className="text-white" size={24} />
                    <div className="text-left">
                      <p className="text-white font-semibold">Cryptocurrency</p>
                      <p className="text-white/60 text-sm">1-24 hours</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === 'bank' && (
              <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Account Number</label>
                  <input
                    type="text"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Account Name</label>
                  <input
                    type="text"
                    value={accountDetails.accountName}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                    placeholder="Enter account holder name"
                    className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Bank Name</label>
                  <input
                    type="text"
                    value={accountDetails.bankName}
                    onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">SWIFT Code (Optional)</label>
                  <input
                    type="text"
                    value={accountDetails.swiftCode}
                    onChange={(e) => setAccountDetails({ ...accountDetails, swiftCode: e.target.value })}
                    placeholder="Enter SWIFT code"
                    className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <label className="block text-white/80 mb-3 font-medium">Select Cryptocurrency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {cryptoCurrencies.map((crypto) => (
                      <button
                        key={crypto.code}
                        type="button"
                        onClick={() => setSelectedCrypto(crypto.code)}
                        className={`min-h-[44px] p-3 rounded-lg border-2 transition-all ${
                          selectedCrypto === crypto.code
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{crypto.icon}</div>
                          <div className="text-white font-semibold text-xs">{crypto.name}</div>
                          <div className="text-white/60 text-xs mt-1">{crypto.network}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-white/60 text-xs mt-3">
                    Selected: <span className="text-purple-400 font-semibold">
                      {cryptoCurrencies.find(c => c.code === selectedCrypto)?.name || selectedCrypto}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Crypto Wallet Address</label>
                  <input
                    type="text"
                    value={accountDetails.cryptoAddress}
                    onChange={(e) => setAccountDetails({ ...accountDetails, cryptoAddress: e.target.value })}
                    placeholder={`Enter your ${cryptoCurrencies.find(c => c.code === selectedCrypto)?.name || 'crypto'} wallet address`}
                    className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-white/40 text-xs mt-2">
                    Make sure to use the correct {cryptoCurrencies.find(c => c.code === selectedCrypto)?.network || 'network'} network address
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                !withdrawAmount ||
                parseFloat(withdrawAmount) < minWithdraw ||
                !profileComplete ||
                kycStatus !== 'approved'
              }
              className="w-full min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {!withdrawalHistory || withdrawalHistory.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <VscHistory className="text-white/40 mx-auto mb-4" size={48} />
              <p className="text-white/60">No withdrawal history yet</p>
            </div>
          ) : (
            withdrawalHistory.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      ${Number(withdrawal.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-white/60 text-sm">{withdrawal.method}</p>
                    <p className="text-white/40 text-xs mt-1">ID: {withdrawal.transactionId}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      withdrawal.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : withdrawal.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {withdrawal.status ? withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1) : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <VscHistory size={16} />
                  <span>{new Date(withdrawal.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Withdraw;
