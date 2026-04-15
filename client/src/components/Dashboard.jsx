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
  VscGraph,
  VscPerson,
  VscInfo,
  VscClose
} from 'react-icons/vsc';
import { AiFillGift } from 'react-icons/ai';
import Deposit from './Deposit';
import Invest from './Invest';
import Withdraw from './Withdraw';
import AffiliateProgram from './AffiliateProgram';
import Downline from './Downline';
import Plans from './Plans';
import Profile from './Profile';
import FloatingLines from './FloatingLines';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Warn if deployed app might be calling wrong API (env not set on host)
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && API_BASE.includes('localhost')) {
  console.warn('[SMI] REACT_APP_API_URL is not set; balance and API calls may fail. Set it in your host (e.g. Vercel) to your backend URL, e.g. https://your-api.onrender.com/api');
}

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('plans');
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [profit, setProfit] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [initialPlanForInvest, setInitialPlanForInvest] = useState(null);
  const [preLaunchInvestActive, setPreLaunchInvestActive] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [profileNudgeHidden, setProfileNudgeHidden] = useState(() => {
    try {
      return sessionStorage.getItem('smi_profile_nudge_hide') === '1';
    } catch {
      return false;
    }
  });
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

  // Sync registration fields (phone, address, username) saved before Auth0 signup
  useEffect(() => {
    let mounted = true;
    const syncRegistration = async () => {
      try {
        const raw = localStorage.getItem('smi_registration_profile');
        if (!raw) return;
        const data = JSON.parse(raw);
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE}/user/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            phone: (data.phone || '').trim(),
            address: (data.address || '').trim(),
            username: (data.username || '').trim() || undefined
          })
        });
        if (res.ok && mounted) {
          localStorage.removeItem('smi_registration_profile');
          window.dispatchEvent(new Event('profileUpdated'));
        }
      } catch (e) {
        console.error('Registration profile sync error:', e);
      }
    };
    syncRegistration();
    return () => { mounted = false; };
  }, [getAccessTokenSilently]);

  const fetchProfileFlags = async () => {
    try {
      const token = await getAccessTokenSilently();
      if (!token) return;
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileIncomplete(!data.profileComplete);
      }
    } catch (e) {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchProfileFlags();
    const onProfile = () => {
      fetchProfileFlags();
      try {
        sessionStorage.removeItem('smi_profile_nudge_hide');
      } catch {
        /* ignore */
      }
      setProfileNudgeHidden(false);
    };
    window.addEventListener('profileUpdated', onProfile);
    return () => window.removeEventListener('profileUpdated', onProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuClick = (id) => {
    if (id === 'invest') setPreLaunchInvestActive(false);
    setActiveMenu(id);
  };

  const fetchUserBalance = async () => {
    setBalanceError(false);
    setBalanceLoading(true);
    try {
      const token = await getAccessTokenSilently();
      if (!token) {
        setBalanceLoading(false);
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
        const b = Number(data.balance);
        const w = Number(data.wallet);
        const p = Number(data.profit);
        setBalance(Number.isFinite(b) ? b : 0);
        setWallet(Number.isFinite(w) ? w : 0);
        setProfit(Number.isFinite(p) ? p : 0);
        setBalanceError(false);
      } else if (response.status === 401) {
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        setBalanceError(true);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalanceError(true);
    } finally {
      setBalanceLoading(false);
    }
  };

  const menuItems = [
    { id: 'plans', label: 'Dashboard', icon: <VscGraph size={20} /> },
    { id: 'preLaunchStaking', label: 'Pre-Launch Staking', shortLabel: 'Pre-Launch', icon: <AiFillGift size={20} /> },
    { id: 'invest', label: 'Invest', icon: <VscCreditCard size={20} /> },
    { id: 'deposit', label: 'Deposit', icon: <VscArrowDown size={20} /> },
    { id: 'profile', label: 'Profile', icon: <VscPerson size={20} /> },
    { id: 'withdraw', label: 'Withdraw', icon: <VscArrowUp size={20} /> },
    { id: 'affiliate', label: 'Affiliate Program', shortLabel: 'Affiliate', icon: <VscAccount size={20} /> },
    { id: 'downline', label: 'Downline', icon: <VscOrganization size={20} /> },
  ];

  const handleLogout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'plans':
        return (
          <Plans
            onInvestPlan={(plan) => {
              setPreLaunchInvestActive(false);
              setInitialPlanForInvest(plan);
              setActiveMenu('invest');
            }}
          />
        );
      case 'preLaunchStaking':
        return (
          <Plans
            mode="preLaunch"
            onInvestPlan={(plan) => {
              setPreLaunchInvestActive(true);
              setInitialPlanForInvest({ ...plan, preLaunch: true });
              setActiveMenu('invest');
            }}
          />
        );
      case 'invest':
        return (
          <Invest
            preLaunchInvestActive={preLaunchInvestActive}
            initialPlanForInvest={initialPlanForInvest}
            onClearInitialPlan={() => setInitialPlanForInvest(null)}
          />
        );
      case 'profile':
        return <Profile />;
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
                  onClick={() => handleMenuClick(item.id)}
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
      <main className="flex-1 overflow-y-auto relative flex flex-col pb-20 md:pb-0 min-h-0">
        {/* FloatingLines Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
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

        {/* Top bar: profile nudge + balances in document flow (no overlap with page content) */}
        <div className="relative z-20 shrink-0 border-b border-white/[0.08] bg-black/55 backdrop-blur-xl">
          <div className="p-3 sm:p-4 md:px-6 space-y-3">
            {profileIncomplete && !profileNudgeHidden && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-amber-400/25 bg-gradient-to-r from-amber-950/80 to-zinc-950/80 px-3 py-2.5 sm:px-4 sm:py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
                  <VscInfo size={20} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-white">Finish your profile</p>
                  <p className="text-xs sm:text-sm text-amber-100/75 mt-0.5 leading-snug">
                    Add your <span className="text-amber-200/95 font-medium">mobile number</span> and{' '}
                    <span className="text-amber-200/95 font-medium">address</span> so your account is complete.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => handleMenuClick('profile')}
                    className="min-h-[40px] whitespace-nowrap rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
                  >
                    Complete profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.setItem('smi_profile_nudge_hide', '1');
                      } catch {
                        /* ignore */
                      }
                      setProfileNudgeHidden(true);
                    }}
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Hide reminder for this session"
                    title="Hide for this session"
                  >
                    <VscClose size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 sm:justify-end">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]">
                <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Total Wallet</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400 truncate">
                  {balanceLoading ? '...' : balanceError ? '—' : `$${wallet.toFixed(2)}`}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]">
                <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Balance</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-400 truncate">
                  {balanceLoading ? '...' : balanceError ? '—' : `$${balance.toFixed(2)}`}
                </p>
              </div>
              <div className={`bg-gradient-to-r ${profit >= 0 ? 'from-green-500/20 to-green-600/20 border-green-500/30' : 'from-red-500/20 to-red-600/20 border-red-500/30'} border rounded-lg p-3 sm:p-4 backdrop-blur-sm shadow-lg min-w-0 flex-1 sm:flex-none sm:min-w-[120px] md:min-w-[140px]`}>
                <p className="text-white/60 text-xs mb-0.5 sm:mb-1">Profit</p>
                <p className={`text-lg sm:text-2xl font-bold truncate ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {balanceLoading ? '...' : balanceError ? '—' : `$${profit.toFixed(2)}`}
                </p>
              </div>
              {balanceError && (
                <p className="w-full sm:w-auto basis-full text-amber-400/90 text-xs sm:text-right">
                  Couldn&apos;t load balance.{' '}
                  <button type="button" onClick={() => fetchUserBalance()} className="underline font-medium">
                    Retry
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 min-h-0 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/90 border-t border-white/20 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all flex-1 max-w-[80px] ${
                activeMenu === item.id
                  ? 'bg-purple-600/80 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-[10px] font-medium truncate w-full text-center">{item.shortLabel || item.label}</span>
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

