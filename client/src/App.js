import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Dock from './components/Dock';
import ClickSpark from './components/ClickSpark';
import LightRays from './components/LightRays';
import { ScrollFadeIn, ScrollScaleIn, ScrollSlideIn } from './components/ScrollAnimation';
import { TradingScene, CoinsScene } from './components/Scene3D';
import Dashboard from './components/Dashboard';
import { VscHome, VscQuestion, VscShield, VscFile, VscMail } from 'react-icons/vsc';

const Home = () => {
  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navigate = useNavigate();

  return (
  <div className="min-h-screen relative overflow-hidden bg-black">
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
    <header id="home" className="relative z-10 min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-6xl mx-auto px-5 text-center">
        <ScrollFadeIn>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white bg-clip-text">
            SMI Trading Platform
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
            Automated trading across Forex, Indices, and Commodities. 
            <span className="block mt-2">Easy, powerful, and accessible to everyone.</span>
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link to="/register" className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity text-lg">
              Get Started
            </Link>
            <button onClick={() => navigate('/login')} className="px-8 py-4 rounded-lg bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors text-lg">
              Sign In
            </button>
          </div>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.3}>
          <div className="mt-16 h-96">
            <TradingScene />
          </div>
        </ScrollFadeIn>
      </div>
    </header>
    
    {/* Features Section */}
    <section id="features" className="relative z-10 py-24">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white text-center">Powerful Features</h2>
        </ScrollFadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollScaleIn delay={0.1}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-48 mb-6 rounded-xl overflow-hidden">
                <TradingScene />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Automated Forex Trading</h3>
              <p className="text-white/80">Advanced algorithms scan markets 24/7 and execute trades with precision timing.</p>
            </div>
          </ScrollScaleIn>
          <ScrollScaleIn delay={0.2}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-48 mb-6 rounded-xl overflow-hidden">
                <CoinsScene />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Efficient Indices Trading</h3>
              <p className="text-white/80">Optimized strategies for S&P 500, NASDAQ, UK100, and global indices.</p>
            </div>
          </ScrollScaleIn>
          <ScrollScaleIn delay={0.3}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/15 transition-all">
              <div className="h-48 mb-6 rounded-xl overflow-hidden">
                <TradingScene />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Commodities Trading</h3>
              <p className="text-white/80">Trade gold, oil, and other commodities with intelligent risk management.</p>
            </div>
          </ScrollScaleIn>
        </div>
      </div>
    </section>
    
    {/* Why Choose Section */}
    <section id="why" className="relative z-10 py-24 bg-white/5">
      <div className="max-w-6xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white text-center">Why Choose SMI?</h2>
        </ScrollFadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollSlideIn direction="left" delay={0.1}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-3 text-white">Expert Automation</h3>
              <p className="text-white/80">Cutting-edge AI technology handles trading decisions, so you don't have to.</p>
            </div>
          </ScrollSlideIn>
          <ScrollSlideIn direction="up" delay={0.2}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-3 text-white">Multi-Asset Support</h3>
              <p className="text-white/80">Diversify your portfolio across Forex, Indices, Commodities, and more.</p>
            </div>
          </ScrollSlideIn>
          <ScrollSlideIn direction="right" delay={0.3}>
            <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-3 text-white">No Experience Needed</h3>
              <p className="text-white/80">Perfect for beginners. Set your preferences and let SMI handle the rest.</p>
            </div>
          </ScrollSlideIn>
        </div>
      </div>
    </section>
    
    {/* Testimonials */}
    <section id="testimonials" className="relative z-10 py-24">
      <div className="max-w-4xl mx-auto px-5 text-center">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">Trusted by Traders Worldwide</h2>
          <blockquote className="text-2xl md:text-3xl mb-6 text-white/90 italic">
            "SMI has completely transformed my trading. The automation is flawless, and I've seen consistent returns across multiple markets."
          </blockquote>
          <p className="text-white/60 text-lg">— Sarah Chen, Professional Trader</p>
        </ScrollFadeIn>
      </div>
    </section>
    
    {/* FAQ Section */}
    <section id="faq" className="relative z-10 py-24 bg-white/5">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white text-center">Frequently Asked Questions</h2>
        </ScrollFadeIn>
        <div className="space-y-4">
          <ScrollFadeIn delay={0.1}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-lg">What is SMI, and how does it work?</summary>
              <p className="text-white/80 mt-3">SMI is an automated trading bot that executes trades across multiple markets, including Forex, Indices, and Commodities. Using advanced algorithms, SMI scans market data, identifies trading opportunities, and executes trades based on your predefined settings and risk preferences.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.2}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-lg">How do I set up SMI for my trading needs?</summary>
              <p className="text-white/80 mt-3">Setting up SMI is simple. After creating your account, you can customize your trading preferences by selecting your risk tolerance, asset allocation, and preferred trading strategies. SMI will then execute trades based on your chosen parameters.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.3}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-lg">Is my money and data secure?</summary>
              <p className="text-white/80 mt-3">Yes, SMI employs state-of-the-art encryption and security measures to protect your personal and financial information. Your funds are held with trusted brokers, and SMI ensures that all trading activities are securely managed.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.4}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-lg">Do I need trading experience?</summary>
              <p className="text-white/80 mt-3">No, you don't need prior trading experience to use SMI. The platform is designed for both beginners and experienced traders. SMI takes care of the trading process, and users simply set their preferences, letting the bot handle the rest.</p>
            </details>
          </ScrollFadeIn>
          <ScrollFadeIn delay={0.5}>
            <details className="bg-white/10 border border-white/6 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 transition-all">
              <summary className="text-white font-semibold cursor-pointer text-lg">Can I trade in multiple markets at the same time with SMI?</summary>
              <p className="text-white/80 mt-3">Yes! SMI supports simultaneous trading across various markets, including Forex, Indices, and Commodities. You can set your preferences for each asset class, and SMI will handle trades in all markets for a diversified portfolio.</p>
            </details>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
    
    {/* Contact Section */}
    <section id="contact" className="relative z-10 py-24">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">Get in Touch</h2>
        </ScrollFadeIn>
        <ScrollScaleIn delay={0.2}>
          <ContactForm />
        </ScrollScaleIn>
      </div>
    </section>
    
    {/* Privacy Section */}
    <section id="privacy" className="relative z-10 py-24 bg-white/5">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">Privacy Policy</h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.2}>
          <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-white/80 mb-4 text-lg">
              At SMI, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our trading platform.
            </p>
            <p className="text-white/80 mb-4 text-lg">
              We collect only the information necessary to provide our services, including your name, email address, and trading preferences. 
              Your financial data is encrypted and stored securely using industry-standard security measures.
            </p>
            <p className="text-white/80 text-lg">
              We do not sell, trade, or share your personal information with third parties without your explicit consent, 
              except as required by law or to provide our services effectively.
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>

    {/* Terms Section */}
    <section id="terms" className="relative z-10 py-24">
      <div className="max-w-4xl mx-auto px-5">
        <ScrollFadeIn>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">Terms of Service</h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={0.2}>
          <div className="bg-white/10 border border-white/6 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-white/80 mb-4 text-lg">
              By using SMI, you agree to these Terms of Service. Our automated trading platform is designed to assist with 
              trading decisions, but all trading involves risk. Past performance does not guarantee future results.
            </p>
            <p className="text-white/80 mb-4 text-lg">
              You are responsible for your trading decisions and any financial losses that may occur. SMI provides tools and 
              information, but you retain full control over your trading activities and account management.
            </p>
            <p className="text-white/80 text-lg">
              We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance 
              of any changes to these terms.
            </p>
          </div>
        </ScrollFadeIn>
      </div>
    </section>

    {/* Footer */}
    <footer className="relative z-10 border-t border-white/6 bg-black/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 h-20 flex items-center justify-between">
        <span className="text-white/80">© {new Date().getFullYear()} SMI Trading Platform</span>
        <button onClick={() => document.getElementById('privacy')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/80 hover:text-white transition-colors">
          Privacy
        </button>
      </div>
    </footer>
    {/* Top Dock above; bottom dock removed per request */}
  </div>
  );
};

