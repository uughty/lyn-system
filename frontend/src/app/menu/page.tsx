'use client';
import React, { useState, useEffect, useMemo } from 'react';

import { 
  ShoppingCart, ArrowRight, Search, Minus, Plus, 
  CheckCircle2, Clock, Star, MapPin, Trash2, 
  CreditCard, User, Phone, Bike, Navigation, 
  ShieldCheck, AlertCircle, Package, Flame, Zap,
  Map as MapIcon, ChevronRight, MessageSquare,
  Home as HomeIcon, Coffee
} from 'lucide-react';


type View = 'home' | 'products' | 'detail' | 'checkout' | 'tracking';
interface Product {
  id: number;
  name: string;
  basePrice: number;
}

interface ProductExtended extends Product {
  category: string;
  type: string;
  description: string;
  image: string;
  prepTime: string;
  rating: number;
}

interface Quality {
  label: string;
  multiplier: number;
  description: string;
}

interface CartItem extends Product {
  cartId: string;
  finalPrice: number;
  quantity: number;
  quality: string;
}
interface Rider {
  id: string;
  name: string;
  phone: string;
  lat: number;
  lng: number;
  available: boolean;
  image: string;
  bikeNumber: string;
}

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
}
interface BrandLogoProps {
  isLight?: boolean;
  logoSrc: string; // required and typed
}


// --- CONFIGURATION ---
const QUALITIES = [
  { label: "Authentic", multiplier: 1.0, description: "Our traditional heritage recipe." },
  { label: "Signature", multiplier: 1.25, description: "Enhanced with premium coastal spices." },
  { label: "Grand Reserve", multiplier: 1.5, description: "Hand-selected ingredients & artisanal pairing." }
];

const ALL_PRODUCTS: ProductExtended[] = [

  { 
    id: 1, 
    category: "Samosa", 
    type: "Savory",
    name: "Punjabi Samosa", 
    basePrice: 10.50, 
    description: "A Punjabi Aloo (Potato) Samosa is a beloved North Indian, deep-fried snack characterized by a thick, crunchy, and flaky pastry shell stuffed with a savory, spiced mixture of potatoes and peas.",
    image: "punjabi.jpg", 
    prepTime: "1 mins",
    rating: 4.9
  },
  { 
    id: 2, 
    category: "Samosa", 
    type: "Savory",
    name: "Keema Samosa", 
    basePrice: 5.50, 
    description: "a popular South Asian and Middle Eastern pastry, consisting of a crispy, triangular fried shell filled with spiced minced meat (beef, lamb, or chicken)",
    image: "keema.jpg", 
    prepTime: "30 mins",
    rating: 4.9
  },
  { 
    id: 3, 
    category: "Samosa", 
    type: "Savory",
    name: "Paneer Samosa", 
    basePrice: 8.00, 
    description: "a popular, modern variation of the traditional Indian fried snack, featuring a crispy, flaky pastry filled with savory, spiced crumbled or cubed cottage cheese (paneer).",
    image: "paneer.jpg", 
    prepTime: "16 mins",
    rating: 4.9
  },
  { 
    id: 4, 
    category: "Samosa", 
    type: "Savory",
    name: "Onion Samosa", 
    basePrice: 8.00, 
    description: " A popular Indian street food snack, particularly famous in Hyderabad, Mumbai, and Pune.",
    image: "onion.webp", 
    prepTime: "8 mins",
    rating: 4.9
  },

  { 
    id: 5, 
    category: "Samosa", 
    type: "Savory",
    name: "Beef Samosa", 
    basePrice: 8.00, 
    description: "a popular, savory, fried pastry filled with spiced minced meat, commonly enjoyed as a snack or appetizer in many cultures, particularly in Kenya, India, Pakistan, and the Middle East. They feature a crispy, golden-brown crust and are often served with chutneys or dipping sauces. ",
    image: "beefsam.jpg", 
    prepTime: "6 mins",
    rating: 4.9
  },
    { 
    id: 5, 
    category: "Samosa", 
    type: "Savory",
    name: "Cheese Samosa", 
    basePrice: 8.00, 
    description: "A popular, crispy, and indulgent appetizer featuring a gooey cheese filling inside a golden-fried pastry pocket. They are especially popular in the Middle East, particularly during Ramadan, but have become a loved snack worldwide.  ",
    image: "cheese.jpg", 
    prepTime: "3 mins",
    rating: 4.9
  },
  { 
    id: 4, 
    category: "Mahamri", 
    type: "Sweet",
    name: "Artisanal Cardamom Mahamri", 
    basePrice: 3.00, 
    description: "Cloud-like pillows of leavened dough, fermented for 12 hours and scented with freshly crushed cardamom pods.",
    image: "https://images.unsplash.com/photo-1541592391523-5ae8c2c88d10?q=80&w=800", 
    prepTime: "10 mins",
    rating: 4.8
  },
  { 
    id: 5, 
    category: "Kaimati", 
    type: "Sweet",
    name: "Golden Syrup Kaimati", 
    basePrice: 5.50, 
    description: "Petite, crispy dumplings deep-fried to a sunset amber, then glazed in a warm, citrus-infused sugar reduction.",
    image: "https://images.unsplash.com/photo-1590004953392-5aba2e785943?q=80&w=800", 
    prepTime: "20 mins",
    rating: 5.0
  }
];

