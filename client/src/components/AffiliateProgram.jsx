import React, { useState } from 'react';
import { VscAccount, VscCopy, VscGraph, VscPersonAdd, VscCheck } from 'react-icons/vsc';

const AffiliateProgram = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'referrals', 'commissions'

  const referralLink = 'https://smi-trading.com/register?ref=USER12345';
  const referralCode = 'USER12345';

  const stats = {
    totalReferrals: 42,
    activeReferrals: 28,
    totalCommissions: 15230.50,
    pendingCommissions: 1250.00,
    commissionRate: 10
  };

  const recentReferrals = [
    { id: 1, name: 'John Doe', email: 'john@example.com', date: '2024-01-15', status: 'active', invested: 5000 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: '2024-01-18', status: 'active', invested: 10000 },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', date: '2024-01-20', status: 'pending', invested: 0 },
  ];

  const commissionHistory = [
    { id: 1, referral: 'John Doe', amount: 500, type: 'Investment Commission', date: '2024-01-15', status: 'paid' },
    { id: 2, referral: 'Jane Smith', amount: 1000, type: 'Investment Commission', date: '2024-01-18', status: 'paid' },
    { id: 3, referral: 'John Doe', amount: 250, type: 'Investment Commission', date: '2024-01-20', status: 'pending' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Affiliate Program</h2>
        <p className="text-white/60">Earn commissions by referring others to SMI Trading Platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscPersonAdd className="text-blue-400" size={24} />
            <span className="text-white/60 text-sm">Total Referrals</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalReferrals}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscCheck className="text-green-400" size={24} />
            <span className="text-white/60 text-sm">Active Referrals</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeReferrals}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscGraph className="text-purple-400" size={24} />
            <span className="text-white/60 text-sm">Total Commissions</span>
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalCommissions.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscAccount className="text-yellow-400" size={24} />
            <span className="text-white/60 text-sm">Commission Rate</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.commissionRate}%</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <VscAccount className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Your Referral Link</h3>
            <p className="text-white/60 text-sm">Share this link to earn commissions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-sm">Referral Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors flex items-center gap-2"
              >
                <VscCopy size={18} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm">Referral Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white text-sm font-mono"
              />
              <button
                onClick={handleCopyCode}
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <VscCopy size={18} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h4 className="text-white font-semibold mb-2">How It Works</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Share your referral link with friends and family</li>
            <li>• When they sign up and invest, you earn {stats.commissionRate}% commission</li>
            <li>• Commissions are paid automatically when your referrals invest</li>
            <li>• No limit on how many people you can refer</li>
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'referrals'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          My Referrals ({recentReferrals.length})
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'commissions'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Commission History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-6">Commission Structure</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Level 1 (Direct Referrals)</span>
                <span className="text-green-400 font-bold">{stats.commissionRate}%</span>
              </div>
              <p className="text-white/60 text-sm">Earn {stats.commissionRate}% commission on all investments made by your direct referrals</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Level 2 (Referral's Referrals)</span>
                <span className="text-green-400 font-bold">5%</span>
              </div>
              <p className="text-white/60 text-sm">Earn 5% commission on investments made by your referral's referrals</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Level 3 (Downline)</span>
                <span className="text-green-400 font-bold">2%</span>
              </div>
              <p className="text-white/60 text-sm">Earn 2% commission on investments made by your downline network</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-4">
          {recentReferrals.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <VscPersonAdd className="text-white/40 mx-auto mb-4" size={48} />
              <p className="text-white/60">No referrals yet</p>
            </div>
          ) : (
            recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{referral.name}</h3>
                    <p className="text-white/60 text-sm">{referral.email}</p>
                    <p className="text-white/40 text-xs mt-1">Joined: {new Date(referral.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      referral.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Total Invested: </span>
                    <span className="text-white font-semibold">${referral.invested.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Your Commission: </span>
                    <span className="text-green-400 font-semibold">
                      ${((referral.invested * stats.commissionRate) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="space-y-4">
          {commissionHistory.length === 0 ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
              <VscGraph className="text-white/40 mx-auto mb-4" size={48} />
              <p className="text-white/60">No commission history yet</p>
            </div>
          ) : (
            commissionHistory.map((commission) => (
              <div
                key={commission.id}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">${commission.amount.toLocaleString()}</h3>
                    <p className="text-white/60 text-sm">{commission.type}</p>
                    <p className="text-white/40 text-xs mt-1">From: {commission.referral}</p>
                    <p className="text-white/40 text-xs">Date: {new Date(commission.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      commission.status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateProgram;
