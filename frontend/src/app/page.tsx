'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Leaf, 
  Mail, 
  MapPin,
  ExternalLink
} from 'lucide-react';

// --- BRAND ASSETS ---
const LOGO_URL = "/logo1.png"; 

// --- HERO BACKGROUNDS ---
const HERO_IMAGE_PRIMARY = "/samosa1.jpg";
const HERO_IMAGE_SECONDARY = "/kaimati.jpg";

// --- GALLERY DATA ---
const GALLERY_IMAGES = [
  { url: "/naan.jpg", title: "NaaN" },
  { url: "chapo.jpg", title: "Chapati" },
  { url: "ngumu.jpg", title: "Crunchy Half Cakes" },
  { url: "/mahamri.jpg", title: "Mahamri" },
  { url: "/sam.jpg", title: "Samosa" },
  { url: "/kaimati2.webp", title: "Kaimati" }
];

const Reveal = ({ 
  children, 
  width = "w-full", 
  delay = 0, 
  direction = "up" 
}: { 
  children: React.ReactNode; 
  width?: string; 
  delay?: number; 
  direction?: string; 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target as HTMLElement);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${width} transition-all duration-1000 ease-out`}
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: getTransform()
      }}
    >
      {children}
    </div>
  );
};


export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#1A1A1A] font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;600;800&display=swap');
        
        body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; scroll-behavior: smooth; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        @keyframes subtle-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-zoom { animation: subtle-zoom 25s infinite alternate ease-in-out; }

        .hero-bg-texture {
          background-color: #F2E9E1;
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
        }

        .spice-pattern {
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z' fill='%23E87E44' /%3E%3C/svg%3E%0A");
          background-size: 200px 200px;
        }

        .vertical-text {
          writing-mode: vertical-rl;
        }

        .writing-v {
            writing-mode: vertical-rl;
            text-orientation: mixed;
        }
      `}</style>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* BRAND TO THE LEFT */}
          <div className="flex flex-col items-start">
            <a href="/" className="group flex items-center gap-3 no-underline transition-all duration-500 hover:opacity-80">
              <div className="relative w-8 h-8 md:w-10 md:h-10 bg-[#E87E44] rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:rotate-12 overflow-hidden -mt-1">
                {LOGO_URL ? (
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif font-bold text-lg md:text-xl">S</span>
                )}
              </div>
              <div className="flex flex-col -space-y-1 text-left">
                <span className="text-xl md:text-2xl font-black font-serif text-[#1A1A1A]">Swahili</span>
                <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#E87E44]">Coastal Crunch</span>
              </div>
            </a>
          </div>

          {/* NAV TO THE RIGHT */}
          <nav className="flex gap-1 md:gap-4">
            {[
              { label: 'Home', path: '/' },
              { label: 'Menu', path: '/menu' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' }
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.path} 
                className="px-2 md:px-4 py-2 text-[10px] font-extrabold rounded-full transition-all tracking-[0.2em] uppercase text-[#1A1A1A] hover:bg-black/5"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col md:flex-row items-stretch overflow-hidden bg-[#E5DACE]">
        
        {/* LEFT PANEL: PRIMARY IMAGE - COMPLETELY CLEAR */}
        <div className="relative flex-[1.2] overflow-hidden order-2 md:order-1 border-r border-stone-200/30">
          <img 
            src={HERO_IMAGE_PRIMARY} 
            className="w-full h-full object-cover animate-zoom" 
            alt="Authentic Coastal Food"
          />
          
          {/* TEXT ON THE LEFT PANEL BLANK SPACE */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-6">
            <div className="w-px h-32 bg-white/60"></div>
            <p className="writing-v text-[10px] font-black uppercase tracking-[0.8em] text-white drop-shadow-lg">
                Tradition • Heritage • Spice
            </p>
          </div>
        </div>
        
        {/* RIGHT PANEL: TEXT CONTENT & INTEGRATED IMAGE */}
        <div className="relative flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-16 hero-bg-texture z-10 order-1 md:order-2">
          <div className="absolute inset-0 spice-pattern pointer-events-none opacity-[0.06]"></div>
          
          <div className="relative flex flex-col pt-16 md:pt-0">
            <div className="animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
              
              {/* BRAND TAGS */}
              <div className="flex items-center gap-6 mb-8 overflow-hidden">
                 <div className="flex flex-col">
                    <span className="text-[15px] font-black uppercase tracking-[0.5em] text-[#E87E44]">Est. 2025</span>
                    <span className="w-12 h-[2px] bg-[#E87E44] mt-1 transform origin-left animate-in slide-in-from-left duration-1000 delay-300"></span>
                 </div>
                 <span className="text-[15px] font-black uppercase tracking-[0.5em] text-stone-500">Swahili & Aesthetical</span>
              </div>

              {/* SECONDARY IMAGE */}
              <div className="relative w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 mb-10 border-4 border-white/50 group">
                 <img 
                    src={HERO_IMAGE_SECONDARY} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Signature Platter"
                 />
                 <div className="absolute inset-0 bg-black/10"></div>
                 <div className="absolute bottom-4 left-4">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white px-3 py-1 bg-[#E87E44] rounded-full">New Arrivals</span>
                 </div>
              </div>
              
              <div className="relative max-w-sm mb-10 pl-6 border-l-2 border-stone-300 animate-in fade-in duration-1000 delay-700">
                <p className="text-stone-600 text-lg font-light leading-relaxed">
                  Hand-folded <span className="font-semibold text-[#1A1A1A]">samosas</span> and golden kaimati, spiced with the ancestral soul of the Swahili coast.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-900">
                <a href="/menu" className="group relative flex items-center gap-6 bg-[#1A1A1A] text-white pl-10 pr-3 py-3 rounded-full hover:bg-[#E87E44] transition-all duration-500 shadow-xl shadow-black/10 active:scale-95">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explore Menu</span>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-12 right-12 hidden xl:flex items-center gap-4 opacity-30 animate-bounce">
            <div className="text-[9px] font-bold tracking-[0.5em] vertical-text transform rotate-180 text-[#1A1A1A]">SCROLL</div>
            <div className="h-16 w-px bg-stone-400"></div>
          </div>
        </div>
      </section>

      {/* THE CRAFT SECTION */}
      <section className="py-32 bg-white px-8" id="spices-section">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal direction="right">
            <div className="relative group max-w-sm mx-auto md:ml-0">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                <img src="/spices.jpg" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Spice Selection" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#E8DCC4] p-6 rounded-xl shadow-xl max-w-[180px]">
                <Leaf className="text-[#1A3C34] mb-2 animate-pulse" size={18} />
                <p className="text-[8px] uppercase font-black tracking-widest text-[#1A3C34]">Origins</p>
                <p className="text-[10px] italic font-serif text-stone-600 mt-1 leading-tight">Sourced directly from the spice markets of Zanzibar.</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal delay={200}>
              <div className="space-y-4">
                <span className="text-[#E87E44] text-[12px] font-black uppercase tracking-[0.5em]">The Philosophy</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic !text-black leading-tight">The Craft: A dialogue of spice and flame.</h2>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-stone-1000 text-base md:text-lg leading-relaxed font-light">
                We celebrate the artisanal traditions of the coast. Every item on our menu is a testament to patience—from the 24-hour dough rest to the hand-toasting of whole aromatics.
              </p>
            </Reveal>
            <Reveal delay={600}>
              <a href="/about" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border-b-2 border-[#E87E44] pb-2 hover:text-[#E87E44] transition-all group">
                Learn about our methods <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HERITAGE GALLERY */}
      <section className="py-32 bg-[#F9F8F6] px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-20 space-y-4">
              <span className=" text-4xl text-[#E87E44] text-[9px] font-black uppercase tracking-[0.7em]">Visual Journey</span>
              <h2 className="text-4xl md:text-5xl font-serif italic !text-black">The Coastal Table</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {GALLERY_IMAGES.map((img, idx) => (
              <Reveal key={idx} delay={idx * 150} direction={idx % 2 === 0 ? 'up' : 'down'}>
                <div className={`relative group aspect-[1/1] overflow-hidden rounded-xl bg-stone-200 shadow-md ${idx % 2 !== 0 ? 'lg:translate-y-8' : ''} transition-all duration-700`}>
                  <img src={img.url} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2" alt={img.title} />
                  <div className="absolute inset-0 bg-[#1A3C34]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4 text-center backdrop-blur-[2px]">
                     <p className="text-white text-[9px] font-black uppercase tracking-widest border-b border-[#E87E44] pb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{img.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A3C34] text-[#E8DCC4] pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 pb-20 border-b border-white/10">
            <div className="lg:col-span-5 space-y-10">
              <Reveal direction="right">
                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#E87E44] rounded-xl flex items-center justify-center overflow-hidden shadow-2xl transform -rotate-3 border-2 border-[#E8DCC4]/20 group hover:rotate-0 transition-transform duration-500 -mt-2">
                      {LOGO_URL ? (
                        <img src={LOGO_URL} alt="Brand Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-serif font-bold text-2xl">S</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-serif italic leading-tight">
                      Taste the <br />
                      <span className="text-[#E87E44] not-italic font-bold tracking-tight">Ocean's Spirit</span>
                    </h2>
                  </div>
                  <p className="text-stone-400 text-xs leading-relaxed max-w-sm font-light tracking-wide uppercase opacity-70">
                    From the spice markets of Zanzibar to the shores of Mombasa, we bring you the authentic textures of Swahili coastal cuisine.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <Reveal delay={200}>
                <div className="space-y-6">
                  <h5 className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E87E44]">Quick Links</h5>
                  <ul className="space-y-3 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                    <li className="hover:text-white cursor-pointer transition-colors"><a href="/menu">The Menu</a></li>
                    <li className="hover:text-white cursor-pointer transition-colors">Gift Cards</li>
                    <li className="hover:text-white cursor-pointer transition-colors"><a href="/about">Our Story</a></li>
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={400}>
                <div className="space-y-6">
                  <h5 className="text-[9px] font-black uppercase tracking-[0.5em] text-[#E87E44]">Contact Us</h5>
                  <ul className="space-y-3 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                    <li className="flex items-center gap-2 hover:text-white transition-colors group cursor-pointer lowercase">
                      <Mail size={12} /> <a href="mailto:hello@swahili.com">hello@swahili.com</a>
                    </li>
                    <li className="flex items-center gap-2 hover:text-white transition-colors group cursor-pointer capitalize">
                      <MapPin size={12} /> <a href="/contact">Coastal Quarter, EC2</a>
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-stone-500 font-bold uppercase tracking-[0.5em]">
            <p>© 2024 SWAHILI COASTAL CRUNCH. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
               <span className="hover:text-[#E87E44] cursor-pointer transition-colors">Privacy Policy</span>
               <span className="hover:text-[#E87E44] cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  ); 
}