const RIDERS: Rider[] = [
  {
    id: 'r1',
    name: 'Salim Omar',
    phone: '+1 816 555 9012',
    lat: 39.0997,
    lng: -94.5786,
    available: true,
    image: 'https://i.pravatar.cc/150?img=32',
    bikeNumber: 'KC-241'
  },
  {
    id: 'r2',
    name: 'Hassan Ali',
    phone: '+1 816 555 3321',
    lat: 39.1041,
    lng: -94.565,
    available: true,
    image: 'https://i.pravatar.cc/150?img=12',
    bikeNumber: 'KC-317'
  }
];


const CATEGORIES = [
  { name: "Samosa", tag: "The Gold Standard" },
  { name: "Mahamri", tag: "Morning Cloud" },
  { name: "Kaimati", tag: "Jewel of the Coast" },
  { name: "Chapati", tag: "Silk & Ghee" }
];

const BrandLogo: React.FC<BrandLogoProps> = ({ isLight = false, logoSrc }) => (
  <div className="flex items-center gap-4 group">
    <div className="relative">
      {/* Hover Glow */}
      <div
        className={`absolute -inset-1 rounded-full blur-sm transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
          isLight ? 'bg-white/20' : 'bg-[#B99470]/20'
        }`}
      ></div>

      {/* Logo Circle */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B99470] transition-all duration-500 bg-white shadow-lg flex items-center justify-center">
        <img 
          src={logoSrc} 
          alt="Brand Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>

    {/* Brand Text */}
    <div className="flex flex-col text-left">
      <h1
        className={`text-[14px] font-black tracking-tighter uppercase leading-none ${
          isLight ? 'text-white' : 'text-black'
        }`}
      >
        Swahili Coastal
      </h1>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B99470]">
        Crunch.
      </span>
    </div>
  </div>
);
export default function App() {
 const [view, setView] = useState<View>('home');

const [activeCategory, setActiveCategory] = useState<string | null>(null);

const [selectedProduct, setSelectedProduct] =
  useState<ProductExtended | null>(null);

const [selectedQuality, setSelectedQuality] =
  useState<Quality>(QUALITIES[0]);

const [quantity, setQuantity] = useState<number>(1);
const [cart, setCart] = useState<CartItem[]>([]);


const [searchQuery, setSearchQuery] = useState<string>('');

const [deliveryInfo, setDeliveryInfo] =
  useState<DeliveryInfo>({
    name: '',
    phone: '',
    address: ''
  });

const [paymentMethod, setPaymentMethod] =
  useState<'card' | 'cash' | ''>('');

const [cardDetails, setCardDetails] =
  useState<CardDetails>({
    number: '',
    expiry: '',
    cvc: ''
  });

const [trackStep, setTrackStep] = useState<number>(0);

const [orderRider, setOrderRider] = useState<Rider>(RIDERS[0]);


  
  // Real-time tracking state
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds
  const originPos = { lat: 39.0800, lng: -94.6100 };
  const customerPos = { lat: 39.1015, lng: -94.5795 };
  const [riderPos, setRiderPos] = useState(originPos);

  // Simulate Tracking Movement & Timer
  useEffect(() => {
    if (view === 'tracking') {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const moveRider = setInterval(() => {
        setRiderPos(prev => {
          const latDiff = customerPos.lat - prev.lat;
          const lngDiff = customerPos.lng - prev.lng;
          // Move 0.5% closer every 100ms for smooth fluid motion
          return {
            lat: prev.lat + latDiff * 0.005,
            lng: prev.lng + lngDiff * 0.005
          };
        });
      }, 100);

      // Update progress steps based on time
      const statusInterval = setInterval(() => {
        setTrackStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 60000); // Step every minute

      return () => {
        clearInterval(timer);
        clearInterval(moveRider);
        clearInterval(statusInterval);
      };
    }
  }, [view]);

 const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


 const handleAddToCart = () => {
  if (!selectedProduct) return;

  setCart(prev => [
    ...prev,
    {
      cartId: crypto.randomUUID(),
      ...selectedProduct,
      finalPrice:
        selectedProduct.basePrice *
        selectedQuality.multiplier,
      quantity,
      quality: selectedQuality.label
    }
  ]);

  setView('checkout');
};


  const isFormComplete = useMemo(() => {
    const basicInfo = deliveryInfo.name && deliveryInfo.phone && deliveryInfo.address;
    if (paymentMethod === 'card') return basicInfo && cardDetails.number && cardDetails.expiry && cardDetails.cvc;
    return basicInfo && paymentMethod === 'cash';
  }, [deliveryInfo, paymentMethod, cardDetails]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);
  

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .pattern-grid {
          background-image: radial-gradient(#B99470 0.5px, transparent 0.5px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex justify-between items-center ${view === 'home' ? 'bg-transparent' : 'bg-white/95 backdrop-blur-xl border-b border-stone-100'}`}>
        <div className="cursor-pointer" onClick={() => setView('home')}>
          <BrandLogo 
  isLight={view === 'home'} 
  logoSrc="/logo1.png" 
/>

        </div>
        <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
                <button onClick={() => setView('home')} className={`hover:text-[#B99470] ${view === 'home' ? 'text-[#B99470]' : 'text-inherit'}`}>Home</button>
                <button onClick={() => { setActiveCategory(null); setView('products'); }} className={`hover:text-[#B99470] ${view === 'products' ? 'text-[#B99470]' : 'text-inherit'}`}>Menu</button>
            </div>
            <div className="relative cursor-pointer group p-1" onClick={() => setView('checkout')}>
                <ShoppingCart size={18} className={view === 'home' ? 'text-white' : 'text-black'} />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#B99470] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}
            </div>
        </div>
      </nav>

      <main>
        {/* --- HERO (MAINTAINED) --- */}
        {view === 'home' && (
          <div className="relative h-screen w-full flex flex-col md:flex-row bg-[#1a1a1a] overflow-hidden">
            <div className="relative w-full md:w-3/5 h-full flex flex-col justify-center px-10 md:px-24 z-20 pt-20 md:pt-0">
               <div className="space-y-6 max-w-lg text-left">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-px bg-[#B99470]"></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#B99470]">Since 2026</span>
                  </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white !text-white leading-[1.1]">
  Timeless Taste. <br/>
  <span className="italic text-[#B99470]">Coastal Heritage.</span>
</h1>

                  <p className="text-white/40 text-[11px] font-medium leading-loose tracking-wide">
                    Authentic Swahili snacks prepared with three decades of culinary mastery. Hand-folded and delivered fresh to your door.
                  </p>
                  <button onClick={() => setView('products')} className="px-8 py-4 bg-[#B99470] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all">Explore Menu</button>
               </div>
            </div>
            <div className="relative w-full md:w-2/5 h-full">
               <img src="/chef.avif" className="w-full h-full object-cover grayscale-[0.5] opacity-60" alt="Hero" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-transparent to-transparent z-10" />
            </div>
          </div>
        )}

        {/* --- SPECIALTIES (MAINTAINED) --- */}
        {view === 'home' && (
          <section className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-20 items-center">
                <div className="w-full md:w-1/2 space-y-12 text-left">
                   <div className="space-y-2">
                      <p className="text-[15px] font-black uppercase tracking-[0.4em] text-[#B99470]">Curated Selection</p>
                      <h2 className="text-4xl font-serif italic text-black">Our Specialties</h2>
                    </div>
                   <div className="grid grid-cols-1 gap-8">
                      {CATEGORIES.map(cat => (
                        <div key={cat.name} className="group border-b border-stone-100 pb-8 cursor-pointer flex justify-between items-end hover:border-[#B99470] transition-colors"
                             onClick={() => { setActiveCategory(cat.name); setView('products'); }}>
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest block mb-1 text-stone-400">{cat.tag}</span>
                            <h3 className="text-2xl font-serif text-black">{cat.name}</h3>
                          </div>
                          <ArrowRight className="text-stone-300 group-hover:text-[#B99470] group-hover:translate-x-2 transition-all" size={20} />
                        </div>
                      ))}
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div className="p-12 bg-stone-50 rounded-[3rem] space-y-6 text-left border border-stone-100">
                       <div className="w-20 h-20 bg-[#B99470]/10 rounded-2xl flex items-center justify-center text-[#B99470] mb-4">
                          <Flame size={32} />
                       </div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-black">Handmade Daily</h4>
                       <p className="text-xs text-stone-500 leading-relaxed font-medium">Every piece is hand-crafted following heritage methods using stone-ground spices and organic flour.</p>
                    </div>
                </div>
            </div>
          </section>
        )}

        {/* --- MENU (MAINTAINED) --- */}
        {view === 'products' && (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-left">
    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
      
      {/* Title Block */}
      <div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif italic mb-3 text-stone-900 leading-tight">
          The Kitchen
        </h2>
        <span className="inline-block text-[11px] md:text-[12px] font-extrabold uppercase text-[#8B6A45] tracking-[0.25em]">
          Available for Fresh Delivery
        </span>
      </div>

      {/* Search */}
      <div className="w-full md:w-96 relative">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          type="text"
          placeholder="Search flavors, fillings, or classics…"
          className="
            w-full
            bg-white
            border border-stone-200
            rounded-full
            py-4
            pl-14
            pr-6
            text-[13px]
            font-medium
            text-stone-800
            placeholder:text-stone-400
            shadow-sm
            outline-none
            focus:border-[#B99470]
            focus:ring-2
            focus:ring-[#B99470]/20
            transition-all
          "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {ALL_PRODUCTS
                .filter(p => !activeCategory || p.category === activeCategory)
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(product => (
                  <div key={product.id} className="group cursor-pointer" onClick={() => { setSelectedProduct(product); setView('detail'); }}>
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-sm relative">
                      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-sm relative w-full max-w-[300px] mx-auto">
  <img 
    src={product.image} 
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
    alt={product.name} 
  />
</div>

                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[13px] font-black uppercase tracking-widest shadow-sm">
                           {product.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-serif text-stone-900 mb-1 group-hover:text-[#B99470] transition-colors duration-300">
  {product.name}
</h4>

                       <div className="flex gap-3 text-[13px] font-black uppercase tracking-widest text-[#B99470]/90">

            <span className="flex items-center gap-1 text-black">
  <Clock size={10} className="text-[#B99470]" /> {product.prepTime}
</span>
<span className="flex items-center gap-1 text-black">
  <Star size={10} className="text-[#B99470] fill-[#B99470]" /> {product.rating}
</span>
                        </div>
                      </div>
                      <p className="text-sm font-black text-black">£{product.basePrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- DETAIL (MAINTAINED) --- */}
        {view === 'detail' && selectedProduct && (
  <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 text-left">
    
    {/* --- Product Images with hover zoom --- */}
    <div className="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl group">

      <div className="relative w-full aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl group">
        <img 
          src={selectedProduct.image} 
          alt={selectedProduct.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        <span className="absolute top-4 left-4 bg-[#B99470] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
          Best Seller
        </span>
      </div>
      
    </div>

    {/* --- Product Info & Selection --- */}
    <div className="flex-1 flex flex-col justify-between space-y-8">
      
      {/* Product Title & Description */}
      <div className="space-y-4">
        <button 
          onClick={() => setView('products')} 
          className="text-[10px] font-black uppercase text-[#B99470] flex items-center gap-2 hover:text-[#FF9F1C] transition-colors"
        >
          <ArrowRight className="rotate-180" size={12} /> Back to Kitchen
        </button>

        <h2 className="text-5xl md:text-6xl font-serif italic text-black">{selectedProduct.name}</h2>

        <div className="flex items-center gap-4 text-[13px]">
          <span className="flex items-center gap-1 text-[#B99470] font-black uppercase">
            <Star size={12} className="fill-[#B99470]" /> {selectedProduct.rating} 
          </span>
          <span className="text-stone-400">{selectedProduct.prepTime} prep</span>
          <span className="bg-[#FF9F1C]/20 text-[#FF9F1C] px-2 py-0.5 rounded-full text-[10px] font-bold">Savory</span>
        </div>

        <p className="text-[13px] text-stone-500 font-medium leading-relaxed italic">"{selectedProduct.description}"</p>
      </div>

      {/* Preparation Quality Selector */}
      <div className="space-y-4">
  <span className="text-[13px] font-black uppercase text-[#FF9F1C] tracking-widest">Preparation Quality</span>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {QUALITIES.map(q => (
      <button 
        key={q.label} 
        onClick={() => setSelectedQuality(q)}
        className={`
          p-5 rounded-2xl border text-left transition-all
          hover:shadow-lg hover:border-[#FF9F1C]
          ${
            selectedQuality.label === q.label 
              ? 'border-[#FF9F1C] bg-[#FF9F1C]/10 shadow-md' 
              : 'border-stone-200 bg-white'
          }
        `}
      >
        <div className="flex justify-between items-center mb-1">
          <p className={`
            text-[13px] font-black uppercase tracking-tight
            ${selectedQuality.label === q.label ? 'text-[#FF9F1C]' : 'text-stone-900'}
          `}>
            {q.label}
          </p>
          {selectedQuality.label === q.label && 
            <CheckCircle2 size={16} className="!text-white" />}
        </div>

        <p className={`
          text-[13px] font-medium
          ${selectedQuality.label === q.label ? 'text-stone-800' : 'text-stone-500'}
        `}>
          {q.description}
        </p>
      </button>
    ))}
  </div>
</div>

   {/* Add Quantity + Add to Cart */}
<div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-6 border-t border-[#FFD8A6]">
  {/* Quantity Selector */}
  <div className="flex items-center bg-[#FF9F1C] rounded-xl p-2 px-4 gap-4 md:gap-6 shadow-sm">
    <button 
      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
      className="text-white hover:text-white active:scale-95 transition-transform p-1 rounded"
      aria-label="Decrease quantity"
    >
      <Minus size={18} />
    </button>

   <span className="text-2xl font-black w-6 text-center text-white">{quantity}</span>


    <button 
      onClick={() => setQuantity(quantity + 1)} 
      className="text-white hover:text-black active:scale-95 transition-transform p-1 rounded"
      aria-label="Increase quantity"
    >
      <Plus size={18} />
    </button>
  </div>

  {/* Add to Cart Button */}
  <button 
    onClick={handleAddToCart} 
    className="flex-1 py-4 md:py-5 bg-[#FF9F1C] text-black rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-lg hover:scale-105 hover:text-white transition-all"
  >
    Add Selection • £{(selectedProduct.basePrice * selectedQuality.multiplier * quantity).toFixed(2)}
  </button>
</div>

      {/* Optional Features: Ingredient/Allergen icons */}
      <div className="flex gap-4 mt-6">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#B99470] px-2 py-1 rounded-full border border-[#B99470]">
          🌱 Vegan
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#B99470] px-2 py-1 rounded-full border border-[#B99470]">
          🌾 Gluten-Free
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#B99470] px-2 py-1 rounded-full border border-[#B99470]">
          🌶️ Spicy
        </span>
      </div>

    </div>
  </div>
)}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 text-left">
            <div className="flex-1 space-y-12">
               <section>
                  <h2 className="text-3xl font-serif italic mb-8 text-black">Delivery Logistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] focus:bg-white focus:border-[#B99470] outline-none transition-all" placeholder="Full Name" value={deliveryInfo.name} onChange={e => setDeliveryInfo({...deliveryInfo, name: e.target.value})} />
                     </div>
                     <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] focus:bg-white focus:border-[#B99470] outline-none transition-all" placeholder="Phone Number" value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} />
                     </div>
                     <div className="md:col-span-2 relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] focus:bg-white focus:border-[#B99470] outline-none transition-all" placeholder="Street Address in Kansas City" value={deliveryInfo.address} onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})} />
                     </div>
                  </div>
               </section>

               <section>
                  <h2 className="text-3xl font-serif italic mb-8 text-black">Payment Selection</h2>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <button onClick={() => setPaymentMethod('card')} className={`flex items-center gap-4 p-6 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100 hover:border-stone-200'}`}>
                        <CreditCard size={20} className={paymentMethod === 'card' ? 'text-[#B99470]' : 'text-stone-300'} />
                        <span className="text-[11px] font-black uppercase tracking-tight">Secure Card</span>
                     </button>
                     <button onClick={() => setPaymentMethod('cash')} className={`flex items-center gap-4 p-6 rounded-2xl border transition-all ${paymentMethod === 'cash' ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100 hover:border-stone-200'}`}>
                        <Bike size={20} className={paymentMethod === 'cash' ? 'text-[#B99470]' : 'text-stone-300'} />
                        <span className="text-[11px] font-black uppercase tracking-tight">Cash on Delivery</span>
                     </button>
                  </div>

                  {paymentMethod === 'card' && (
                     <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Card Number</label>
                           <input className="w-full bg-white border border-stone-200 rounded-xl py-4 px-5 text-[12px]" placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Expiry</label>
                              <input className="w-full bg-white border border-stone-200 rounded-xl py-4 px-5 text-[12px]" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">CVC</label>
                              <input className="w-full bg-white border border-stone-200 rounded-xl py-4 px-5 text-[12px]" placeholder="123" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} />
                           </div>
                        </div>
                     </div>
                  )}
               </section>
            </div>
            
            <div className="w-full lg:w-[420px]">
               <div className="bg-[#1a1a1a] text-white p-12 rounded-[3.5rem] shadow-2xl sticky top-32">
                  <h3 className="text-2xl font-serif italic mb-8">Your Order</h3>
                  <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4">
                     {cart.map((item) => (
                        <div key={item.cartId} className="flex justify-between items-center text-[11px]">
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black">{item.quantity}</span>
                              <div>
                                 <p className="font-bold text-white">{item.name}</p>
                                 <p className="text-white/40 text-[9px] uppercase tracking-tighter">{item.quality}</p>
                              </div>
                           </div>
                           <span className="font-black">£{(item.finalPrice * item.quantity).toFixed(2)}</span>
                        </div>
                     ))}
                  </div>

                  <div className="space-y-4 pb-10 border-b border-white/5 mb-10 text-[11px] font-black uppercase tracking-widest">
                     <div className="flex justify-between text-white/40"><span>Subtotal</span><span>£{cartTotal.toFixed(2)}</span></div>
                     <div className="flex justify-between text-white/40"><span>Delivery Service</span><span>£3.50</span></div>
                     <div className="flex justify-between text-3xl font-serif pt-6 text-[#B99470]"><span>Total</span><span>£{(cartTotal + 3.5).toFixed(2)}</span></div>
                  </div>
                  
                  {!isFormComplete && (
                    <p className="text-[#B99470] text-[10px] font-black uppercase mb-6 flex items-center gap-2 italic">
                      <AlertCircle size={14} /> Please verify all delivery details
                    </p>
                  )}

                  <button 
                     disabled={!isFormComplete || cart.length === 0}
                     onClick={() => { setOrderRider(RIDERS[Math.floor(Math.random()*RIDERS.length)]); setView('tracking'); }} 
                     className={`w-full py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isFormComplete && cart.length > 0 ? 'bg-[#B99470] hover:bg-white hover:text-black shadow-lg shadow-[#B99470]/20' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                  >
                     {paymentMethod === 'cash' ? <Bike size={18} /> : <ShieldCheck size={18} />}
                     {paymentMethod === 'cash' ? 'Request Dispatch' : 'Complete Purchase'}
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- IMPROVED TRACKER (FOCUS AREA) --- */}
        {view === 'tracking' && (
          <div className="pt-28 bg-[#FDFDFD] min-h-screen">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Panel: Status & Timeline */}
                <div className="lg:col-span-4 space-y-6 pb-20">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm text-left">
                        <div className="flex items-center gap-3 text-[#B99470] mb-6">
                            <div className="w-10 h-10 rounded-full bg-[#B99470]/10 flex items-center justify-center">
                                <Navigation size={20} className="animate-spin-slow" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Tracking Live</h3>
                                <p className="text-lg font-serif italic text-black">Arrival in {formatTime(timeLeft)}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Package, label: "Order Received", desc: "Chef starting preparation" },
                                { icon: Flame, label: "In the Oven", desc: "Golden crust forming" },
                                { icon: Bike, label: "Out for Delivery", desc: "On the streets of KC" },
                                { icon: CheckCircle2, label: "Delivered", desc: "Enjoy your coastal snacks" }
                            ].map((step, idx) => (
                                <div key={idx} className={`flex items-start gap-4 transition-all duration-700 ${idx <= trackStep ? 'opacity-100' : 'opacity-20'}`}>
                                    <div className="relative">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= trackStep ? 'bg-[#B99470] text-white shadow-lg shadow-[#B99470]/30' : 'bg-stone-100 text-stone-400'}`}>
                                            <step.icon size={14} />
                                        </div>
                                        {idx < 3 && <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-px h-8 ${idx < trackStep ? 'bg-[#B99470]' : 'bg-stone-100'}`} />}
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-[11px] font-black uppercase tracking-tight text-black">{step.label}</p>
                                        <p className="text-[10px] text-stone-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm text-left">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-6">Dispatch Details</h4>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={orderRider.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-[#B99470]/20" alt="Rider" />
                            <div>
                                <p className="text-sm font-black text-black">{orderRider.name}</p>
                                <p className="text-[10px] text-[#B99470] font-bold">Rider • {orderRider.bikeNumber}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a href={`tel:${orderRider.phone}`} className="flex-1 py-4 bg-stone-900 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg">
                                <Phone size={14} className="text-[#B99470]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                            </a>
                            <button 
                              onClick={() => {
                                const msg = `Hi ${orderRider.name}, please let me know when you're near ${deliveryInfo.address}.`;
                                window.open(`sms:${orderRider.phone}?body=${encodeURIComponent(msg)}`);
                              }}
                              className="flex-1 py-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-100 transition-all active:scale-95"
                            >
                                <MessageSquare size={14} className="text-stone-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Text</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Enhanced Live Map Simulation */}
                <div className="lg:col-span-8 h-[600px] lg:h-auto lg:mb-20">
                    <div className="w-full h-full bg-[#f8f5f2] rounded-[3.5rem] relative overflow-hidden border-[12px] border-white shadow-2xl">
                        
                        {/* Map HUD */}
                        <div className="absolute top-8 left-8 z-10 space-y-3">
                            <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-[2rem] shadow-xl border border-stone-100 text-left">
                                <div className="flex items-center gap-3 mb-1">
                                    <Clock size={14} className="text-[#B99470]" />
                                    <p className="text-[10px] font-black uppercase text-[#B99470] tracking-[0.2em]">Estimated Arrival</p>
                                </div>
                                <p className="text-2xl font-serif italic text-black">{formatTime(timeLeft)}</p>
                                <p className="text-[9px] font-bold text-stone-400 mt-1">To: {deliveryInfo.address}</p>
                            </div>
                        </div>

                        {/* Map Grid Pattern */}
                        <div className="absolute inset-0 pattern-grid opacity-30" />
                        
                        {/* SVG Map Lines (Simulated Streets) */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000">
                             <path d="M0,200 L1000,200 M0,500 L1000,500 M0,800 L1000,800 M200,0 L200,1000 M500,0 L500,1000 M800,0 L800,1000" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                             
                             {/* The actual delivery route line */}
                             <path 
                                d={`M ${500 + (originPos.lng - customerPos.lng) * 5000} ${500 - (originPos.lat - customerPos.lat) * 5000} L 500 500`} 
                                stroke="#B99470" 
                                strokeWidth="3" 
                                strokeDasharray="10 10" 
                                fill="none" 
                                className="opacity-30"
                             />
                        </svg>

                        {/* Origin Point (The Kitchen) */}
                        <div 
                          className="absolute z-10 flex flex-col items-center"
                          style={{ 
                              left: `${50 + (originPos.lng - customerPos.lng) * 5000}%`,
                              top: `${50 - (originPos.lat - customerPos.lat) * 5000}%`
                          }}
                        >
                          <div className="bg-[#B99470]/10 text-[#B99470] px-3 py-1 rounded-full text-[8px] font-black mb-1 backdrop-blur shadow-sm">KITCHEN</div>
                          <div className="w-8 h-8 bg-white rounded-full border-2 border-[#B99470] flex items-center justify-center text-[#B99470] shadow-md">
                              <Coffee size={14} />
                          </div>
                        </div>

                        {/* Customer Point (Home) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                            <div className="bg-black text-white px-4 py-1.5 rounded-full text-[9px] font-black mb-2 shadow-2xl border border-white/20">YOU</div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-black/5 rounded-full animate-ping" />
                                <div className="w-12 h-12 bg-black rounded-full border-4 border-white flex items-center justify-center text-white shadow-2xl relative">
                                    <HomeIcon size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Rider Point (Live Moving) */}
                        <div 
                            className="absolute z-30 transition-all duration-[100ms] ease-linear flex flex-col items-center"
                            style={{ 
                                left: `${50 + (riderPos.lng - customerPos.lng) * 5000}%`,
                                top: `${50 - (riderPos.lat - customerPos.lat) * 5000}%`
                            }}
                        >
                            <div className="bg-white text-black px-4 py-2 rounded-2xl text-[10px] font-black mb-3 shadow-2xl border border-stone-100 flex items-center gap-2 whitespace-nowrap">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              RIDER EN ROUTE
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-2 bg-[#B99470]/20 rounded-full animate-pulse" />
                                <div className="w-14 h-14 bg-[#B99470] rounded-full border-4 border-white flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-transform">
                                    <Bike size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer (MAINTAINED) */}
      <footer className="bg-[#1A3C34] text-[#E8DCC4] pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-left">
           <div className="max-w-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#B99470] rounded-full flex items-center justify-center text-white font-black text-xs">S</div>
                <div className="text-base font-black tracking-tighter uppercase text-white">SWAHILI COASTAL CRUNCH.</div>
              </div>
              <p className="text-[10px] leading-loose italic text-white/40">Crafting heritage snacks since 1994. Delivered fresh across Kansas City.</p>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B99470] mb-4">Locations</p>
              <p className="text-xl font-serif italic">Kansas City, Missouri</p>
           </div>
        </div>
      </footer>
    </div>
  );
}