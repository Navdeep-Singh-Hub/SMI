import React from 'react';
import Dock from './Dock';
import { VscHome, VscQuestion, VscShield, VscFile, VscMail } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HeaderNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (location.pathname !== '/') {
      navigate('/');
      // wait a tick for mount
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  const items = [
    { icon: <VscHome size={18} />, label: 'Home', onClick: () => goToSection('home') },
    { icon: <VscQuestion size={18} />, label: 'FAQ', onClick: () => goToSection('faq') },
    { icon: <VscShield size={18} />, label: 'Privacy', onClick: () => goToSection('privacy') },
    { icon: <VscFile size={18} />, label: 'Terms', onClick: () => goToSection('terms') },
    { icon: <VscMail size={18} />, label: 'Contact', onClick: () => goToSection('contact') },
  ];

  return (
    <header className="sticky top-0 z-20 flex justify-center py-2 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <Dock
        items={items}
        position="inline"
        panelHeight={56}
        baseItemSize={42}
        magnification={64}
        distance={180}
        className="gap-3 bg-transparent border-white/15"
      />
    </header>
  );
}

