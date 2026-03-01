import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { VscArrowDown, VscHistory, VscLinkExternal } from 'react-icons/vsc';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Deposit = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('usdttrc20');
  const [balance, setBalance] = useState(0);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Popular cryptocurrencies supported by NOWPayments
  const popularCurrencies = [
    { code: 'usdttrc20', name: 'USDT (TRC20)', icon: '💵', network: 'TRON' },
    { code: 'usdtbep20', name: 'USDT (BEP20)', icon: '💵', network: 'Binance Smart Chain' },
    { code: 'btc', name: 'Bitcoin', icon: '₿', network: 'Bitcoin' },
    { code: 'eth', name: 'Ethereum', icon: 'Ξ', network: 'Ethereum' },
    { code: 'ltc', name: 'Litecoin', icon: 'Ł', network: 'Litecoin' },
    { code: 'bch', name: 'Bitcoin Cash', icon: '₿', network: 'Bitcoin Cash' },
    { code: 'xrp', name: 'Ripple', icon: '✕', network: 'Ripple' },
    { code: 'doge', name: 'Dogecoin', icon: 'Ð', network: 'Dogecoin' },
  ];

  // Fetch user balance
  const fetchBalance = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/user/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/deposit/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (transactionId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/deposit/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentStatus(data.paymentStatus || data.status);
        
        // Update current transaction
        if (currentTransaction) {
          setCurrentTransaction(prev => ({
            ...prev,
            status: data.status,
            paymentStatus: data.paymentStatus
          }));
        }

        // If payment is completed, stop polling and refresh
        if (data.status === 'completed' || data.paymentStatus === 'finished' || data.paymentStatus === 'confirmed') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          fetchBalance();
          fetchTransactions();
          setSuccess('Payment confirmed! Your balance has been updated.');
        }

        // If payment failed, stop polling
        if (data.status === 'failed' || data.paymentStatus === 'failed') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    } catch (err) {
      console.error('Error polling payment status:', err);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/stop polling when transaction changes
  useEffect(() => {
    if (currentTransaction && currentTransaction.status === 'pending') {
      // Start polling every 5 seconds
      pollingIntervalRef.current = setInterval(() => {
        pollPaymentStatus(currentTransaction.id);
      }, 5000);

      // Initial poll
      pollPaymentStatus(currentTransaction.id);
    } else {
      // Stop polling if no pending transaction
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTransaction?.id]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  const handleCreateDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE}/deposit/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          payCurrency: selectedCurrency
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentTransaction({
          id: data.transactionId,
          paymentId: data.paymentId,
          invoiceUrl: data.invoiceUrl,
          qrCode: data.qrCode,
          payAddress: data.payAddress,
          amount: data.amount,
          cryptoAmount: data.cryptoAmount,
          cryptoCurrency: data.cryptoCurrency,
          status: data.status,
          paymentStatus: data.paymentStatus,
          expirationEstimate: data.expirationEstimate
        });
        setPaymentStatus(data.paymentStatus);
        setSuccess('Payment invoice created! Please complete the payment via NOWPayments.');
        setAmount('');
      } else {
        setError(data.message || 'Failed to create deposit request');
      }
    } catch (err) {
      console.error('Create deposit error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setCurrentTransaction(null);
    setAmount('');
    setPaymentStatus(null);
    setError('');
    setSuccess('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'finished':
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
      case 'waiting':
      case 'confirming':
      case 'sending':
      case 'partially_paid':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'waiting': 'Waiting for Payment',
      'confirming': 'Confirming Payment',
      'confirmed': 'Payment Confirmed',
      'sending': 'Sending Payment',
      'partially_paid': 'Partially Paid',
      'finished': 'Payment Completed',
      'failed': 'Payment Failed',
      'refunded': 'Refunded',
      'pending': 'Pending',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">Deposit Money</h2>
          <div className="text-right">
            <p className="text-white/60 text-sm">Current Balance</p>
            <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-white/60">Add funds to your account via cryptocurrency payment</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          {success}
        </div>
      )}

      {/* Deposit Form */}
      {!currentTransaction && (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <VscArrowDown className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Deposit Amount</h3>
              <p className="text-white/60 text-sm">Enter the amount you want to deposit (USD)</p>
          </div>
        </div>

          <form onSubmit={handleCreateDeposit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-white/80 mb-2 font-medium">
              Amount (USD)
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                disabled={isLoading}
            />
            {amount && parseFloat(amount) <= 0 && (
              <p className="text-red-400 text-sm mt-1">Please enter a valid amount greater than 0</p>
            )}
          </div>

          <div>
            <label className="block text-white/80 mb-3 font-medium">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => setSelectedCurrency(currency.code)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCurrency === currency.code
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{currency.icon}</div>
                    <div className="text-white font-semibold text-sm">{currency.name}</div>
                    <div className="text-white/60 text-xs mt-1">{currency.network}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-white/60 text-xs mt-2">
              Selected: <span className="text-purple-400 font-semibold">
                {popularCurrencies.find(c => c.code === selectedCurrency)?.name || selectedCurrency}
              </span>
            </p>
          </div>

          <button
            type="submit"
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
              {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
        </div>
      )}

      {/* NOWPayments Payment Display */}
      {currentTransaction && (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm mb-6">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-white mb-4">
              Complete Your Payment
              </h4>
            
            {/* Payment Amount Info */}
            <div className="mb-6 space-y-2">
              <p className="text-white/60">
                Amount: <span className="text-white font-semibold text-lg">${currentTransaction.amount.toFixed(2)} USD</span>
              </p>
              {currentTransaction.cryptoAmount && currentTransaction.cryptoCurrency && (
                <p className="text-white/60">
                  Pay: <span className="text-white font-semibold">
                    {parseFloat(currentTransaction.cryptoAmount).toFixed(8)} {currentTransaction.cryptoCurrency.toUpperCase()}
                  </span>
                </p>
              )}
              <p className="text-white/40 text-xs">
                Status: <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(paymentStatus || currentTransaction.status)}`}>
                  {getStatusLabel(paymentStatus || currentTransaction.status)}
                </span>
              </p>
            </div>

            {/* QR Code */}
            {currentTransaction.qrCode && (
              <div className="bg-white rounded-lg p-6 inline-block mb-4 shadow-lg">
                  <img
                  src={currentTransaction.qrCode}
                  alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    style={{ display: 'none' }} 
                    className="w-64 h-64 flex flex-col items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300"
                  >
                  <p className="text-gray-600">QR Code loading...</p>
                    </div>
                  </div>
            )}

            {/* Payment Address */}
            {currentTransaction.payAddress && (
              <div className="mb-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm mb-2">Payment Address:</p>
                <p className="text-white font-mono text-xs break-all">{currentTransaction.payAddress}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentTransaction.payAddress);
                    setSuccess('Address copied to clipboard!');
                    setTimeout(() => setSuccess(''), 2000);
                  }}
                  className="mt-2 px-3 py-1 text-xs bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30 transition-colors"
                >
                  Copy Address
                </button>
                </div>
            )}

            {/* Open Payment Page Button */}
            {currentTransaction.invoiceUrl && (
              <div className="mb-4">
                <a
                  href={currentTransaction.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <VscLinkExternal size={18} />
                  Open Payment Page
                </a>
              </div>
            )}

            <p className="text-white/60 text-sm mb-4">
              Scan the QR code or click "Open Payment Page" to complete your payment via NOWPayments
            </p>

            {/* Payment Status Info */}
            {(paymentStatus === 'waiting' || paymentStatus === 'confirming' || currentTransaction.status === 'pending') && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⏳ Payment is being processed. Your balance will update automatically once confirmed.
                </p>
              </div>
            )}

            {currentTransaction.status === 'completed' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-300 text-sm">
                  ✅ Payment confirmed! Your balance has been updated.
                </p>
              </div>
            )}
              
            <div className="flex gap-3 justify-center mt-6">
                <button
                onClick={handleClear}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors"
                >
                {currentTransaction.status === 'completed' ? 'Create New Deposit' : 'Cancel'}
                </button>
              </div>
            </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <VscHistory className="text-purple-400" size={24} />
            <h3 className="text-xl font-semibold text-white">Transaction History</h3>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-white/60 hover:text-white text-sm"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </button>
        </div>

        {showHistory && (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-white/60 text-center py-4">No transactions yet</p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">${tx.amount.toFixed(2)}</p>
                      {tx.cryptoAmount && tx.cryptoCurrency && (
                        <p className="text-white/60 text-xs">
                          {parseFloat(tx.cryptoAmount).toFixed(8)} {tx.cryptoCurrency.toUpperCase()}
                        </p>
                      )}
                      <p className="text-white/60 text-sm">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {getStatusLabel(tx.status)}
                    </span>
                  </div>
                  {tx.invoiceUrl && (
                    <div className="mt-2">
                      <a
                        href={tx.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                      >
                        <VscLinkExternal size={12} />
                        View Payment
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
