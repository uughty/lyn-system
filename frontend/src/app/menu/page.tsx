'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp, FirebaseOptions } from 'firebase/app';  // Add FirebaseOptions here

import { DocumentSnapshot } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';



import { 
  getFirestore, collection, doc, setDoc, onSnapshot, 
  addDoc, serverTimestamp, updateDoc 
} from 'firebase/firestore';

import { User } from 'lucide-react'; 
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken, 
  type User as FirebaseUser  // ← Alias creates FirebaseUser type
} from 'firebase/auth';


import { 
  ShoppingCart, ArrowRight, Search, Minus, Plus, 
  CheckCircle2, Clock, Star, MapPin, Trash2, 
  CreditCard, 
  User as UserIcon,  // ← Rename to avoid collision
  Phone, Bike, Navigation, 
  ShieldCheck, AlertCircle, Package, Flame, Zap,
  Map as MapIcon, ChevronRight, MessageSquare,
  Home as HomeIcon, Coffee, Wallet, QrCode, Globe, X,
  ChevronDown, Info, Leaf, Heart, LayoutGrid, List,
  Download, Share2, LocateFixed, Layers
} from 'lucide-react';

type OrderStatus = 'received' | 'preparing' | 'in-transit' | 'delivered';

interface OrderData {
  status: 'received' | 'preparing' | 'in-transit' | 'delivered';
  // add other order fields you use
}



interface Product {
  id: number;
  category: string;
  dietary: string;
  name: string;
  basePrice: number;
  description: string;
  image: string;
  prepTime: string;
  rating: number;
  trending?: boolean;    // Optional boolean
  chefChoice?: boolean;  // Optional boolean
}

interface CartItem {
  cartId: string;
  image: string;        // ✅ ADD THIS
  name: string;         // ✅ ADD if missing
  finalPrice: number;
  quantity: number;
  quality?: string;
  spice?: string;
  dips?: Dip[];
  uid?: string;
  // ... other properties
}


interface Dip {
  name: string;
  price: number;
  label?: string;
  multiplier?: number;
  description?: string;
}

interface Quality {
  label: string;
  multiplier: number;
  description: string;
}



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
} as FirebaseOptions;





const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = process.env.NEXT_PUBLIC_APP_ID || 'swahili-coastal-crunch';

// --- CONFIGURATION ---
const QUALITIES = [
  { label: "Authentic", multiplier: 1.0, description: "Our traditional heritage recipe." },
  { label: "Signature", multiplier: 1.25, description: "Enhanced with premium coastal spices." },
  { label: "Grand Reserve", multiplier: 1.5, description: "Hand-selected ingredients & artisanal pairing." }
];

const DIPS = [
  { name: "Tangy Tamarind", price: 1.50 },
  { name: "Spicy Mint Chutney", price: 1.50 },
  { name: "Coastal Coconut Dip", price: 2.00 }
];

const ALL_PRODUCTS = [
  { 
    id: 1, 
    category: "Samosa", 
    dietary: "Veg",
    name: "Punjabi Samosa", 
    basePrice: 10.50, 
    description: "A Punjabi Aloo (Potato) Samosa with a thick, crunchy pastry shell stuffed with a savory mixture of potatoes and peas.",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb1ce24?q=80&w=800", 
    prepTime: "12 mins",
    rating: 4.9,
    trending: true
  },
  { 
    id: 2, 
    category: "Samosa", 
    dietary: "Meat",
    name: "Keema Samosa", 
    basePrice: 5.50, 
    description: "Crispy, triangular fried shell filled with spiced minced meat (beef, lamb, or chicken).",
    image: "https://images.unsplash.com/photo-1541592391523-5ae8c2c88d10?q=80&w=800", 
    prepTime: "15 mins",
    rating: 4.9,
    chefChoice: true
  },
  { 
    id: 3, 
    category: "Samosa", 
    dietary: "Meat",
    name: "Aromatic Prime Beef Samosa", 
    basePrice: 8.00, 
    description: "Savory and highly spiced snack associated with Kenyan and Yemeni coastal cuisine.",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800", 
    prepTime: "15 mins",
    rating: 4.9
  },
  { 
    id: 4, 
    category: "Mahamri", 
    dietary: "Vegan",
    name: "Artisanal Cardamom Mahamri", 
    basePrice: 3.00, 
    description: "Cloud-like pillows of leavened dough, fermented for 12 hours and scented with cardamom.",
    image: "https://images.unsplash.com/photo-1541592391523-5ae8c2c88d10?q=80&w=800", 
    prepTime: "10 mins",
    rating: 4.8
  },
  { 
    id: 5, 
    category: "Kaimati", 
    dietary: "Vegan",
    name: "Golden Syrup Kaimati", 
    basePrice: 5.50, 
    description: "Petite, crispy dumplings deep-fried to amber, glazed in citrus-infused sugar.",
    image: "https://images.unsplash.com/photo-1590004953392-5aba2e785943?q=80&w=800", 
    prepTime: "20 mins",
    rating: 5.0,
    trending: true
  }
];

