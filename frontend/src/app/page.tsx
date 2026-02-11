"use client";
import React, { useState } from 'react';
import { ShoppingCart, Search, Menu as MenuIcon, X, Mail, Phone, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const App = () => {
  const [view, setView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  };

  return (
    <div className="min-h-screen bg-[#E5E1D8] text-stone-900 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; }
        .font-serif { font-family: 'Playfair Display', serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="w-full min-h-screen bg-white shadow-2xl relative">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 lg:px-12 py-5 sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-stone-100">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 overflow-hidden border-2 border-white">
              <img src="/logo1.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-stone-800">Swahili Coastal Crunch</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
  {[
    { name: 'Home', action: 'scroll' },
    { name: 'Services', action: 'scroll' },
    { name: 'Menu', action: 'link', href: '/menu' },
    { name: 'About', action: 'link', href: '/about' },
    { name: 'Contact', action: 'link', href: '/contact' }
  ].map((item) => (
    <div key={item.name} className={`text-[12px] font-bold transition-colors uppercase tracking-widest ${
      view === item.name.toLowerCase() ? 'text-orange-500' : 'text-stone-400 hover:text-stone-900'
    }`}>
      {item.action === 'scroll' ? (
        <button 
          onClick={() => {
            if(item.name === 'Home') window.scrollTo(0,0);
            else scrollToSection(item.name.toLowerCase());
          }}
        >
          {item.name}
        </button>
      ) : (
        <a href={item.href}>
          {item.name}
        </a>
      )}
    </div>
  ))}
</div>


          <div className="flex items-center gap-6">
            <Search size={20} className="text-stone-400 cursor-pointer hover:text-orange-500 transition-colors" />
            <div className="relative cursor-pointer group">
              <ShoppingCart size={20} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
            </div>
            <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
              <MenuIcon size={24} />
            </button>
          </div>
        </nav>

     {/* 🚀 IMPROVED HERO SECTION - CLEAN & ELEGANT */}
<section id="home" className="relative min-h-screen flex flex-col justify-center px-6 lg:px-12 py-20">
  <div className="absolute inset-0 z-0">
  <img 
    src="/samosa.jpg" 
    className="w-full h-full object-cover" 
    alt="Background"
  />
</div>


  {/* Floating Delivery Badge */}
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    className="absolute top-24 lg:top-32 right-6 lg:right-12 bg-orange-500/95 backdrop-blur-md text-white px-6 py-4 rounded-3xl font-bold shadow-2xl z-20 border-4 border-white/50 flex items-center gap-2"
  >
    🚚 <span className="text-sm">Kansas Delivery</span> <span className="text-xs font-black">$30</span>
  </motion.div>

  <div className="relative z-10 w-full grid lg:grid-cols-2 gap-20 items-center">
    {/* LEFT: Hero Content */}
    <motion.div {...fadeInUp} className="text-center lg:text-left space-y-10 max-w-lg lg:max-w-none">
      <div className="inline-flex items-center gap-4">
        <span className="h-[3px] w-20 bg-gradient-to-r from-orange-500 to-orange-400" />
        <span className="text-orange-600 font-serif italic text-xl font-bold uppercase tracking-wide bg-orange-50/50 px-4 py-2 rounded-full backdrop-blur-sm">
          Authentic Coastal Delicacies
        </span>
      </div>
      
      <h1 className="text-6xl md:text-7xl lg:text-5xl xl:text-6lg font-serif font-black leading-[0.85] tracking-tight">
        <span className="text-stone-900 drop-shadow-2xl text-white">Savor the</span>
        <br className="hidden lg:block" />
        <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-3xl">
          Coastal Crunch
        </span>
      </h1>
      
      
      
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6">
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToSection('menu')}
          className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-14 py-7 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 flex items-center gap-4 backdrop-blur-md border-4 border-white/20"
        >
          Order Now 
          <ArrowRight size={22} className="group-hover:translate-x-2 transition-all duration-300" />
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToSection('menu')}
          className="border-4 border-stone-200 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-stone-800 hover:text-orange-700 px-12 py-7 rounded-3xl font-bold text-lg shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 flex items-center gap-3 backdrop-blur-md"
        >
          View Full Menu
        </motion.button>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 text-sm font-bold text-stone-600">
        <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          500+ Happy Customers
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          5⭐ Google Rating
        </div>
      </div>
    </motion.div>

    
  </div>

  {/* Scroll Indicator */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, 10, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center text-stone-500 z-20"
  >
    <div className="w-3 h-12 border-l-2 border-stone-400 mx-auto animate-bounce" />
    <span className="text-xs uppercase tracking-[0.3em] font-bold mt-3 block">Scroll to Explore</span>
  </motion.div>
</section>


        {/* Services Section - ALL SECTIONS NOW HAVE CTAs */}
        <section id="services" className="px-6 lg:px-12 py-24 bg-stone-50/50 space-y-24">
          
          {/* Crunchy Half-Cakes */}
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
             <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
               <motion.div {...fadeInUp} className="relative z-10 rounded-[2.5rem] overflow-hidden aspect-square w-full max-w-[280px] border-[8px] border-white shadow-2xl group shrink-0 flex-shrink-0">
                 <img src="/ngumu.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Crunchy Half-Cakes" />
               </motion.div>
               <div className="space-y-4 max-w-[180px] lg:text-left">
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Our Specialty</p>
                 <h4 className="font-serif font-bold text-stone-900 text-xl leading-tight">Crunchy Half-Cakes</h4>
                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider leading-relaxed">Hand-crafted everyday. The ultimate balance of golden crunch and airy sweetness.</p>
               </div>
             </div>
             <div className="w-full lg:w-1/2 space-y-6">
               <span className="text-orange-500 font-serif italic text-2xl block">Featured Product</span>
               <h2 className="text-3xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">Our Signature Crunch</h2>
               <p className="text-stone-500 leading-relaxed text-lg font-medium">
                 These golden half-cakes represent the pinnacle of coastal baking tradition. Perfectly balanced texture that melts in your mouth. KES 200.
               </p>
               <button className="bg-orange-500 hover:bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transition-all w-full lg:w-auto">
                 Order Half-Cakes
               </button>
             </div>
          </div>

          {/* Samosas Section */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 flex items-center gap-8 lg:gap-12 justify-end">
               <div className="space-y-4 max-w-[180px] text-right">
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Flavor Burst</p>
                 <h4 className="font-serif font-bold text-stone-900 text-xl leading-tight">Crispy Samosas</h4>
                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider leading-relaxed">Spiced to perfection with a thin, brittle crust that shatters with every bite.</p>
               </div>
               <motion.div {...fadeInUp} className="relative z-10 rounded-[2.5rem] overflow-hidden aspect-square w-full max-w-[280px] border-[8px] border-white shadow-2xl group shrink-0">
                 <img src="sam.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Samosas" />
               </motion.div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-orange-500 font-serif italic text-2xl block">Spiced & Savory</span>
              <h2 className="text-3xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">The Perfect Coastal Snack</h2>
              <p className="text-stone-500 leading-relaxed text-lg font-medium">
                Our samosas are renowned for their delicate folding and robust fillings, prepared with fresh herbs and hand-ground spices from the heart of the coast. KES 120.
              </p>
              <button className="bg-orange-500 hover:bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transition-all w-full lg:w-auto">
                Order Samosas
              </button>
            </div>
          </div>

          {/* Kaimati Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 flex items-center gap-8 lg:gap-12">
               <motion.div {...fadeInUp} className="relative z-10 rounded-[2.5rem] overflow-hidden aspect-square w-full max-w-[280px] border-[8px] border-white shadow-2xl group shrink-0">
                 <img src="/kaimati.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Kaimati" />
               </motion.div>
               <div className="space-y-4 max-w-[180px]">
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Sweet Glaze</p>
                 <h4 className="font-serif font-bold text-stone-900 text-xl leading-tight">Honeyed Kaimati</h4>
                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider leading-relaxed">Golden syrup-coated dumplings that are soft on the inside and crunchy on the outside.</p>
               </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-orange-500 font-serif italic text-2xl block">A Sweet Tradition</span>
              <h2 className="text-3xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">Glistening Golden Treasures</h2>
              <p className="text-stone-500 leading-relaxed text-lg font-medium">
                Fried to a deep amber and tossed in a fragrant sugar syrup. KES 100.
              </p>
              <button className="bg-orange-500 hover:bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transition-all w-full lg:w-auto">
                Order Kaimati
              </button>
            </div>
          </div>

          {/* Mahamri Section */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 flex items-center gap-8 lg:gap-12 justify-end">
               <div className="space-y-4 max-w-[180px] text-right">
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Breakfast Staple</p>
                 <h4 className="font-serif font-bold text-stone-900 text-xl leading-tight">Puffy Mahamri</h4>
                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider leading-relaxed">Cardamom-infused dough made with fresh coconut milk for a light, airy finish.</p>
               </div>
               <motion.div {...fadeInUp} className="relative z-10 rounded-[2.5rem] overflow-hidden aspect-square w-full max-w-[280px] border-[8px] border-white shadow-2xl group shrink-0">
                 <img src="/mahamri.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Mahamri" />
               </motion.div>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-orange-500 font-serif italic text-2xl block">Signature Softness</span>
              <h2 className="text-3xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">The Soul of the Coast</h2>
              <p className="text-stone-500 leading-relaxed text-lg font-medium">
                No coastal meal is complete without our Mahamri. Iconic hollow centers and aromatic cardamom scent. KES 80.
              </p>
              <button className="bg-orange-500 hover:bg-stone-900 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transition-all w-full lg:w-auto">
                Order Mahamri
              </button>
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="px-6 lg:px-12 py-20 bg-stone-50/50">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div {...fadeInUp}>
              <span className="text-orange-500 font-serif italic text-2xl block">Our Expertise</span>
              <h2 className="text-3xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">Authentic Taste Delivered Fresh</h2>
              <p className="text-stone-500 leading-relaxed text-lg font-medium max-w-2xl mx-auto">
                We bring the vibrant culinary culture of the Swahili coast to your doorstep. Our kitchen operates on tradition, using recipes passed down through generations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ENHANCED INTERACTIVE GALLERY */}
        <section id="menu" className="px-6 lg:px-12 py-20">
          <div className="flex justify-between items-end mb-12 border-b border-stone-100 pb-8">
            <h2 className="text-5xl font-serif font-bold text-stone-900">Food Gallery</h2>
          </div>
          <div id="foods" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              { img: "samosa1.jpg", title: "Crispy Samosas", price: "KES 120" },
              { img: "naan.jpg", title: "Fresh Chapati", price: "KES 50" },
              { img: "aro.jpg", title: "Aromatic Mahamri", price: "KES 80" },
              { img: "", title: "Honey Kaimati", price: "KES 100" },
               
              
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -10 }} 
                className="group cursor-pointer relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white"
              >
                <div className="aspect-[4/5] relative">
                  <img 
                    src={item.img} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-8">
                    <div>
                      <p className="text-white font-serif font-bold text-2xl drop-shadow-lg">{item.title}</p>
                      <p className="text-orange-400 text-xl font-bold mt-2 drop-shadow-lg">{item.price}</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 w-full text-center transform hover:scale-105">
                      Quick Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-[#1A3C34] text-[#E8DCC4] pt-24 pb-12 px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 pb-16 border-b border-white/10">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-3xl font-serif font-bold">Swahili Coastal Crunch</h2>
              <div className="flex gap-6">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <Icon key={i} size={24} className="hover:text-orange-500 cursor-pointer transition-all" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-xs font-bold uppercase tracking-widest text-stone-400">
              <div className="space-y-4">
                <p className="text-orange-500">Quick Links</p>
                <p className="hover:text-white cursor-pointer" onClick={() => window.scrollTo(0,0)}>Home</p>
                <p className="hover:text-white cursor-pointer" onClick={() => scrollToSection('services')}>Services</p>
              </div>
              <div className="space-y-4">
                <p className="text-orange-500">Connect</p>
                <p className="lowercase flex items-center gap-2"><Mail size={14}/> hello@coastalcrunch.com</p>
                <p className="flex items-center gap-2"><Phone size={14}/> +254 700 123 456</p>
              </div>
            </div>
          </div>
          <div className="pt-10 text-[10px] text-stone-500 font-bold uppercase tracking-[0.4em] text-center">
            © 2026 SWAHILI COASTAL CRUNCH. ALL RIGHTS RESERVED. • Nairobi Delivery
          </div>
        </footer>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center gap-10">
              <button className="absolute top-10 right-10" onClick={() => setIsMenuOpen(false)}><X size={40} /></button>
              {['Home', 'Services', 'Menu', 'Foods', 'Contact'].map((item) => (
                <button key={item} onClick={() => { item === 'Home' ? window.scrollTo(0,0) : scrollToSection(item.toLowerCase()); setIsMenuOpen(false); }} className="text-4xl font-serif font-bold">{item}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
