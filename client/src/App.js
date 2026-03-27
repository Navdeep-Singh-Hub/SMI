import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Dock from './components/Dock';
import ClickSpark from './components/ClickSpark';
import LightRays from './components/LightRays';
import { ScrollFadeIn, ScrollScaleIn, ScrollSlideIn } from './components/ScrollAnimation';
import Dashboard from './components/Dashboard';
import { VscHome, VscQuestion, VscShield, VscFile, VscMail } from 'react-icons/vsc';

const Home = () => {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen relative overflow-hidden bg-black">
    <style>{`
      @keyframes smiFloatY {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-14px); }
      }
      @keyframes smiPulseGlow {
        0%, 100% { opacity: 0.35; filter: blur(32px); }
        50% { opacity: 0.7; filter: blur(44px); }
      }
      @keyframes smiSpinSlow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes smiGridShift {
        0% { transform: translateY(0px); }
        100% { transform: translateY(28px); }
      }
      @keyframes smiWaveX {
        0%, 100% { transform: translateX(-8px); }
        50% { transform: translateX(12px); }
      }
      .smi-float { animation: smiFloatY 6s ease-in-out infinite; }
      .smi-glow { animation: smiPulseGlow 5.5s ease-in-out infinite; }
      .smi-spin { animation: smiSpinSlow 20s linear infinite; }
      .smi-grid { animation: smiGridShift 2.8s linear infinite alternate; }
      .smi-wave { animation: smiWaveX 4.8s ease-in-out infinite; }
    `}</style>
    {/* LightRays Background */}
    <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div>

    {/* Hero Section */}
    <header id="home" className="relative z-10 min-h-screen flex items-center justify-center pt-16 sm:pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 text-center">
        <ScrollFadeIn>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white bg-clip-text">
            SMI Trading Platform
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-8 px-1">
            Automated trading across Forex, Indices, and Commodities.
            <span className="block mt-2">Easy, powerful, and accessible to everyone.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8">
            <Link to="/register" className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity text-base sm:text-lg">
              Get Started
            </Link>
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto min-h-[44px] flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors text-base sm:text-lg">
              Sign In
            </button>
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.3}>
          <div className="mt-8 sm:mt-16 h-56 sm:h-72 md:h-96 relative rounded-3xl border border-white/15 bg-black/30 backdrop-blur-md overflow-hidden">
            <div className="absolute -top-16 -left-8 w-56 h-56 rounded-full bg-cyan-400/20 smi-glow" />
            <div className="absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-purple-500/25 smi-glow" />
            <div className="absolute inset-0 opacity-35 smi-grid" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[88%] h-[70%] max-w-3xl">
                <div className="absolute left-0 right-0 top-[58%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent smi-wave" />
                <div className="absolute left-[8%] top-[46%] w-[10px] h-[10px] rounded-full bg-cyan-300 smi-float" />
                <div className="absolute left-[24%] top-[34%] w-[10px] h-[10px] rounded-full bg-purple-300 smi-float" style={{ animationDelay: '0.8s' }} />
                <div className="absolute left-[42%] top-[52%] w-[10px] h-[10px] rounded-full bg-fuchsia-300 smi-float" style={{ animationDelay: '1.2s' }} />
                <div className="absolute left-[60%] top-[24%] w-[10px] h-[10px] rounded-full bg-cyan-200 smi-float" style={{ animationDelay: '0.4s' }} />
                <div className="absolute left-[78%] top-[40%] w-[10px] h-[10px] rounded-full bg-violet-300 smi-float" style={{ animationDelay: '1.6s' }} />
                <div className="absolute right-[3%] top-[17%] w-24 h-24 smi-spin opacity-80">
                  <div className="absolute inset-0 rounded-full border border-cyan-300/60" />
                  <div className="absolute inset-2 rounded-full border border-purple-300/60" />
                </div>
                <div className="absolute left-[32%] top-[66%] text-[10px] sm:text-xs text-white/60 tracking-wide">LIVE SIGNAL ENGINE</div>
              </div>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </header>
    
    {/* Features Section */}
    <section id="features" className="relative z-10 py-12 sm:py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-white text-center">Powerful Features</h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ScrollScaleIn delay={0.1}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-36 sm:h-48 mb-4 sm:mb-6 rounded-xl overflow-hidden relative border border-white/10 bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-purple-500/20 smi-glow" />
                <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent smi-wave" />
                <div className="absolute left-[18%] top-[42%] w-2.5 h-2.5 rounded-full bg-cyan-300 smi-float" />
                <div className="absolute left-[45%] top-[30%] w-2.5 h-2.5 rounded-full bg-purple-300 smi-float" style={{ animationDelay: '0.7s' }} />
                <div className="absolute left-[74%] top-[54%] w-2.5 h-2.5 rounded-full bg-fuchsia-300 smi-float" style={{ animationDelay: '1.2s' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Automated Forex Trading</h3>
              <p className="text-white/80 text-sm sm:text-base">Advanced algorithms scan markets 24/7 and execute trades with precision timing.</p>
            </div>
          </ScrollScaleIn>
          <ScrollScaleIn delay={0.2}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-36 sm:h-48 mb-4 sm:mb-6 rounded-xl overflow-hidden relative border border-white/10 bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-300/20 via-transparent to-cyan-400/20 smi-glow" />
                <div className="absolute left-[18%] top-[22%] w-10 h-10 rounded-full border border-amber-300/60 bg-amber-400/20 smi-float" />
                <div className="absolute left-[40%] top-[50%] w-12 h-12 rounded-full border border-cyan-300/60 bg-cyan-400/20 smi-float" style={{ animationDelay: '0.8s' }} />
                <div className="absolute left-[66%] top-[30%] w-9 h-9 rounded-full border border-purple-300/60 bg-purple-400/20 smi-float" style={{ animationDelay: '1.3s' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Efficient Indices Trading</h3>
              <p className="text-white/80 text-sm sm:text-base">Optimized strategies for S&P 500, NASDAQ, UK100, and global indices.</p>
            </div>
          </ScrollScaleIn>
          <ScrollScaleIn delay={0.3}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-36 sm:h-48 mb-4 sm:mb-6 rounded-xl overflow-hidden relative border border-white/10 bg-black/40">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-cyan-400/20 smi-glow" />
                <div className="absolute left-6 right-6 bottom-8 h-[3px] bg-gradient-to-r from-cyan-300/50 via-purple-300 to-cyan-300/50 smi-wave" />
                <div className="absolute left-[20%] bottom-[30%] w-2.5 h-9 rounded-full bg-cyan-300/70 smi-float" />
                <div className="absolute left-[34%] bottom-[30%] w-2.5 h-12 rounded-full bg-purple-300/70 smi-float" style={{ animationDelay: '0.6s' }} />
                <div className="absolute left-[48%] bottom-[30%] w-2.5 h-7 rounded-full bg-cyan-200/70 smi-float" style={{ animationDelay: '1.1s' }} />
                <div className="absolute left-[62%] bottom-[30%] w-2.5 h-14 rounded-full bg-fuchsia-300/70 smi-float" style={{ animationDelay: '1.7s' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Commodities Trading</h3>
              <p className="text-white/80 text-sm sm:text-base">Trade gold, oil, and other commodities with intelligent risk management.</p>
            </div>
          </ScrollScaleIn>
        </div>
      </div>
    </section>
    
    {/* Why Choose Section */}
    <section id="why" className="relative z-10 py-12 sm:py-16 md:py-24 bg-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-white text-center">Why Choose SMI?</h2>
        </ScrollFadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <ScrollSlideIn direction="left" delay={0.1}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Expert Automation</h3>
              <p className="text-white/80 text-sm sm:text-base">Cutting-edge AI technology handles trading decisions, so you don't have to.</p>
            </div>
          </ScrollSlideIn>
          <ScrollSlideIn direction="up" delay={0.2}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">Multi-Asset Support</h3>
              <p className="text-white/80 text-sm sm:text-base">Diversify your portfolio across Forex, Indices, Commodities, and more.</p>
            </div>
          </ScrollSlideIn>
          <ScrollSlideIn direction="right" delay={0.3}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-white">No Experience Needed</h3>
              <p className="text-white/80 text-sm sm:text-base">Perfect for beginners. Set your preferences and let SMI handle the rest.</p>
            </div>
          </ScrollSlideIn>
        </div>
      </div>
    </section>
    
    {/* Testimonials */}
    <section id="testimonials" className="relative z-10 py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-5 text-center">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-white">Trusted by Traders Worldwide</h2>
          <blockquote className="text-lg sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-white/90 italic px-1">
            "SMI has completely transformed my trading. The automation is flawless, and I've seen consistent returns across multiple markets."
          </blockquote>
          <p className="text-white/60 text-base sm:text-lg">— Sarah Chen, Professional Trader</p>
        </ScrollFadeIn>
      </div>
    </section>
    
    {/* FAQ Section */}
    <section id="faq" className="relative z-10 py-12 sm:py-16 md:py-24 bg-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-16 text-white text-center">Frequently Asked Questions</h2>
        </ScrollFadeIn>
        <div className="space-y-3 sm:space-y-4">
          <ScrollFadeIn delay={0.1}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-4 sm:p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-base sm:text-lg min-h-[44px] flex items-center">What is SMI, and how does it work?</summary>
              <p className="text-white/80 mt-3 text-sm sm:text-base">SMI is an automated trading bot that executes trades across multiple markets, including Forex, Indices, and Commodities. Using advanced algorithms, SMI scans market data, identifies trading opportunities, and executes trades based on your predefined settings and risk preferences.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-base sm:text-lg min-h-[44px] flex items-center">How do I set up SMI for my trading needs?</summary>
              <p className="text-white/80 mt-3 text-sm sm:text-base">Setting up SMI is simple. After creating your account, you can customize your trading preferences by selecting your risk tolerance, asset allocation, and preferred trading strategies. SMI will then execute trades based on your chosen parameters.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.3}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-base sm:text-lg min-h-[44px] flex items-center">Is my money and data secure?</summary>
              <p className="text-white/80 mt-3 text-sm sm:text-base">Yes, SMI employs state-of-the-art encryption and security measures to protect your personal and financial information. Your funds are held with trusted brokers, and SMI ensures that all trading activities are securely managed.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.4}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-base sm:text-lg min-h-[44px] flex items-center">Do I need trading experience?</summary>
              <p className="text-white/80 mt-3 text-sm sm:text-base">No, you don't need prior trading experience to use SMI. The platform is designed for both beginners and experienced traders. SMI takes care of the trading process, and users simply set their preferences, letting the bot handle the rest.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.5}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-base sm:text-lg min-h-[44px] flex items-center">Can I trade in multiple markets at the same time with SMI?</summary>
              <p className="text-white/80 mt-3 text-sm sm:text-base">Yes! SMI supports simultaneous trading across various markets, including Forex, Indices, and Commodities. You can set your preferences for each asset class, and SMI will handle trades in all markets for a diversified portfolio.</p>
            </details>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
    
    {/* Contact Section */}
    <section id="contact" className="relative z-10 py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-white text-center">Get in Touch</h2>
        </ScrollFadeIn>
        <ScrollScaleIn delay={0.2}>
          <ContactForm />
        </ScrollScaleIn>
      </div>
    </section>
    
    {/* Privacy Section */}
    <section id="privacy" className="relative z-10 py-12 sm:py-16 md:py-24 bg-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-white text-center">Privacy Policy</h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.2}>
          <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <p className="text-white/80 mb-4 text-base sm:text-lg">
              At SMI, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our trading platform.
            </p>
            <p className="text-white/80 mb-4 text-base sm:text-lg">
              We collect only the information necessary to provide our services, including your name, email address, and trading preferences. 
              Your financial data is encrypted and stored securely using industry-standard security measures.
            </p>
            <p className="text-white/80 text-base sm:text-lg">
              We do not sell, trade, or share your personal information with third parties without your explicit consent, 
              except as required by law or to provide our services effectively.
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>

    {/* Terms Section */}
    <section id="terms" className="relative z-10 py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <ScrollFadeIn>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-white text-center">Terms of Service</h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.2}>
          <div className="bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-8 backdrop-blur-sm">
            <p className="text-white/80 mb-4 text-base sm:text-lg">
              By using SMI, you agree to these Terms of Service. Our automated trading platform is designed to assist with 
              trading decisions, but all trading involves risk. Past performance does not guarantee future results.
            </p>
            <p className="text-white/80 mb-4 text-base sm:text-lg">
              You are responsible for your trading decisions and any financial losses that may occur. SMI provides tools and
              information, but you retain full control over your trading activities and account management.
            </p>
            <p className="text-white/80 text-base sm:text-lg">
              We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance
              of any changes to these terms.
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>

    {/* Footer */}
    <footer className="relative z-10 border-t border-white/6 bg-black/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center sm:text-left">
        <span className="text-white/80 text-sm sm:text-base">© {new Date().getFullYear()} SMI Trading Platform</span>
        <button onClick={() => document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/80 hover:text-white transition-colors min-h-[44px] flex items-center justify-center px-4">
          Privacy
        </button>
      </div>
    </footer>
    {/* Top Dock above; bottom dock removed per request */}
  </div>
  );
};

// Auth0 signup: collect required profile fields, then redirect to Auth0 Universal Login
const Register = () => {
  const { loginWithRedirect } = useAuth0();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [regError, setRegError] = useState('');

  const handleSignUp = () => {
    setRegError('');
    if (!username.trim() || !phone.trim() || !address.trim()) {
      setRegError('Username, mobile number, and address are required.');
      return;
    }
    try {
      localStorage.setItem(
        'smi_registration_profile',
        JSON.stringify({
          username: username.trim(),
          phone: phone.trim(),
          address: address.trim()
        })
      );
    } catch (e) {
      setRegError('Could not save form. Please try again.');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) try { localStorage.setItem('smi_referral_code', ref.trim()); } catch (e) { /* ignore */ }
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black px-4 py-6 sm:py-8">
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <div className="w-full max-w-md bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-6 text-left relative z-10 backdrop-blur-sm mx-auto">
        <div className="font-bold text-xl sm:text-2xl mb-2">SMI</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Let&apos;s Get Started</h2>
        <p className="text-white/80 mb-4 sm:mb-5 text-sm sm:text-base">Enter your details, then continue to secure signup. KYC is only needed later when you withdraw.</p>
        <div className="grid gap-3 sm:gap-4">
          <div>
            <label htmlFor="reg-username" className="block text-white/70 text-xs mb-1">Username *</label>
            <input
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full min-h-[44px] px-4 py-2 rounded-lg border border-white/30 bg-black/30 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="block text-white/70 text-xs mb-1">Mobile number *</label>
            <input
              id="reg-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="w-full min-h-[44px] px-4 py-2 rounded-lg border border-white/30 bg-black/30 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor="reg-address" className="block text-white/70 text-xs mb-1">Address *</label>
            <textarea
              id="reg-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-white/30 bg-black/30 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm resize-y min-h-[80px]"
              placeholder="Full address (city, state, PIN)"
            />
          </div>
          {regError && <p className="text-red-400 text-sm">{regError}</p>}
          <button
            type="button"
            onClick={handleSignUp}
            className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity w-full"
          >
            Continue to Create Account
          </button>
          <p className="text-white/50 text-xs mt-1 text-center">You’ll be taken to a secure page to verify email and finish signup.</p>
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold underline">
                Sign In
              </Link>
            </p>
            <Link to="/" className="block mt-4 text-white/60 hover:text-white/80 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth0 login: redirects to Auth0 Universal Login
const Login = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black px-4 py-6 sm:py-8">
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <div className="w-full max-w-md bg-white/10 border border-white/6 rounded-2xl p-5 sm:p-6 text-left relative z-10 backdrop-blur-sm mx-auto">
        <div className="font-bold text-xl sm:text-2xl mb-2">SMI</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Welcome!</h2>
        <p className="text-white/80 mb-5 sm:mb-6 text-sm sm:text-base">Login to continue your journey.</p>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={handleLogin}
            className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity w-full"
          >
            Log In
          </button>
          <p className="text-white/50 text-xs mt-3 text-center">You’ll be taken to a secure page to sign in.</p>
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-cyan-300 hover:text-cyan-200 font-semibold underline">
                Register
              </Link>
            </p>
            <Link to="/" className="block mt-4 text-white/60 hover:text-white/80 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 border border-white/6 rounded-xl p-4 sm:p-6 grid gap-4">
      <label className="grid gap-2 text-white/80 text-sm sm:text-base">
        Full Name
        <input 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name" 
          className="min-h-[44px] p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80 text-sm sm:text-base">
        Email
        <input 
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email" 
          className="min-h-[44px] p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80 text-sm sm:text-base">
        Subject
        <input 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject" 
          className="min-h-[44px] p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80 text-sm sm:text-base">
        Message
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message" 
          className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 min-h-[120px]" 
          rows="4"
          required
        ></textarea>
      </label>
      
      {submitStatus === 'success' && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm sm:text-base">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm sm:text-base">
          Failed to send message. Please try again.
        </div>
      )}
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="min-h-[44px] px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useAuth0();

  const goToSection = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  const dockItems = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => goToSection('home') },
    { icon: <VscQuestion size={18} />, label: 'FAQ', onClick: () => goToSection('faq') },
    { icon: <VscShield size={18} />, label: 'Privacy', onClick: () => goToSection('privacy') },
    { icon: <VscFile size={18} />, label: 'Terms', onClick: () => goToSection('terms') },
    { icon: <VscMail size={18} />, label: 'Contact', onClick: () => goToSection('contact') },
  ];

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/80">Loading...</p>
      </div>
    );
  }

  return (
    <ClickSpark>
      <div className={`min-h-screen ${isAuthPage || isHomePage || isDashboard ? 'bg-black' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-red-500/90 text-white rounded-lg text-sm">
            {error.message}
          </div>
        )}
        {!isAuthPage && !isDashboard && (
          <Dock
            items={dockItems}
            position="top"
            panelHeight={64}
            baseItemSize={46}
            magnification={64}
            distance={180}
            className="bg-white/10 border-white/20"
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </ClickSpark>
  );
}
