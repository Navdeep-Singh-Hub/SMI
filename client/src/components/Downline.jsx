import React, { useState } from 'react';
import { VscOrganization, VscPerson, VscGraph, VscChevronRight, VscChevronDown } from 'react-icons/vsc';

const Downline = () => {
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState('network'); // 'network' or 'stats'

  const downlineStats = {
    totalMembers: 156,
    directReferrals: 42,
    level2Referrals: 78,
    level3Referrals: 36,
    totalInvested: 1250000,
    totalCommissions: 125000
  };

  const downlineNetwork = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      level: 1,
      joinedDate: '2024-01-15',
      totalInvested: 50000,
      status: 'active',
      referrals: [
        {
          id: 11,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          level: 2,
          joinedDate: '2024-01-20',
          totalInvested: 25000,
          status: 'active',
          referrals: [
            {
              id: 111,
              name: 'Bob Smith',
              email: 'bob@example.com',
              level: 3,
              joinedDate: '2024-01-25',
              totalInvested: 10000,
              status: 'active',
              referrals: []
            }
          ]
        },
        {
          id: 12,
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          level: 2,
          joinedDate: '2024-01-22',
          totalInvested: 30000,
          status: 'active',
          referrals: []
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      level: 1,
      joinedDate: '2024-01-18',
      totalInvested: 75000,
      status: 'active',
      referrals: [
        {
          id: 21,
          name: 'David Wilson',
          email: 'david@example.com',
          level: 2,
          joinedDate: '2024-01-25',
          totalInvested: 20000,
          status: 'active',
          referrals: []
        }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      level: 1,
      joinedDate: '2024-01-20',
      totalInvested: 30000,
      status: 'active',
      referrals: []
    }
  ];

  const toggleExpand = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const renderUser = (user, depth = 0) => {
    const isExpanded = expandedUsers.has(user.id);
    const hasReferrals = user.referrals && user.referrals.length > 0;

    return (
      <div key={user.id} className="ml-4">
        <div
          className={`bg-white/10 border border-white/20 rounded-lg p-4 mb-2 ${
            depth === 0 ? 'bg-white/15' : depth === 1 ? 'bg-white/10' : 'bg-white/5'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {hasReferrals && (
                  <button
                    onClick={() => toggleExpand(user.id)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {isExpanded ? <VscChevronDown size={20} /> : <VscChevronRight size={20} />}
                  </button>
                )}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                  depth === 0 ? 'from-purple-500 to-purple-600' :
                  depth === 1 ? 'from-blue-500 to-blue-600' :
                  'from-green-500 to-green-600'
                } flex items-center justify-center`}>
                  <VscPerson className="text-white" size={16} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user.name}</h4>
                  <p className="text-white/60 text-xs">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  Level {user.level}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-white/60">Invested:</span>
                  <p className="text-white font-semibold">${user.totalInvested.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-white/60">Referrals:</span>
                  <p className="text-white font-semibold">{user.referrals?.length || 0}</p>
                </div>
                <div>
                  <span className="text-white/60">Joined:</span>
                  <p className="text-white font-semibold">{new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isExpanded && hasReferrals && (
          <div className="ml-8 border-l-2 border-white/10 pl-4">
            {user.referrals.map((referral) => renderUser(referral, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Downline Network</h2>
        <p className="text-white/60">View and manage your referral network</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscOrganization className="text-purple-400" size={24} />
            <span className="text-white/60 text-sm">Total Members</span>
          </div>
          <p className="text-3xl font-bold text-white">{downlineStats.totalMembers}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscPerson className="text-blue-400" size={24} />
            <span className="text-white/60 text-sm">Level 1</span>
          </div>
          <p className="text-3xl font-bold text-white">{downlineStats.directReferrals}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscGraph className="text-green-400" size={24} />
            <span className="text-white/60 text-sm">Total Invested</span>
          </div>
          <p className="text-3xl font-bold text-white">${(downlineStats.totalInvested / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <VscGraph className="text-yellow-400" size={24} />
            <span className="text-white/60 text-sm">Commissions</span>
          </div>
          <p className="text-3xl font-bold text-white">${(downlineStats.totalCommissions / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('network')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'network'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Network Tree
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'stats'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'network' && (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">Your Downline Network</h3>
            <p className="text-white/60 text-sm">Click on any member to expand and view their referrals</p>
          </div>
          <div className="space-y-2">
            {downlineNetwork.length === 0 ? (
              <div className="text-center py-12">
                <VscOrganization className="text-white/40 mx-auto mb-4" size={48} />
                <p className="text-white/60">No downline members yet</p>
              </div>
            ) : (
              downlineNetwork.map((user) => renderUser(user))
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-6">Network Statistics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Level 1 (Direct Referrals)</span>
                    <span className="text-white font-bold">{downlineStats.directReferrals}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(downlineStats.directReferrals / downlineStats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Level 2 Referrals</span>
                    <span className="text-white font-bold">{downlineStats.level2Referrals}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(downlineStats.level2Referrals / downlineStats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Level 3 Referrals</span>
                    <span className="text-white font-bold">{downlineStats.level3Referrals}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(downlineStats.level3Referrals / downlineStats.totalMembers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Total Network Investment</span>
                    <span className="text-green-400 font-bold">${downlineStats.totalInvested.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Total Commissions Earned</span>
                    <span className="text-green-400 font-bold">${downlineStats.totalCommissions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Average per Member</span>
                    <span className="text-white font-bold">
                      ${Math.round(downlineStats.totalInvested / downlineStats.totalMembers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downline;
