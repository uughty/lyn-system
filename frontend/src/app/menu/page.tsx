'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, ArrowRight, Search, Minus, Plus, 
  CheckCircle2, Clock, Star, MapPin, Trash2, 
  CreditCard, User, Phone, Bike, Navigation, 
  ShieldCheck, AlertCircle, Package, Map, Flame, Zap
} from 'lucide-react';

interface Product {
  id: number;
  category: string;
  type: string;
  name: string;
  basePrice: number;
  description: string;
  image: string;
  prepTime: string;
  rating: number;
}

interface CartItem extends Product {
  cartId: string;
  finalPrice: number;
  quantity: number;
  quality: string;
}

interface MenuItem {
  id: number;
  category: string;
  type: string;
  name: string;
  basePrice: number;
  description: string;
  image: string;
  prepTime: string;
  rating: number;
}


// --- CONFIGURATION ---
const QUALITIES = [
  { label: "Authentic", multiplier: 1.0, description: "Our traditional heritage recipe." },
  { label: "Signature", multiplier: 1.25, description: "Enhanced with premium coastal spices." },
  { label: "Grand Reserve", multiplier: 1.5, description: "Hand-selected ingredients & artisanal pairing." }
];

const ALL_PRODUCTS = [
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
    prepTime: "15 mins",
    rating: 4.9
  },
  { 
    id: 1, 
    category: "Samosa", 
    type: "Savory",
    name: "Aromatic Prime Beef Samosa", 
    basePrice: 8.00, 
    description: "Aromatic prime beef samosas are a savory, crispy, and highly spiced snack, often associated with Kenyan, Yemeni, and Saudi Arabian cuisine, featuring a golden exterior and a tender, flavor-packed filling. They are frequently prepared with lean ground beef, a mix of warm spices, fresh herbs, and sometimes vegetables, providing a flavorful experience. ",
    image: "beef.jpg", 
    prepTime: "15 mins",
    rating: 4.9
  },
  { 
    id: 1, 
    category: "Samosa", 
    type: "Savory",
    name: "Paneer Samosa", 
    basePrice: 4.50, 
    description: "A popular, modern variation of the traditional Indian fried snack, featuring a crispy, flaky pastry filled with savory, spiced crumbled or cubed cottage cheese (paneer).",
    
    image: "paneer.jpg", 
    prepTime: "15 mins",
    
    rating: 4.9
  },
  { 
    id: 1, 
    category: "Samosa", 
    type: "Savory",
    name: "Onion Samosa", 
    basePrice: 4.50, 
    description: "A popular South Indian street food snack, particularly known for their crispy, thin pastry filled with a spiced, caramelized onion mixture",
    image: "onion.webp", 
    prepTime: "15 mins",
    rating: 4.9
  },
  { 
    id: 1, 
    category: "Samosa", 
    type: "Savory",
    name: "Cheese Samosa", 
    basePrice: 4.50, 
    description: "a popular Middle Eastern and South Asian appetizer consisting of a crispy, fried or baked wrapper filled with molten, gooey cheese. ",
    image: "cheese.jpg", 
    prepTime: "15 mins",
    rating: 4.9
  },
  { 
    id: 2, 
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
    id: 3, 
    category: "Kaimati", 
    type: "Sweet",
    name: "Golden Syrup Kaimati", 
    basePrice: 5.50, 
    description: "Petite, crispy dumplings deep-fried to a sunset amber, then glazed in a warm, citrus-infused sugar reduction.",
    image: "https://images.unsplash.com/photo-1590004953392-5aba2e785943?q=80&w=800", 
    prepTime: "20 mins",
    rating: 5.0
  },
  { 
    id: 4, 
    category: "Chapati", 
    type: "Flatbread",
    name: "Multi-Layered Silk Chapati", 
    basePrice: 2.50, 
    description: "Exquisitely soft flatbread featuring dozens of paper-thin, buttery layers achieved through a specialized rolling technique.",
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800", 
    prepTime: "10 mins",
    rating: 4.6
  }
];