// Auth0 signup: redirects to Auth0 Universal Login with signup screen
const Register = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = () => {
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
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
      <div className="w-full max-w-md bg-white/10 border border-white/6 rounded-2xl p-6 text-left relative z-10 backdrop-blur-sm">
        <div className="font-bold text-2xl mb-2">SMI</div>
        <h2 className="text-2xl font-bold mb-2 text-white">Let&apos;s Get Started</h2>
        <p className="text-white/80 mb-6">Register a new membership with SMI.</p>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={handleSignUp}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity w-full"
          >
            Sign Up with Auth0
          </button>
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
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
      <div className="w-full max-w-md bg-white/10 border border-white/6 rounded-2xl p-6 text-left relative z-10 backdrop-blur-sm">
        <div className="font-bold text-2xl mb-2">SMI</div>
        <h2 className="text-2xl font-bold mb-2 text-white">Welcome!</h2>
        <p className="text-white/80 mb-6">Login to continue your journey.</p>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={handleLogin}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity w-full"
          >
            Log In with Auth0
          </button>
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
    <form onSubmit={handleSubmit} className="bg-white/10 border border-white/6 rounded-xl p-6 grid gap-4">
      <label className="grid gap-2 text-white/80">
        Full Name
        <input 
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name" 
          className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80">
        Email
        <input 
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email" 
          className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80">
        Subject
        <input 
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject" 
          className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          required 
        />
      </label>
      <label className="grid gap-2 text-white/80">
        Message
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message" 
          className="p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60" 
          rows="4"
          required
        ></textarea>
      </label>
      
      {submitStatus === 'success' && (
        <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          Failed to send message. Please try again.
        </div>
      )}
      
      <button 
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