const RIDERS = [
  {
    id: 'r1',
    name: 'Salim Omar',
    phone: '+1 816 555 9012',
    bikeNumber: 'KC-221',
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
    lat: 39.0850,
    lng: -94.6000,
    available: true
  }
];

const CATEGORIES = [
  { name: "Samosa", tag: "The Gold Standard" },
  { name: "Mahamri", tag: "Morning Cloud" },
  { name: "Kaimati", tag: "Jewel of the Coast" },
  { name: "Chapati", tag: "Silk & Ghee" }
];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};





const BrandLogo = ({ isLight = false }) => (
  <div className="flex items-center gap-4 group">
    <div className="relative">
      <div className={`absolute -inset-1 rounded-full blur-sm transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isLight ? 'bg-white/20' : 'bg-[#B99470]/20'}`}></div>
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B99470] transition-all duration-500 bg-white shadow-lg flex items-center justify-center">
        <span className="text-xl font-black text-[#B99470]">S</span>
      </div>
    </div>
    <div className="flex flex-col text-left">
      <h1 className={`text-[14px] font-black tracking-tighter uppercase leading-none ${isLight ? 'text-white' : 'text-black'}`}>
        Swahili Coastal
      </h1>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B99470]">
        Crunch.
      </span>
    </div>
  </div>
);


