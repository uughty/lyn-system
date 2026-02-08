'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, X, Menu as MenuIcon, 
  ArrowRight, Search, Heart, ChevronRight, Minus, Plus, 
  Truck, CheckCircle2, ChevronLeft,
  ShieldCheck, Lock, Clock, Sparkles, CreditCard as CardIcon,
  Trash2, Filter, Info, Star, MapPin
} from 'lucide-react';

// --- INTERFACES ---
interface ProductQuality {
  label: string;
  multiplier: number;
  description: string;
}

interface Product {
  id: number;
  category: string;
  name: string;
  basePrice: number;
  description: string;
  ingredients: string[];
  image: string;
  badges: string[];
  prepTime: string;
}

interface CartItem {
  cartId: string;
  id: number;
  name: string;
  finalPrice: number;
  quantity: number;
  image: string;
  quality: string;
}

// --- CONFIGURATION ---
const QUALITIES: ProductQuality[] = [
  { label: "Standard", multiplier: 1.0, description: "Authentic coastal recipe." },
  { label: "Premium", multiplier: 1.25, description: "Extra filling & organic ingredients." },
  { label: "Executive", multiplier: 1.5, description: "Chef's special seasoning & gift packaging." }
];

const ALL_PRODUCTS: Product[] = [
  { 
    id: 1, 
    category: "Samosa", 
    name: "Classic Beef Samosa", 
    basePrice: 2.50, 
    description: "Golden, triangular pastries filled with premium spiced minced beef and aromatic spring onions.",
    ingredients: ["Minced Beef", "Spring Onions", "Cumin", "Ginger"],
    image: "https://images.unsplash.com/photo-1601050690597-df056fb1ce24?q=80&w=800", 
    badges: ["Best Seller", "Crunchy"],
    prepTime: "15 mins"
  },
  { 
    id: 5, 
    category: "Samosa", 
    name: "Vegetable Herb Samosa", 
    basePrice: 2.00, 
    description: "Crispy pastry pockets stuffed with spiced potatoes, peas, and fresh cilantro.",
    ingredients: ["Potatoes", "Green Peas", "Coriander", "Turmeric"],
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800", 
    badges: ["Vegan", "Herbal"],
    prepTime: "12 mins"
  },
  { 
    id: 2, 
    category: "Mahamri", 
    name: "Swahili Coconut Mahamri", 
    basePrice: 1.50, 
    description: "Traditional soft, leavened donuts flavored with coconut milk and cardamom.",
    ingredients: ["Coconut Milk", "Cardamom", "Fine Flour", "Sugar"],
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800", 
    badges: ["Traditional", "Breakfast"],
    prepTime: "10 mins"
  },
  { 
    id: 3, 
    category: "Kaimati", 
    name: "Honey-Glazed Kaimati", 
    basePrice: 4.00, 
    description: "Crunchy sweet dumplings, deep-fried and coated in a delicate sugar syrup.",
    ingredients: ["Flour", "Sugar Syrup", "Yeast", "Lemon"],
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800", 
    badges: ["Sweet", "Crunchy"],
    prepTime: "20 mins"
  },
  { 
    id: 4, 
    category: "Chapati", 
    name: "Flaky Layered Chapati", 
    basePrice: 1.00, 
    description: "East African style pan-grilled flatbread with soft, golden-brown layers.",
    ingredients: ["Wheat Flour", "Vegetable Oil", "Salt"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800", 
    badges: ["Soft", "Hand-made"],
    prepTime: "10 mins"
  }
];

const CATEGORIES = [
  { name: "Samosa", image: "https://images.unsplash.com/photo-1601050690597-df056fb1ce24?q=80&w=800" },
  { name: "Mahamri", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800" },
  { name: "Kaimati", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800" },
  { name: "Chapati", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800" }
];

export default function App() {
  const [view, setView] = useState<'home' | 'categories' | 'products' | 'detail' | 'checkout' | 'success'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuality, setSelectedQuality] = useState(QUALITIES[0]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    address: '',
    card: '',
    expiry: '',
    cvc: ''
  });
  const [formError, setFormError] = useState('');

  // Filter products by the chosen category
  const productsInCategory = useMemo(() => {
    if (!activeCategory) return [];
    return ALL_PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    setIsAdding(true);
    
    const currentUnitPrice = selectedProduct.basePrice * selectedQuality.multiplier;
    const newItem: CartItem = {
      cartId: crypto.randomUUID(),
      id: selectedProduct.id,
      name: selectedProduct.name,
      finalPrice: currentUnitPrice,
      quantity: quantity,
      image: selectedProduct.image,
      quality: selectedQuality.label
    };

    setTimeout(() => {
      setCart(prev => [...prev, newItem]);
      setIsAdding(false);
      setView('categories'); // Back to top level after adding
    }, 400);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    setView('products');
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedQuality(QUALITIES[0]);
    setQuantity(1);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleCompleteTransaction = () => {
    const { address, card, expiry, cvc } = checkoutForm;
    if (!address || !card || !expiry || !cvc) {
      setFormError('Please fill in all delivery and payment details to proceed.');
      return;
    }
    setFormError('');
    setView('success');
    setCart([]);
    setCheckoutForm({ address: '', card: '', expiry: '', cvc: '' });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.finalPrice * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#333] font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-5 flex justify-between items-center ${view === 'home' ? 'bg-transparent text-white' : 'bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-900 shadow-sm'}`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-8 h-8 bg-[#B99470] rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
          <div className="text-xl font-black tracking-tighter uppercase">
            SOFTTOUCH<span className="text-[#B99470]">.</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest">
             <button onClick={() => setView('home')} className="hover:text-[#B99470]">Home</button>
             <button onClick={() => setView('categories')} className="hover:text-[#B99470]">Menu</button>
          </div>
          <div className="relative cursor-pointer group" onClick={() => setView('checkout')}>
            <ShoppingCart size={22} className="group-hover:text-[#B99470]" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#B99470] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* --- HOME --- */}
        {view === 'home' && (
           <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1544333346-64e4fe182547?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
             <div className="absolute inset-0 bg-black/50" />
             <div className="relative z-10 text-center px-6">
               <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">Coastal Soul,<br/>Hand Crafted.</h1>
               <button onClick={() => setView('categories')} className="bg-[#B99470] text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Enter Menu</button>
             </div>
           </div>
        )}

        {/* --- STEP 1: CATEGORIES --- */}
        {view === 'categories' && (
           <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 animate-in fade-in duration-500">
             <div className="text-center mb-16">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B99470]">Select a category</span>
                <h2 className="text-5xl font-serif text-[#1a1a1a] mt-4">The Collections</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {CATEGORIES.map(cat => (
                  <div key={cat.name} className="group cursor-pointer" onClick={() => handleCategoryClick(cat.name)}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden mb-5 rounded-[2.5rem] shadow-sm">
                      <img src={cat.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <h3 className="text-white text-3xl font-serif tracking-tight">{cat.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* --- STEP 2: SUBCATEGORY PRODUCTS --- */}
        {view === 'products' && (
           <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 animate-in slide-in-from-right-10 duration-500">
             <button onClick={() => setView('categories')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-black">
                <ChevronLeft size={16}/> Back to Collections
             </button>
             <div className="mb-16">
                <h2 className="text-5xl font-serif text-[#1a1a1a]">{activeCategory} Selection</h2>
                <p className="text-gray-400 mt-2">Explore our varieties of {activeCategory?.toLowerCase()}.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {productsInCategory.map(product => (
                  <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                    <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden mb-6 rounded-3xl">
                      <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute bottom-4 left-4">
                         <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black text-[#B99470]">From £{product.basePrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif text-gray-900 group-hover:text-[#B99470] transition-colors">{product.name}</h3>
                    <div className="flex gap-2 mt-3">
                       {product.badges.map(b => (
                         <span key={b} className="text-[8px] font-black uppercase tracking-widest text-gray-300 border border-gray-100 px-2 py-1 rounded-md">{b}</span>
                       ))}
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* --- STEP 3: PRODUCT DETAIL --- */}
        {view === 'detail' && selectedProduct && (
        <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="w-full md:w-[350px]">
                <div className="sticky top-32">
                  <img src={selectedProduct.image} className="w-full aspect-[3/4] object-cover rounded-[2rem] shadow-2xl mb-8" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                       <Clock size={18} className="mx-auto mb-2 text-[#B99470]" />
                       <span className="text-[10px] font-bold uppercase">{selectedProduct.prepTime}</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                       <Star size={18} className="mx-auto mb-2 text-[#B99470]" />
                       <span className="text-[10px] font-bold uppercase">4.9 Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <button onClick={() => setView('products')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B99470] mb-8 hover:translate-x-[-4px] transition-transform">
                   <ChevronLeft size={16}/> Back to {selectedProduct.category}
                </button>

                <div className="mb-10">
                  <h1 className="text-5xl md:text-6xl font-serif text-[#1a1a1a] mb-6 leading-[1.1]">{selectedProduct.name}</h1>
                  <p className="text-xl text-gray-500 font-light leading-relaxed italic italic">"{selectedProduct.description}"</p>
                </div>

                {/* QUALITY & QUANTITY */}
                <div className="bg-stone-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
                   <div className="mb-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B99470]">Custom Selection</span>
                      <h3 className="text-2xl font-serif mt-2 mb-6">Select Quality Grade</h3>
                      <div className="space-y-3">
                        {QUALITIES.map(q => (
                          <button 
                            key={q.label}
                            onClick={() => setSelectedQuality(q)}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${selectedQuality.label === q.label ? 'border-[#B99470] bg-[#B99470]/10 text-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                          >
                            <div className="text-left">
                               <p className="text-[11px] font-black uppercase tracking-widest">{q.label}</p>
                               <p className="text-[10px] opacity-60 mt-1">{q.description}</p>
                            </div>
                            <span className="font-black text-xs">+{((q.multiplier - 1) * 100).toFixed(0)}%</span>
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-6 items-center border-t border-white/10 pt-10">
                      <div className="flex items-center bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
                         <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="p-2 hover:text-[#B99470]"><Minus size={18}/></button>
                         <span className="w-12 text-center font-black text-lg">{quantity}</span>
                         <button onClick={() => setQuantity(quantity+1)} className="p-2 hover:text-[#B99470]"><Plus size={18}/></button>
                      </div>
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 w-full bg-[#B99470] py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all group flex justify-between px-10 items-center"
                      >
                        <span>{isAdding ? 'Adding Item...' : 'Add to Collection'}</span>
                        <span className="text-lg">£{(selectedProduct.basePrice * selectedQuality.multiplier * quantity).toFixed(2)}</span>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* --- CART / CHECKOUT --- */}
        {view === 'checkout' && (
          <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-6xl font-serif mb-16 tracking-tight">Your Selection</h2>
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 space-y-6">
                {cart.length === 0 ? (
                  <div className="py-24 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
                     <ShoppingCart size={48} className="mx-auto text-stone-200 mb-6" />
                     <p className="text-stone-400 font-medium">Your collection is empty.</p>
                     <button onClick={() => setView('categories')} className="mt-8 bg-[#1a1a1a] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest">Start Exploring</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="flex gap-6 items-center p-6 bg-white border border-stone-100 rounded-3xl group">
                      <img src={item.image} className="w-24 h-24 object-cover rounded-2xl" />
                      <div className="flex-1">
                        <h4 className="text-xl font-serif text-gray-900">{item.name}</h4>
                        <div className="flex gap-3 mt-2">
                           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-stone-100 rounded-md text-stone-400">{item.quality}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black">£{(item.finalPrice * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-stone-300 mt-3 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="w-full lg:w-[450px]">
                  <div className="bg-[#1a1a1a] text-white p-12 rounded-[3rem] shadow-2xl sticky top-32">
                    <div className="space-y-4 mb-10 pb-10 border-b border-white/5">
                       <div className="flex justify-between text-[11px] text-white/40 uppercase tracking-widest">
                          <span>Subtotal</span> <span>£{cartTotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-3xl font-serif pt-4">
                          <span>Total</span> <span>£{(cartTotal + 3.5).toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {formError && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-400/10 p-4 rounded-xl">{formError}</p>}
                       <div className="space-y-3">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#B99470]">Shipping</span>
                         <input 
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm outline-none focus:border-[#B99470] transition-colors" 
                           placeholder="Delivery Address"
                           value={checkoutForm.address}
                           onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                         />
                       </div>
                       <div className="space-y-3">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#B99470]">Payment Detail</span>
                         <input 
                           className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm mb-3 outline-none focus:border-[#B99470]" 
                           placeholder="Card Number"
                           value={checkoutForm.card}
                           onChange={(e) => setCheckoutForm({...checkoutForm, card: e.target.value})}
                         />
                         <div className="grid grid-cols-2 gap-4">
                            <input 
                              className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm outline-none focus:border-[#B99470]" 
                              placeholder="MM/YY"
                              value={checkoutForm.expiry}
                              onChange={(e) => setCheckoutForm({...checkoutForm, expiry: e.target.value})}
                            />
                            <input 
                              className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-sm outline-none focus:border-[#B99470]" 
                              placeholder="CVC"
                              value={checkoutForm.cvc}
                              onChange={(e) => setCheckoutForm({...checkoutForm, cvc: e.target.value})}
                            />
                         </div>
                       </div>
                       <button 
                         onClick={handleCompleteTransaction}
                         className="w-full py-6 bg-[#B99470] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl"
                       >
                         Complete Transaction
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SUCCESS --- */}
        {view === 'success' && (
          <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
            <div className="max-w-md space-y-8 animate-in zoom-in duration-1000">
               <div className="w-24 h-24 bg-[#B99470]/10 rounded-full flex items-center justify-center mx-auto text-[#B99470]">
                 <CheckCircle2 size={48} />
               </div>
               <h2 className="text-6xl font-serif">Order Confirmed</h2>
               <p className="text-gray-500 font-light leading-relaxed">Your Swahili coastal specialties are being curated. Expect a knock on your door soon.</p>
               <button onClick={() => setView('categories')} className="w-full py-5 bg-[#1a1a1a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#B99470] transition-all">Back to Menu</button>
            </div>
          </div>
        )}
      </main>

      {/* --- REDESIGNED FOOTER --- */}
      <footer className="bg-stone-950 text-white pt-32 pb-16 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
             <div>
                <h3 className="text-5xl md:text-6xl font-serif leading-tight mb-8">Taste the<br/><span className="text-[#B99470]">Ocean's Spirit</span></h3>
                <p className="text-white/40 font-light leading-relaxed max-w-md text-lg">
                  From the spice markets of Zanzibar to the shores of Mombasa, we bring you the authentic textures of Swahili coastal cuisine.
                </p>
             </div>
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B99470] mb-8">Quick Links</h4>
                   <ul className="space-y-4 text-sm font-medium text-white/60">
                      <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setView('categories')}>The Menu</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Gift Cards</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Our Story</li>
                      <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B99470] mb-8">Reach Us</h4>
                   <div className="space-y-6">
                      <p className="text-sm font-bold">hello@swahili.com</p>
                      <p className="text-sm text-white/40 leading-relaxed">Coastal Quarter, EC2<br/>United Kingdom</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-xs">S</div>
              <div className="text-xl font-black tracking-tighter uppercase">
                SOFTTOUCH<span className="text-[#B99470]">.</span>
              </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              © 2024 SWAHILI COASTAL CRUNCH. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-white/40">
               <span className="hover:text-white cursor-pointer">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}