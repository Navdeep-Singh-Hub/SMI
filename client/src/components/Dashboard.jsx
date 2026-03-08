import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  VscCreditCard, 
  VscArrowDown, 
  VscArrowUp, 
  VscAccount, 
  VscOrganization,
  VscSignOut,
  VscGraph
} from 'react-icons/vsc';
import Deposit from './Deposit';
import Invest from './Invest';
import Withdraw from './Withdraw';
import AffiliateProgram from './AffiliateProgram';
import Downline from './Downline';
import Plans from './Plans';
import FloatingLines from './FloatingLines';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('plans');
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [profit, setProfit] = useState(0);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [initialPlanForInvest, setInitialPlanForInvest] = useState(null);
  const navigate = useNavigate();
  const { getAccessTokenSilently, logout: auth0Logout } = useAuth0();

  useEffect(() => {
    fetchUserBalance();
    const handler = () => fetchUserBalance();
    window.addEventListener('balanceUpdated', handler);
    return () => window.removeEventListener('balanceUpdated', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach referral code from localStorage (saved when user came from /register?ref=CODE)
  useEffect(() => {
    let mounted = true;
    const attachReferrer = async () => {
      try {
        const code = localStorage.getItem('smi_referral_code');
        if (!code || !code.trim()) return;
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE}/affiliate/attach-referrer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ referralCode: code.trim() })
        });
        if (res.ok && mounted) localStorage.removeItem('smi_referral_code');
      } catch (e) {
        console.error('Attach referrer error:', e);
      }
    };
    attachReferrer();
    return () => { mounted = false; };
  }, [getAccessTokenSilently]);

  const fetchUserBalance = async () => {
    try {
      const token = await getAccessTokenSilently();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/user/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
        setWallet(data.wallet || 0);
        setProfit(data.profit || 0);
      } else if (response.status === 401) {
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const menuItems = [
    { id: 'plans', label: 'Dashboard', icon: <VscGraph size={20} /> },
    { id: 'invest', label: 'Invest', icon: <VscCreditCard size={20} /> },
    { id: 'withdraw', label: 'Withdraw', icon: <VscArrowUp size={20} /> },
    { id: 'deposit', label: 'Deposit', icon: <VscArrowDown size={20} /> },
    { id: 'affiliate', label: 'Affiliate Program', icon: <VscAccount size={20} /> },
    { id: 'downline', label: 'Downline', icon: <VscOrganization size={20} /> },
  ];

  const handleLogout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'plans':
        return <Plans onInvestPlan={(plan) => { setInitialPlanForInvest(plan); setActiveMenu('invest'); }} />;
      case 'invest':
        return <Invest initialPlanForInvest={initialPlanForInvest} onClearInitialPlan={() => setInitialPlanForInvest(null)} />;
      case 'withdraw':
        return <Withdraw />;
      case 'deposit':
        return <Deposit />;
      case 'affiliate':
        return <AffiliateProgram />;
      case 'downline':
        return <Downline />;
      default:
        return <Plans />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Left Sidebar - Desktop only; mobile uses bottom nav */}
      <aside
        className={`hidden md:flex bg-white/10 border-r border-white/20 flex-col transition-all duration-300 ease-in-out ${
          sidebarHover ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        <div className={`p-6 border-b border-white/20 transition-all duration-300 ${sidebarHover ? '' : 'px-4'}`}>
          {sidebarHover ? (
            <>
              <h1 className="text-2xl font-bold text-white">SMI</h1>
              <p className="text-white/60 text-sm mt-1">Trading Platform</p>
            </>
          ) : (
            <h1 className="text-xl font-bold text-white text-center">SMI</h1>
          )}
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeMenu === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  } ${sidebarHover ? '' : 'justify-center'}`}
                  title={!sidebarHover ? item.label : ''}
                >
                  {item.icon}
                  {sidebarHover && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 border-t border-white/20 transition-all duration-300 ${sidebarHover ? '' : 'px-2'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all ${
              sidebarHover ? '' : 'justify-center'
            }`}
            title={!sidebarHover ? 'Logout' : ''}
          >
            <VscSignOut size={20} />
            {sidebarHover && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
        {/* FloatingLines Background */}
        <div className="absolute inset-0 z-0">
          <FloatingLines 
            enabledWaves={["top","middle","bottom"]}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
          />
        </div>
        
        {/* Balance Display - Stack on mobile, top-right on desktop */}
        <div className="relative md:absolute top-0 md:top-4 right-0 md:right-4 z-10 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 p-4 md:p-0">
          {/* Total Wallet */}
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]">
            <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Total Wallet</p>
            <p className="text-lg sm:text-2xl font-bold text-green-400 truncate">${wallet.toFixed(2)}</p>
          </div>
          {/* Balance */}
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]">
            <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Balance</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-400 truncate">${balance.toFixed(2)}</p>
          </div>
          {/* Profit */}
          <div className={`bg-gradient-to-r ${profit >= 0 ? 'from-green-500/20 to-green-600/20 border-green-500/30' : 'from-red-500/20 to-red-600/20 border-red-500/30'} border rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]`}>
            <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Profit</p>
            <p className={`text-lg sm:text-2xl font-bold truncate ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${profit.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8 relative z-10">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/90 border-t border-white/20 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all flex-1 max-w-[80px] ${
                activeMenu === item.id
                  ? 'bg-purple-600/80 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all flex-1 max-w-[80px]"
            aria-label="Logout"
          >
            <VscSignOut size={20} />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;