const BrandLogo = ({ isLight = false }) => (
  <div className="flex items-center gap-4 group">
    <div className="relative">
      {/* Decorative pulse for premium feel */}
      <div className={`absolute -inset-1 rounded-full blur-sm transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isLight ? 'bg-white/20' : 'bg-[#B99470]/20'}`}></div>
      
      {/* The Logo Image Container */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B99470] transition-all duration-500 bg-white shadow-lg">
        <img 
          src="/logo1.png" 
          alt="Swahili Coastal Crunch Logo" 
          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
        />
      </div>
    </div>

    <div className="flex flex-col text-left">
      <h1 className={`text-[16px] font-black tracking-tighter uppercase leading-none ${isLight ? 'text-white' : '!text-black'}`}>
        Swahili Coastal
      </h1>
      <span className="text-[12px] font-bold tracking-[0.3em] uppercase text-[#B99470]">
        Crunch.
      </span>
    </div>
  </div>
);

const CATEGORIES = [
  { name: "Samosa", tag: "The Gold Standard", image: "https://images.unsplash.com/photo-1601050690597-df056fb1ce24?q=80&w=800" },
  { name: "Mahamri", tag: "Morning Cloud", image: "https://images.unsplash.com/photo-1541592391523-5ae8c2c88d10?q=80&w=800" },
  { name: "Kaimati", tag: "Jewel of the Coast", image: "https://images.unsplash.com/photo-1590004953392-5aba2e785943?q=80&w=800" },
  { name: "Chapati", tag: "Silk & Ghee", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800" }
];

export default function App() {
  const [view, setView] = useState<'home' | 'products' | 'detail' | 'checkout' | 'tracking'>('home');

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string>('All');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(QUALITIES[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Checkout & Tracker State
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | ''>('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const [trackStep, setTrackStep] = useState<number>(0);

const handleAddToCart = () => {
  if (!selectedProduct) return;

  setCart((prev: CartItem[]) => [
    ...prev,
    {
      cartId: Math.random().toString(36).slice(2, 11),
      ...selectedProduct,
      finalPrice: selectedProduct.basePrice * selectedQuality.multiplier,
      quantity,
      quality: selectedQuality.label
    }
  ]);

  setView('checkout');
};







  const isFormComplete = useMemo(() => {
    const basicInfo = deliveryInfo.name && deliveryInfo.phone && deliveryInfo.address;
    if (paymentMethod === 'card') {
      return basicInfo && cardDetails.number && cardDetails.expiry && cardDetails.cvc;
    }
    return basicInfo && paymentMethod === 'cash';
  }, [deliveryInfo, paymentMethod, cardDetails]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Navigation */}
     <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex justify-between items-center ${view === 'home' ? 'bg-transparent' : 'bg-white/95 backdrop-blur-xl border-b border-stone-100'}`}>
        <div className="cursor-pointer" onClick={() => setView('home')}>
          <BrandLogo isLight={view === 'home'} />
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-8">
            <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.2em]">
     <button
  onClick={() => setView('home')}
  className="text-[10px] md:text-[11px] font-bold text-black hover:text-[#B99470] transition-colors"
>
  Home
</button>

<button
  onClick={() => setView('products')}
  className="text-[10px] md:text-[11px] font-bold text-black hover:text-[#B99470] transition-colors"
>
  Menu
</button>


            </div>
            <div className="relative cursor-pointer group p-1 text-inherit" onClick={() => setView('checkout')}>
              <ShoppingCart size={18} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#FFA500] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#B27A3C] drop-shadow-sm">
  Est. 1994
</span>

        </div>
      </nav>

      <main>
        {/* --- HERO --- */}
        {view === 'home' && (
          <div className="relative h-screen w-full flex flex-col md:flex-row bg-[#1a1a1a] overflow-hidden">
            <div className="relative w-full md:w-3/5 h-full flex flex-col justify-center px-10 md:px-24 z-20 pt-20 md:pt-0">
               <div className="space-y-6 max-w-lg">
                  <div className="flex items-center gap-4 text-left">
                    <span className="w-8 h-px bg-[#B99470]"></span>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#B99470]">Since 1994</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] text-left">
                    Timeless Taste. <br/> <span className="italic text-[#B99470]">Coastal Heritage.</span>
                  </h1>
                  <p className="text-white/40 text-[11px] font-medium leading-loose tracking-wide text-left">
                    Authentic Swahili snacks prepared with three decades of culinary mastery. Hand-folded and delivered fresh.
                  </p>
                  <div className="pt-4 text-left">
                    
                  </div>
               </div>
            </div>
            <div className="relative w-full md:w-2/5 h-full">
               <img src="/chef.avif" className="w-full h-full object-cover" alt="Hero" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10" />
            </div>
          </div>
        )}

        {/* --- HOME SPECIALTIES --- */}
        {view === 'home' && (
          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-20 items-center">
                <div className="w-full md:w-1/2 space-y-12">
                   <div className="space-y-2 text-left">
                      <p className="text-[15px] font-black uppercase tracking-[0.4em] text-black">Curated Selection</p>
                      <h2 className="text-3xl font-serif italic !text-black">Our Specialties</h2>
                    </div>
                   <div className="grid grid-cols-1 gap-10 text-left">
  {CATEGORIES.map(cat => (
    <div 
      key={cat.name} 
      className="group border-b border-stone-100 pb-8 cursor-pointer flex justify-between items-end hover:border-[#B99470] transition-colors"
      onClick={() => { setActiveCategory(cat.name); setView('products'); }}
    >
      <div className="text-left">
        <span className="text-[8px] font-black uppercase tracking-widest block mb-1 !text-black">
          {cat.tag}
        </span>
        <h3 className="text-2xl font-serif !text-black">
          {cat.name}
        </h3>
      </div>
      <ArrowRight 
        className="!text-black group-hover:text-[#B99470] group-hover:translate-x-2 transition-all" 
        size={20} 
      />
    </div>
  ))}
</div>

                </div>
                <div className="w-full md:w-1/3 text-left">
                    <div className="p-12 bg-stone-50 rounded-[2.5rem] space-y-6">
                       <img src="/naan.jpg" className="w-20 h-20 object-cover rounded-2xl mb-4" alt="Thumb" />
                       <h4 className="text-sm font-black uppercase tracking-widest !text-black">Handmade Daily</h4>
                       <p className="text-xs text-stone-500 leading-relaxed font-medium">Every piece is hand-crafted following heritage methods. Fresh colors, bold flavors.</p>
                    </div>
                </div>
            </div>
          </section>
        )}

        {/* --- MENU --- */}
       {view === 'products' && (
  <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-left">
    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
      <div>
        <h2 className="text-6xl font-serif italic mb-2 !text-black">The Collection</h2>
        <span className="text-[15px] font-black uppercase !text-caramel-gold
 tracking-widest">
          Vibrant Coastal Flavors
        </span>
      </div>

      <div className="w-full md:w-80 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 !text-black" />
        <input
          type="text"
          placeholder="Search the kitchen..."
          className="w-full bg-stone-50 border border-stone-100 rounded-full py-4 pl-12 pr-6 text-[20px] outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    {/* ✅ GRID START */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {ALL_PRODUCTS
        .filter((product: Product) => !activeCategory || product.category === activeCategory)
        .filter((product: Product) => activeType === 'All' || product.type === activeType)
        .filter((product: Product) =>
          !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((product: Product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedProduct(product);
              setView('detail');
            }}
          >
            <div className="aspect-[16/11] rounded-[2rem] overflow-hidden mb-6 shadow-sm relative">
              <img
                src={product.image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                {product.type}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-serif mb-1 group-hover:!text-black transition-colors">
                  {product.name}
                </h4>
                <div className="flex gap-3 text-[8px] font-black uppercase text-stone-300 tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {product.prepTime}
                  </span>
                  <span className="flex items-center gap-1 text-[#B99470]">
                    <Star size={10} className="fill-[#B99470]" /> {product.rating}
                  </span>
                </div>
              </div>
              <p className="text-sm font-black">
                £{product.basePrice.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
    </div>
    {/* ✅ GRID END */}
  </div>
)}



        {/* --- DETAIL --- */}
        {view === 'detail' && selectedProduct && (
          <div className="pt-32 pb-24 max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 text-left">
             <div className="w-full md:w-1/2">
                <img src={selectedProduct.image} className="w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl" />
             </div>
             <div className="flex-1 space-y-8 text-left">
                <h2 className="text-4xl font-serif italic">{selectedProduct.name}</h2>
                <p className="text-[12px] text-stone-700 font-medium leading-loose italic">"{selectedProduct.description}"</p>
                <div className="space-y-4">
                  <span className="text-[8px] font-black uppercase text-stone-400">Select Quality</span>
                  <div className="grid grid-cols-1 gap-2">
                    {QUALITIES.map(q => (
                      <button key={q.label} onClick={() => setSelectedQuality(q)} className={`p-4 rounded-xl border text-left ${selectedQuality.label === q.label ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100'}`}>
                        <p className="text-[10px] font-black uppercase">{q.label}</p>
                        <p className="text-[8px] text-stone-400">{q.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleAddToCart} className="w-full py-5 bg-[#B99470] text-white rounded-xl font-black uppercase text-[10px]">
                  Add selection • £{(selectedProduct.basePrice * selectedQuality.multiplier * quantity).toFixed(2)}
                </button>
             </div>
          </div>
        )}

        {/* --- CHECKOUT --- */}
        {view === 'checkout' && (
          <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 text-left">
            <div className="flex-1 space-y-12">
               {/* Delivery Form */}
               <section>
                  <h2 className="text-2xl font-serif italic mb-6">Delivery Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-xl py-4 pl-12 text-[11px]" placeholder="Full Name" value={deliveryInfo.name} onChange={e => setDeliveryInfo({...deliveryInfo, name: e.target.value})} />
                     </div>
                     <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-xl py-4 pl-12 text-[11px]" placeholder="Phone Number" value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} />
                     </div>
                     <div className="md:col-span-2 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
                        <input className="w-full bg-stone-50 border border-stone-100 rounded-xl py-4 pl-12 text-[11px]" placeholder="Delivery Address (Street, House No)" value={deliveryInfo.address} onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})} />
                     </div>
                  </div>
               </section>

               {/* Payment Method */}
               <section>
                  <h2 className="text-2xl font-serif italic mb-6">Payment Selection</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <button onClick={() => setPaymentMethod('card')} className={`flex items-center gap-3 p-5 rounded-xl border ${paymentMethod === 'card' ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100'}`}>
                        <CreditCard size={18} className={paymentMethod === 'card' ? 'text-[#B99470]' : 'text-stone-300'} />
                        <span className="text-[10px] font-black uppercase">Secure Card</span>
                     </button>
                     <button onClick={() => setPaymentMethod('cash')} className={`flex items-center gap-3 p-5 rounded-xl border ${paymentMethod === 'cash' ? 'border-[#B99470] bg-[#B99470]/5' : 'border-stone-100'}`}>
                        <Bike size={18} className={paymentMethod === 'cash' ? 'text-[#B99470]' : 'text-stone-300'} />
                        <span className="text-[10px] font-black uppercase">Cash on Delivery</span>
                     </button>
                  </div>

                  {paymentMethod === 'card' && (
                     <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-4 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-stone-400">Card Number</label>
                           <input className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-[11px]" placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-stone-400">Expiry</label>
                              <input className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-[11px]" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-stone-400">CVC</label>
                              <input className="w-full bg-white border border-stone-200 rounded-lg py-3 px-4 text-[11px]" placeholder="123" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} />
                           </div>
                        </div>
                     </div>
                  )}
               </section>
            </div>
            
            <div className="w-full lg:w-[380px]">
               <div className="bg-[#1a1a1a] text-white p-10 rounded-[3rem] shadow-2xl sticky top-32">
                  <h3 className="text-xl font-serif italic mb-8">Summary</h3>
                  <div className="space-y-4 pb-8 border-b border-white/5 mb-8 text-[10px] font-black uppercase tracking-widest">
                     <div className="flex justify-between"><span>Subtotal</span><span>£{cartTotal.toFixed(2)}</span></div>
                     <div className="flex justify-between"><span>Delivery</span><span>£3.50</span></div>
                     <div className="flex justify-between text-2xl font-serif pt-4 text-white"><span>Total</span><span>£{(cartTotal + 3.5).toFixed(2)}</span></div>
                  </div>
                  
                  {!isFormComplete && (
                    <p className="text-[#B99470] text-[9px] font-black uppercase mb-4 flex items-center gap-2 italic">
                      <AlertCircle size={12} /> Please fill location & payment info
                    </p>
                  )}

                  <button 
                     disabled={!isFormComplete}
                     onClick={() => setView('tracking')} 
                     className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 transition-all ${isFormComplete ? 'bg-[#B99470] hover:bg-white hover:text-black cursor-pointer' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                  >
                     {paymentMethod === 'cash' ? <Bike size={16} /> : <ShieldCheck size={16} />}
                     {paymentMethod === 'cash' ? 'Request Rider' : 'Pay & Order'}
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* --- TRACKER --- */}
        {view === 'tracking' && (
           <div className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center space-y-12">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-3 bg-[#B99470]/10 text-[#B99470] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <Bike size={14} /> Rider is on the way
                 </div>
                 <h2 className="text-4xl font-serif italic">Track your treasures</h2>
                 <p className="text-xs text-stone-500 max-w-sm mx-auto">Delivering artisanal coastal crunch to <span className="text-black font-bold">{deliveryInfo.address}</span>.</p>
              </div>

              <div className="relative">
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-100 -translate-x-1/2 z-0" />
                 <div className="space-y-12 relative z-10">
                    {[
                       { Icon: Package, label: "Order Confirmed", desc: "Kitchen is preparing your selection" },
                       { Icon: Flame, label: "Cooked to Perfection", desc: "Fresh out of the heat" },
                       { Icon: Bike, label: "In Transit", desc: "Our rider is navigating to you" },
                       { Icon: MapPin, label: "Almost There", desc: "Arriving in 2-5 minutes" }
                    ].map((step, idx) => (
                       <div key={idx} className={`flex items-center gap-8 transition-all duration-1000 ${idx <= trackStep ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-4'}`}>
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${idx <= trackStep ? 'bg-[#B99470] text-white shadow-lg shadow-[#B99470]/30' : 'bg-stone-100 text-stone-300'}`}>
                             <step.Icon size={20} />
                          </div>
                          <div className="text-left flex-1">
                             <h4 className="text-[11px] font-black uppercase tracking-widest">{step.label}</h4>
                             <p className="text-[10px] text-stone-400">{step.desc}</p>
                          </div>
                          {idx === trackStep && <span className="w-2 h-2 bg-[#B99470] rounded-full animate-ping" />}
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-stone-50 rounded-[2.5rem] flex items-center justify-between border border-stone-100">
                 <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-stone-200"><User size={20} /></div>
                    <div className="text-left">
                       <p className="text-[8px] font-black text-stone-300 uppercase">Your Rider</p>
                       <p className="text-[11px] font-bold">Salim Omar</p>
                    </div>
                 </div>
                 <button className="text-[9px] font-black uppercase text-[#B99470] bg-white px-6 py-3 rounded-full shadow-sm">Contact Rider</button>
              </div>

              <button onClick={() => { setView('home'); setCart([]); }} className="text-[9px] font-black uppercase tracking-widest text-stone-300 hover:text-black transition-colors">Return to Home</button>
           </div>
        )}
      </main>

      <footer className="bg-[#1A3C34] text-[#E8DCC4] pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-left">
           <div className="max-w-sm space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#B99470] rounded-full flex items-center justify-center text-white font-black text-xs">S</div>
                <div className="text-base font-black tracking-tighter uppercase text-white">SWAHILI COASTAL CRUNCH.</div>
              </div>
              <p className="text-[10px] leading-loose italic text-left">Crafting heritage snacks since 1994.</p>
           </div>
           <p className="text-[30px] font-black uppercase tracking-widest">Kansas💠City💠Missouri 
</p>
        </div>
      </footer>
    </div>
  );
}