export default function App() {
  
  const [user, setUser] = useState<FirebaseUser | null>(null);  // ✅ FirebaseUser is the type
  const [paymentDone, setPaymentDone] = useState(false);

  const [view, setView] = useState('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dietaryFilter, setDietaryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<Quality>(QUALITIES[0]);
  const [selectedSpice, setSelectedSpice] = useState('Mild');
  const [selectedDips, setSelectedDips] = useState<Dip[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Forms
  const [deliveryInfo, setDeliveryInfo] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [cashAppTag, setCashAppTag] = useState('');
  const [zellePhone, setZellePhone] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  // Tracker & Persistence
  const [trackStep, setTrackStep] = useState(0);
  const [orderRider, setOrderRider] = useState(RIDERS[0]);
  const [timeLeft, setTimeLeft] = useState(240);
  const originPos = { lat: 39.0800, lng: -94.6100 };
  const customerPos = { lat: 39.1015, lng: -94.5795 };
  const [riderPos, setRiderPos] = useState(originPos);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  // Tracking Simulation Logic
  useEffect(() => {
  if (!activeOrderId) return;

  const TOTAL_TIME = 180; // 3 minutes in seconds
  setTimeLeft(TOTAL_TIME);
  setTrackStep(0);
  setRiderPos(originPos);

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      const newTime = prev - 1;

      // progress from 0 → 1
      const progress = (TOTAL_TIME - newTime) / TOTAL_TIME;

      // 🚀 Smooth rider movement
      const lat =
        originPos.lat +
        (customerPos.lat - originPos.lat) * progress;

      const lng =
        originPos.lng +
        (customerPos.lng - originPos.lng) * progress;

      setRiderPos({ lat, lng });

      // ✅ Sync tracking steps to progress
      if (progress >= 1) setTrackStep(3);
      else if (progress >= 0.66) setTrackStep(2);
      else if (progress >= 0.33) setTrackStep(1);
      else setTrackStep(0);

      if (newTime <= 0) {
        clearInterval(interval);
        return 0;
      }

      return newTime;
    });
  }, 1000); // every second

  return () => clearInterval(interval);
}, [activeOrderId]);


  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const dipsTotal = selectedDips.reduce((acc, d) => acc + (d.price ?? 0), 0);
    const newItem: CartItem = {
      cartId: Math.random().toString(36).slice(2, 11),
      ...selectedProduct,
      finalPrice: (selectedProduct.basePrice * (selectedQuality?.multiplier ?? 1)) + dipsTotal,
      quantity,
      quality: selectedQuality?.label ?? 'Standard',
      spice: selectedSpice,
      dips: selectedDips
    };
    setCart(prev => [...prev, newItem]);
    setQuantity(1);
    setSelectedQuality(QUALITIES[0]);
    setSelectedSpice('Mild');
    setSelectedDips([]);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.cartId !== id));
  };

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0),
    [cart]
  );

  const isFormComplete = useMemo(() => {
    const basic =
      deliveryInfo.name.trim().length > 1 &&
      deliveryInfo.phone.trim().length > 5 &&
      deliveryInfo.address.trim().length > 5;
    if (!basic) return false;

    const method = paymentMethod?.toLowerCase().trim();
    switch (method) {
      case 'card':
        return (
          cardDetails.number.replace(/\s/g, '').length >= 12 &&
          cardDetails.expiry.trim().length >= 4 &&
          cardDetails.cvc.trim().length >= 3
        );
      case 'cash_app':
        return cashAppTag.trim().length > 2;
      case 'zelle':
        return zellePhone.trim().length > 5;
      case 'paypal':
        return paypalEmail.includes('@');
      case 'cash':
        return true;
      default:
        return false;
    }
  }, [deliveryInfo, paymentMethod, cardDetails, cashAppTag, zellePhone, paypalEmail]);

  const canPay = isFormComplete && cart.length > 0 && !isProcessing;
  console.log({ isFormComplete, cartLength: cart.length, isProcessing, canPay });

  const handlePayment = async () => {
  if (!canPay) return;

  setIsProcessing(true);

  // Generate order ID for tracking
  const fakeOrderId = 'order_' + Date.now();
  setActiveOrderId(fakeOrderId);

  // Cash payments skip "real" processing
  if (paymentMethod === 'cash') {
    setView('tracking');   // show map immediately
    setPaymentDone(true);
    setTimeout(() => setPaymentDone(false), 2000);
    setIsProcessing(false);
    setCart([]);           // clear cart after confirming
    return;
  }

  // For real payments (card, PayPal, etc.)
  try {
    // Integrate payment gateway here, e.g., Stripe/PayPal SDK
    // const result = await processPayment(cardDetails, cartTotal);

    // For demo, simulate payment delay
    await new Promise(res => setTimeout(res, 2000));

    // Payment successful → show tracking map
    setPaymentDone(true);
    setView('tracking');
    setTimeout(() => setPaymentDone(false), 2000);
    setCart([]);  // clear cart after payment
  } catch (err) {
    console.error("Payment failed:", err);
    alert("Payment failed. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};


  const toggleDip = (dip: Dip) => {
    if (selectedDips.find(d => d.name === dip.name)) {
      setSelectedDips(prev => prev.filter(d => d.name !== dip.name));
    } else {
      setSelectedDips(prev => [...prev, dip]);
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans antialiased overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .pattern-grid {
          background-image: radial-gradient(#B99470 1.5px, transparent 1.5px);
          background-size: 40px 40px;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .gmap-bg { background-color: #f8f9fa; }
        .gmap-water { fill: #c4e1ff; }
        .gmap-park { fill: #e6f4ea; }
        .gmap-road-outer { stroke: #e0e0e0; stroke-width: 14; stroke-linecap: round; fill: none; }
        .gmap-road-inner { stroke: #ffffff; stroke-width: 10; stroke-linecap: round; fill: none; }
        .gmap-artery { stroke: #fdf2d0; stroke-width: 16; stroke-linecap: round; fill: none; }
        .gmap-artery-inner { stroke: #ffffff; stroke-width: 12; stroke-linecap: round; fill: none; }
        
        .pulse-marker {
          animation: marker-pulse 2s infinite;
        }
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex justify-between items-center ${view === 'home' ? 'bg-transparent' : 'bg-white/95 backdrop-blur-xl border-b border-stone-100'}`}>
        <div className="cursor-pointer" onClick={() => setView('home')}>
          <BrandLogo isLight={view === 'home'} />
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
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <>
          <div className="relative h-screen w-full flex flex-col md:flex-row bg-[#1a1a1a] overflow-hidden">
            <div className="relative w-full md:w-3/5 h-full flex flex-col justify-center px-10 md:px-24 z-20 pt-20 md:pt-0">
               <div className="space-y-6 max-w-lg text-left">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-px bg-[#B99470]"></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#B99470]">Since 1994</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1]">
                    Timeless Taste. <br/> <span className="italic text-[#B99470]">Coastal Heritage.</span>
                  </h1>
                  <p className="text-white/40 text-[11px] font-medium leading-loose tracking-wide">
                    Authentic Swahili snacks prepared with three decades of culinary mastery. Hand-folded and delivered fresh to your door.
                  </p>
                  <button onClick={() => setView('products')} className="px-8 py-4 bg-[#B99470] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all">Explore Menu</button>
               </div>
            </div>
            <div className="relative w-full md:w-2/5 h-full">
               <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200" className="w-full h-full object-cover grayscale-[0.5] opacity-60" alt="Hero" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-transparent to-transparent z-10" />
            </div>
          </div>
          <section className="py-32 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-20 items-center text-left">
                <div className="w-full md:w-1/2 space-y-12">
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
          </>
        )}

        {/* --- PRODUCTS VIEW --- */}
        {view === 'products' && (
          <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-left">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
              <div>
                <h2 className="text-6xl font-serif italic mb-2 text-black">The Kitchen</h2>
                <div className="flex gap-4 items-center">
                    <span className="text-[11px] font-black uppercase text-[#B99470] tracking-widest">Available for Fresh Delivery</span>
                    <div className="h-px w-20 bg-stone-100"></div>
                </div>
              </div>
              <div className="w-full md:w-80 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input 
                  type="text" 
                  placeholder="Search flavors..." 
                  className="w-full bg-stone-50 border border-stone-100 rounded-full py-4 pl-12 pr-6 text-[11px] outline-none focus:border-[#B99470] transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-12 items-center">
                {['All', 'Meat', 'Veg', 'Vegan'].map(filter => (
                    <button 
                        key={filter} 
                        onClick={() => setDietaryFilter(filter)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${dietaryFilter === filter ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400 hover:border-[#B99470]'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {ALL_PRODUCTS
                .filter(p => !activeCategory || p.category === activeCategory)
                .filter(p => dietaryFilter === 'All' || p.dietary === dietaryFilter)
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(product => (
                  <div key={product.id} className="group cursor-pointer relative" onClick={() => { setSelectedProduct(product); setView('detail'); }}>
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm relative">
                        {product.trending && (
                            <div className="absolute top-4 left-4 z-10 bg-[#B99470] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                <Zap size={8} fill="white" /> Trending
                            </div>
                        )}
                        {product.chefChoice && (
                            <div className="absolute top-4 left-4 z-10 bg-black text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                <Star size={8} fill="white" /> Chef's Pick
                            </div>
                        )}
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <Plus size={20} className="text-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-start px-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-serif group-hover:text-[#B99470] transition-colors">{product.name}</h4>
                            {product.dietary === 'Veg' && <Leaf size={12} className="text-green-500" />}
                            {product.dietary === 'Vegan' && <Leaf size={12} className="text-green-600" />}
                        </div>
                        <div className="flex gap-3 text-[8px] font-black uppercase text-stone-400 tracking-widest">
                          <span className="flex items-center gap-1"><Clock size={10} /> {product.prepTime}</span>
                          <span className="flex items-center gap-1 text-[#B99470]"><Star size={10} className="fill-[#B99470]" /> {product.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm font-black text-black">£{product.basePrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- DETAIL VIEW --- */}
        {view === 'detail' && selectedProduct && (
          <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 text-left">
             <div className="w-full md:w-1/2">
                <div className="relative group">
                    <img src={selectedProduct.image} className="w-full aspect-square object-cover rounded-[3rem] shadow-2xl" alt={selectedProduct.name} />
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-stone-50 rounded-full border-[10px] border-white p-6 hidden lg:flex items-center justify-center text-center shadow-xl">
                        <div>
                            <p className="text-[10px] font-black uppercase text-[#B99470]">Freshly</p>
                            <p className="text-lg font-serif italic">Prepared</p>
                        </div>
                    </div>
                </div>
             </div>
             <div className="flex-1 space-y-12">
                <div className="space-y-4">
                    <button onClick={() => setView('products')} className="text-[10px] font-black uppercase text-[#B99470] flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                        <ArrowRight className="rotate-180" size={12} /> Back to Kitchen
                    </button>
                    <div className="flex items-center gap-3">
                        <h2 className="text-5xl font-serif italic text-black leading-tight">{selectedProduct.name}</h2>
                    </div>
                    <p className="text-[14px] text-stone-500 font-medium leading-loose italic opacity-80">"{selectedProduct.description}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Spice Intensity</span>
                        <div className="flex gap-2">
                            {['Mild', 'Medium', 'Fiery'].map(s => (
                                <button key={s} onClick={() => setSelectedSpice(s)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedSpice === s ? 'bg-black text-white border-black' : 'border-stone-100 text-stone-400'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Quality Level</span>
                        <div className="relative">
                            <select 
                                value={selectedQuality.label} 
                                onChange={(e) => {
  const quality = QUALITIES.find(q => q.label === e.target.value);
  setSelectedQuality(quality ?? QUALITIES[0]);  // Fallback to first quality
}}

                                className="w-full bg-stone-50 border border-stone-100 rounded-xl py-3 px-4 text-[10px] font-black uppercase appearance-none"
                            >
                                {QUALITIES.map(q => <option key={q.label} value={q.label}>{q.label}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-stone-100">
                    <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Add a Signature Dip (+£1.50)</span>
                    <div className="flex flex-wrap gap-4">
                        {DIPS.map(dip => (
                            <button 
                                key={dip.name} 
                                onClick={() => toggleDip(dip)}
                                className={`flex items-center gap-3 p-3 px-4 rounded-2xl border transition-all ${selectedDips.find(d => d.name === dip.name) ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100 hover:border-stone-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedDips.find(d => d.name === dip.name) ? 'bg-[#B99470] border-[#B99470]' : 'border-stone-300'}`}>
                                    {selectedDips.find(d => d.name === dip.name) && <CheckCircle2 size={10} className="text-white" />}
                                </div>
                                <span className="text-[10px] font-black uppercase">{dip.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-10">
                    <div className="flex items-center bg-stone-50 rounded-2xl p-4 px-8 gap-10 border border-stone-100">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-stone-300 hover:text-black transition-colors"><Minus size={16} /></button>
                        <span className="text-base font-black w-4 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="text-stone-300 hover:text-black transition-colors"><Plus size={16} /></button>
                    </div>
                    <button onClick={handleAddToCart} className="flex-1 py-6 bg-[#B99470] text-white rounded-[1.5rem] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#B99470]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Add to Order
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* --- CHECKOUT VIEW --- */}
        {view === 'checkout' && (
          <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 text-left">
            <div className="flex-1 space-y-12">
               {cart.length > 0 ? (
                 <section>
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-3xl font-serif italic text-black">Your Selection</h2>
                        <button onClick={() => setCart([])} className="text-[9px] font-black uppercase text-stone-400 hover:text-red-500 tracking-widest transition-colors flex items-center gap-1">
                            <Trash2 size={12} /> Clear Basket
                        </button>
                    </div>
                    <div className="space-y-4">
                       {cart.map(item => (
                         <div key={item.cartId} className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem] border border-stone-100 group">
                            <div className="flex items-center gap-6">
                               <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" alt={item.name} />
                               <div>
                                  <h4 className="text-sm font-black uppercase tracking-tight">{item.name}</h4>
                                  <p className="text-[10px] text-stone-400 uppercase font-black">{item.quality} • {item.spice} • Qty: {item.quantity}</p>
                                {item.dips && item.dips.length > 0 && (
  <p>+ {item.dips.map(d => d.name).join(', ')}</p>
)}

                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <span className="text-sm font-black">£{(item.finalPrice * item.quantity).toFixed(2)}</span>
                               <button onClick={() => removeFromCart(item.cartId)} className="p-2 rounded-full hover:bg-red-50 text-stone-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><X size={16} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
               ) : (
                 <div className="p-20 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                        <ShoppingCart size={32} />
                    </div>
                    <p className="text-stone-400 font-serif italic text-xl mb-6">Your basket is waiting for treats...</p>
                    <button onClick={() => setView('products')} className="text-[10px] font-black uppercase tracking-widest text-[#B99470] flex items-center gap-2 mx-auto hover:gap-4 transition-all">Browse Menu <ArrowRight size={14}/></button>
                 </div>
               )}

               <section>
                  <h2 className="text-3xl font-serif italic mb-8 text-black">Delivery Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#B99470] transition-colors" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] outline-none focus:bg-white focus:ring-4 focus:ring-[#B99470]/5 focus:border-[#B99470] transition-all" placeholder="Full Name" value={deliveryInfo.name} onChange={e => setDeliveryInfo({...deliveryInfo, name: e.target.value})} />
                     </div>
                     <div className="relative group">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#B99470] transition-colors" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] outline-none focus:bg-white focus:ring-4 focus:ring-[#B99470]/5 focus:border-[#B99470] transition-all" placeholder="Phone Number" value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} />
                     </div>
                     <div className="md:col-span-2 relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#B99470] transition-colors" size={16} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 text-[12px] outline-none focus:bg-white focus:ring-4 focus:ring-[#B99470]/5 focus:border-[#B99470] transition-all" placeholder="Detailed Address (Apt, Street, Area)" value={deliveryInfo.address} onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})} />
                     </div>
                  </div>
               </section>

               <section>
                  <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-serif italic text-black">Payment Interface</h2>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#B99470]">Secure Encryption Enabled</p>
                    </div>
                  </div>
                  
                  <div className="bg-stone-50 p-3 rounded-[2.5rem] border border-stone-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
                     {[
                        { id: 'card', icon: CreditCard, label: 'Card' },
                        { id: 'paypal', icon: Globe, label: 'PayPal' },
                        { id: 'cash_app', icon: QrCode, label: 'CashApp' },
                        { id: 'zelle', icon: Zap, label: 'Zelle' },
                        { id: 'cash', icon: Wallet, label: 'Cash' }
                     ].map(method => (
                         <button 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)} 
                            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[1.8rem] transition-all ${paymentMethod === method.id ? 'bg-white text-[#B99470] shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                         >
                            <method.icon size={18} className={paymentMethod === method.id ? 'text-[#B99470]' : 'text-stone-300'} />
                            <span className="text-[9px] font-black uppercase tracking-tight">{method.label}</span>
                         </button>
                     ))}
                  </div>

                  <div className="relative min-h-[220px]">
                    {paymentMethod === 'card' && (
                        <div className="bg-[#1a1a1a] text-white p-10 rounded-[3rem] shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-[#B99470]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                           <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-[#B99470] tracking-[0.2em]">Credit / Debit</p>
                                    <h4 className="text-xl font-serif">Bank Details</h4>
                               </div>
                               <CreditCard className="text-white/20" size={32} />
                           </div>
                           <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[8px] font-black uppercase text-white/30 tracking-[0.3em]">Card Number</label>
                                  <input className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm tracking-widest placeholder:text-white/10 focus:border-[#B99470] transition-all outline-none" placeholder="•••• •••• •••• ••••" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                               </div>
                               <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black uppercase text-white/30 tracking-[0.3em]">Expiry</label>
                                     <input className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm placeholder:text-white/10 focus:border-[#B99470] transition-all outline-none" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black uppercase text-white/30 tracking-[0.3em]">CVC</label>
                                     <input className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm placeholder:text-white/10 focus:border-[#B99470] transition-all outline-none" placeholder="•••" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} />
                                  </div>
                               </div>
                           </div>
                        </div>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="bg-[#003087]/5 p-10 rounded-[3rem] border border-[#003087]/10 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                           <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-[#003087] rounded-2xl flex items-center justify-center text-white font-black italic text-xl">P</div>
                                <span className="text-xl font-bold text-[#003087]">PayPal</span>
                           </div>
                           <div className="w-full max-w-sm space-y-3">
                                <input 
                                    className="w-full bg-white border border-[#003087]/20 rounded-2xl py-5 px-6 text-center text-sm outline-none focus:ring-4 focus:ring-[#003087]/5" 
                                    placeholder="your-email@example.com"
                                    value={paypalEmail}
                                    onChange={e => setPaypalEmail(e.target.value)}
                                />
                                <p className="text-[10px] text-center text-stone-400 font-medium">You will be redirected to PayPal to verify your credentials.</p>
                           </div>
                        </div>
                    )}

                    {paymentMethod === 'cash_app' && (
                        <div className="bg-[#00D632]/5 p-10 rounded-[3rem] border border-[#00D632]/10 flex flex-col items-center justify-center space-y-6">
                           <div className="flex items-center gap-2 text-[#00D632]">
                                <QrCode size={32} />
                                <span className="text-xl font-black uppercase tracking-tighter">Cash App</span>
                           </div>
                           <div className="w-full max-w-sm space-y-3">
                                <input className="w-full bg-white border border-[#00D632]/20 rounded-2xl py-5 px-6 text-center text-xl font-black text-[#00D632] outline-none" placeholder="$cashtag" value={cashAppTag} onChange={e => setCashAppTag(e.target.value)} />
                           </div>
                        </div>
                    )}

                    {paymentMethod === 'zelle' && (
                        <div className="bg-[#6B1DA0]/5 p-10 rounded-[3rem] border border-[#6B1DA0]/10 flex flex-col items-center justify-center space-y-6">
                           <div className="flex items-center gap-2 text-[#6B1DA0]">
                                <div className="w-10 h-10 bg-[#6B1DA0] rounded-full flex items-center justify-center text-white text-lg font-black italic">Z</div>
                                <span className="text-xl font-black uppercase tracking-tighter">Zelle Pay</span>
                           </div>
                           <div className="w-full max-w-sm space-y-3">
                                <input className="w-full bg-white border border-[#6B1DA0]/20 rounded-2xl py-5 px-6 text-center text-sm outline-none" placeholder="Email or Mobile Number" value={zellePhone} onChange={e => setZellePhone(e.target.value)} />
                           </div>
                        </div>
                    )}

                    {paymentMethod === 'cash' && (
                        <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-200 border-dashed flex flex-col items-center justify-center space-y-4">
                           <Wallet size={40} className="text-stone-300" />
                           <div className="text-center">
                                <p className="text-sm font-serif italic text-black">Pay on Delivery</p>
                                <p className="text-[10px] text-stone-400 font-medium max-w-[200px] mt-2 leading-relaxed">Please ensure you have the exact amount ready for our rider Salim Omar.</p>
                           </div>
                        </div>
                    )}
                  </div>
               </section>
            </div>
            
            <div className="w-full lg:w-[420px]">
               <div className="bg-white p-10 rounded-[3.5rem] sticky top-32 shadow-2xl border border-stone-100">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl font-serif italic">Order Invoice</h3>
                    <Download size={18} className="text-stone-300 hover:text-[#B99470] cursor-pointer" />
                  </div>
                  <div className="space-y-6 mb-10 text-[11px] font-black uppercase tracking-widest">
                     <div className="flex justify-between text-stone-400"><span>Basket Sum</span><span>£{cartTotal.toFixed(2)}</span></div>
                     <div className="flex justify-between text-stone-400"><span>Express Courier</span><span>£3.50</span></div>
                     <div className="h-px bg-stone-50 w-full my-4"></div>
                     <div className="flex justify-between text-3xl font-serif pt-2 text-[#B99470]"><span>Total</span><span>£{(cartTotal + 3.5).toFixed(2)}</span></div>
                  </div>

                  
               <button
  disabled={!isFormComplete || cart.length === 0 || isProcessing}
  onClick={handlePayment}
  className={`w-full py-6 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.2em] transition-all relative overflow-hidden group ${
    isFormComplete && cart.length > 0 && !isProcessing
      ? 'bg-black text-white hover:scale-[1.03] active:scale-[0.98]'
      : 'bg-stone-100 text-stone-300 cursor-not-allowed'
  }`}
>
  {isProcessing ? 'Processing...' : 'Confirm & Pay'}
</button>

{paymentDone && (
  <p className="mt-4 text-green-600 font-black text-center">
    Payment successful! 🎉
  </p>
)}

                  
                  <div className="mt-8 p-6 bg-stone-50 rounded-[2rem] flex items-center gap-4">
                        <ShieldCheck className="text-[#B99470]" size={20} />
                        <div>
                            <p className="text-[9px] font-black uppercase text-black">Protected Checkout</p>
                            <p className="text-[8px] text-stone-400 font-medium">Your data is secured with real-time encryption.</p>
                        </div>
                  </div>
               </div>
            </div>
          </div>
        )}
{/* --- TRACKER VIEW --- */}
{view === 'tracking' && (
  <div className="pt-28 bg-[#FDFDFD] min-h-screen">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* --- LEFT SIDEBAR --- */}
      <div className="lg:col-span-4 space-y-6 pb-20 text-left">
        {/* Order Steps */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 text-[#B99470] mb-6">
            <div className="w-10 h-10 rounded-full bg-[#B99470]/10 flex items-center justify-center">
              <Navigation size={20} className="animate-pulse" />
            </div>
            <div className="flex items-center justify-between mb-6 w-full">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Order #{activeOrderId?.slice(0, 5) || '8192'}
                </h3>
              </div>
              <div>
                <p className="text-lg font-serif italic text-black">
                  Arrival in {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { icon: Package, label: "Order Received", desc: "Chef starting preparation" },
              { icon: Flame, label: "In the Oven", desc: "Golden crust forming" },
              { icon: Bike, label: "Out for Delivery", desc: "Heading your way" },
              { icon: CheckCircle2, label: "Delivered", desc: "Enjoy your snacks!" }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 transition-all duration-700 ${
                  idx <= trackStep ? 'opacity-100' : 'opacity-20'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx <= trackStep
                        ? 'bg-[#B99470] text-white shadow-lg'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <step.icon size={14} />
                  </div>
                  {idx < 3 && (
                    <div
                      className={`absolute top-8 left-1/2 -translate-x-1/2 w-px h-8 ${
                        idx < trackStep ? 'bg-[#B99470]' : 'bg-stone-100'
                      }`}
                    />
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-[11px] font-black uppercase tracking-tight text-black">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-stone-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rider Info */}
        <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src={orderRider.image}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#B99470]"
              alt="Rider"
            />
            <div>
              <p className="text-[10px] font-black uppercase text-[#B99470]">
                Your Coastal Rider
              </p>
              <p className="text-sm font-serif">{orderRider.name}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Bike size={12} /> {orderRider.bikeNumber}
            </div>
            <button className="text-[10px] font-black uppercase text-[#B99470] flex items-center gap-2 hover:text-white transition-colors">
              <MessageSquare size={14} /> Call Salim
            </button>
          </div>
        </div>
      </div>

      {/* --- MAP COLUMN --- */}
      <div className="lg:col-span-8 h-[600px] lg:mb-20 rounded-[3rem] overflow-hidden shadow-xl relative border-[1px] border-stone-200">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={customerPos}
            zoom={14}
          >
            {/* Customer */}
            <Marker
              position={customerPos}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: 'white'
              }}
            />

            {/* Rider */}
            <Marker
              position={riderPos}
              icon={{
                url: orderRider.image,
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p>Loading map...</p>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-stone-500 hover:text-black transition-colors border border-stone-100">
            <Layers size={18} />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#B99470] hover:text-[#B99470] transition-colors border border-stone-100">
            <LocateFixed size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </main>

      <footer className="bg-[#1a1a1a] text-white pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-left">
           <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#B99470] rounded-full flex items-center justify-center text-white font-black text-xs">S</div>
                <div className="text-base font-black tracking-tighter uppercase text-white">SWAHILI COASTAL CRUNCH.</div>
              </div>
              <p className="text-[10px] leading-loose italic text-white/40 max-w-xs">Heritage snacks, artisan flavors. Since 1994.</p>
           </div>
           <div className="flex gap-20">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B99470]">Links</h4>
                 <ul className="text-[10px] font-bold uppercase tracking-widest space-y-2 text-white/30">
                    <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Home</button></li>
                    <li><button onClick={() => setView('products')} className="hover:text-white transition-colors">Menu</button></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-[#B99470]">Support</h4>
                 <ul className="text-[10px] font-bold uppercase tracking-widest space-y-2 text-white/30">
                    <li>Live Track</li>
                    <li>Contact</li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto pt-24 border-t border-white/5 mt-24 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 text-center">
           © 1994-2024 Swahili Coastal Crunch. Artisanally Crafted.
        </div>
      </footer>
    </div>
  );
}