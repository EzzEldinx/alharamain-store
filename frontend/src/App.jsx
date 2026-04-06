import React, { useState } from 'react';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import { useCartStore } from './store/cartStore';
import { sendOrderToWhatsApp } from './utils/whatsappCheckout';

// All 23 Products Mapped from your images
const dummyProducts = [
  // --- Bag Charms (8 Items) ---
  { id: 1, name: "تعليقة حقيبة دبدوب كراش", category: "Bag Charms", price: 150, image: "/images/products/bagcharm1.jpeg", description: "ميدالية أنيقة للحقائب بتصميم دب عصري ومميز.", isSale: false, isNew: true },
  { id: 2, name: "تعليقة قلب تايجر", category: "Bag Charms", price: 180, oldPrice: 220, image: "/images/products/bagcharm2.jpeg", description: "ميدالية للحقائب بتصميم قلب بنقشة التايجر الجريئة.", isSale: true, isNew: false },
  { id: 3, name: "ميدالية بوهو ستايل", category: "Bag Charms", price: 160, image: "/images/products/bagcharm3.jpeg", description: "تعليقة حقيبة بتفاصيل بوهيمية رقيقة باللون الأبيض والأحمر.", isSale: false, isNew: true },
  { id: 4, name: "تعليقة الفواكه المرحة", category: "Bag Charms", price: 140, image: "/images/products/bagcharm4.jpeg", description: "تصميم شبابي بألوان مبهجة يضيف طاقة إيجابية لحقيبتك.", isSale: false, isNew: false },
  { id: 5, name: "ميدالية الحروف الملونة", category: "Bag Charms", price: 170, image: "/images/products/bagcharm5.jpeg", description: "تعليقة بتصميم عصري وألوان دافئة تناسب الشنط الصيفية.", isSale: false, isNew: true },
  { id: 6, name: "تعليقة لاف بينك", category: "Bag Charms", price: 190, oldPrice: 240, image: "/images/products/bagcharm6.jpeg", description: "تصميم بناتي رقيق باللون الوردي الممزوج بالشرائط الناعمة.", isSale: true, isNew: false },
  { id: 7, name: "ميدالية بلو ماجيك", category: "Bag Charms", price: 155, image: "/images/products/bagcharm7.jpeg", description: "تعليقة بتفاصيل زرقاء أنيقة وخرز ملون يعكس شخصيتك.", isSale: false, isNew: false },
  { id: 8, name: "ميدالية خشبية كلاسيك", category: "Bag Charms", price: 185, image: "/images/products/bagcharm8.jpeg", description: "تصميم مميز يعتمد على الخامات الطبيعية والألوان الترابية.", isSale: false, isNew: true },

  // --- Body Splash (5 Items) ---
  { id: 9, name: "بدي سبلاش بينك بلوسوم", category: "Body Splash", price: 250, image: "/images/products/bodysplash1.jpeg", description: "معطر للجسم بتركيبة غنية بنفحات الزهور الرقيقة.", isSale: false, isNew: true },
  { id: 10, name: "بدي سبلاش سويت فانيلا", category: "Body Splash", price: 260, oldPrice: 320, image: "/images/products/bodysplash2.jpeg", description: "رائحة الفانيليا الدافئة التي تمنحك إحساساً بالاسترخاء.", isSale: true, isNew: false },
  { id: 11, name: "بدي سبلاش ريد روز", category: "Body Splash", price: 270, image: "/images/products/bodysplash3.jpeg", description: "رذاذ عطري آسر بخلاصة الورد الجوري الفاخر للسهرات.", isSale: false, isNew: true },
  { id: 12, name: "بدي سبلاش فروتي ميكس", category: "Body Splash", price: 240, oldPrice: 290, image: "/images/products/bodysplash4.jpeg", description: "مزيج منعش من الفواكه الاستوائية مثالي لأيام الصيف.", isSale: true, isNew: false },
  { id: 13, name: "بدي سبلاش مسك أبيض", category: "Body Splash", price: 280, image: "/images/products/bodysplash5.jpeg", description: "رائحة النظافة والانتعاش مع لمسات المسك الأبيض الفاخر.", isSale: false, isNew: true },

  // --- Headbands (4 Items) ---
  { id: 14, name: "مجموعة أطواق باستيل", category: "Headbands", price: 320, oldPrice: 400, image: "/images/products/headbands1.jpeg", description: "مجموعة راقية من أطواق الشعر بألوان الباستيل الهادئة.", isSale: true, isNew: false },
  { id: 15, name: "مجموعة أطواق مخملية", category: "Headbands", price: 350, image: "/images/products/headbands2.jpeg", description: "أطواق شعر من المخمل الناعم بألوان شتوية دافئة.", isSale: false, isNew: true },
  { id: 16, name: "مجموعة سمر فايبر", category: "Headbands", price: 300, oldPrice: 380, image: "/images/products/headbands3.jpeg", description: "ألوان حيوية ومشرقة تناسب إطلالاتك الصيفية اليومية.", isSale: true, isNew: false },
  { id: 17, name: "مجموعة بيسيك نود", category: "Headbands", price: 280, image: "/images/products/headbands4.jpeg", description: "ألوان النود الأساسية التي تليق مع جميع ملابسك.", isSale: false, isNew: true },

  // --- Necklaces (1 Item) ---
  { id: 18, name: "قلادة ذهبية راقية", category: "Necklaces", price: 450, oldPrice: 550, image: "/images/products/necklase1.jpeg", description: "قلادة ذهبية بتفاصيل دقيقة وتصميم ساحر لإبراز جمالك.", isSale: true, isNew: true },

  // --- Rings (5 Items) ---
  { id: 19, name: "كوليكشن خواتم مرصعة", category: "Rings", price: 550, oldPrice: 700, image: "/images/products/rings1.jpeg", description: "مجموعة فاخرة من الخواتم المرصعة بالكريستال اللامع.", isSale: true, isNew: false },
  { id: 20, name: "خاتم كلاسيكي ناعم", category: "Rings", price: 200, image: "/images/products/rings2.jpeg", description: "خاتم ذهبي بتصميم كلاسيكي ناعم يزينه فص براق.", isSale: false, isNew: true },
  { id: 21, name: "مجموعة خواتم فضية", category: "Rings", price: 480, image: "/images/products/rings3.jpeg", description: "تصميمات فضية هندسية عصرية تناسب الإطلالات العملية.", isSale: false, isNew: false },
  { id: 22, name: "خاتم ذهبي بسيط", category: "Rings", price: 190, oldPrice: 250, image: "/images/products/rings4.jpeg", description: "لمسة من الرقة والأنوثة بتصميم مينيماليست جذاب.", isSale: true, isNew: true },
  { id: 23, name: "خاتم بفص ماسي", category: "Rings", price: 350, image: "/images/products/rings5.jpeg", description: "تصميم أنيق بفص لامع كبير يخطف الأنظار في مناسباتك.", isSale: false, isNew: true },
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const { cartItems, removeFromCart, updateQuantity } = useCartStore();

  const saleProducts = dummyProducts.filter(p => p.isSale).slice(0, 4);
  const newProducts = dummyProducts.filter(p => p.isNew).slice(0, 8);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const getCategoryProducts = (catName) => {
    return dummyProducts.filter(p => {
      if (catName === 'Perfumes') return p.category === 'Body Splash';
      if (catName === 'Rings') return p.category === 'Rings';
      if (catName === 'Accessories') return ['Bag Charms', 'Headbands', 'Necklaces'].includes(p.category);
      return false;
    });
  };

  const currentCategoryProducts = activeCategory ? getCategoryProducts(activeCategory) : [];

  const doScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (activeCategory) {
      setActiveCategory(null);
      setTimeout(() => doScroll(sectionId), 100);
    } else {
      doScroll(sectionId);
    }
  };

  const handleLogoClick = () => {
    setActiveCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans relative flex flex-col bg-black">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-scroll {
          display: flex;
          min-width: 100%;
          animation: marquee 15s linear infinite;
        }
        .marquee-wrapper {
          display: flex;
          overflow: hidden;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Announcement Bar */}
      <div className="bg-[#661620] text-white text-xs py-2.5 marquee-wrapper tracking-widest font-medium relative z-[100]">
        <div className="animate-marquee-scroll shrink-0 items-center justify-around">
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
        </div>
        <div className="animate-marquee-scroll shrink-0 items-center justify-around" aria-hidden="true">
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
        </div>
      </div>

      {/* Luxury Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            
            {/* Logo Section */}
            <div className="flex-1 flex items-center">
              <img 
                src="/images/logo.jpeg" 
                alt="Al-Haramain Logo" 
                className="h-12 md:h-16 cursor-pointer object-contain"
                onClick={handleLogoClick}
              />
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex space-x-10">
              <a href="#flash-sale" onClick={(e) => scrollToSection(e, 'flash-sale')} className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">Flash Sale</a>
              <a href="#new-collection" onClick={(e) => scrollToSection(e, 'new-collection')} className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">New Arrivals</a>
              <a href="#categories" onClick={(e) => scrollToSection(e, 'categories')} className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">Categories</a>
            </nav>

            {/* Icons */}
            <div className="flex-1 flex justify-end items-center space-x-6">
              <button 
                className="text-darkText hover:text-[#661620] transition-colors"
                onClick={() => alert("Search functionality coming soon!")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-darkText hover:text-[#661620] transition-colors flex items-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#661620] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-white">
        {activeCategory ? (
          /* =======================================================
             Category View
             ======================================================= */
          <section className="py-12 md:py-20 bg-white min-h-[60vh] animate-fade-in-up">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <button 
                onClick={() => setActiveCategory(null)} 
                className="mb-8 text-gray-500 hover:text-[#661620] flex items-center gap-2 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Home
              </button>

              <div className="flex flex-col items-center mb-12">
                <h2 className="text-3xl md:text-5xl font-serif text-darkText tracking-widest">{activeCategory}</h2>
                <div className="w-20 h-0.5 bg-[#661620] mt-6"></div>
              </div>

              {currentCategoryProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {currentCategoryProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl font-serif">No products found in this category.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          /* =======================================================
             Home View with Slanted Cuts (Clip-Path)
             ======================================================= */
          <>
            {/* 1. Hero Section - Straight top, Slanted bottom */}
            <section 
              className="relative w-full h-[60vh] md:h-[85vh] bg-black z-10"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop" 
                alt="Luxury Accessories" 
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-24 bg-gradient-to-r from-black/60 to-transparent">
                <div className="text-center md:text-left text-white max-w-2xl px-6">
                  <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-gray-300">The New Standard</p>
                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-wide leading-tight drop-shadow-2xl">
                    Timeless. <br/> <span className="text-[#e2c78f]">Elegance.</span>
                  </h2>
                  <button 
                    onClick={(e) => scrollToSection(e, 'new-collection')}
                    className="mt-6 bg-white text-black px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#e2c78f] transition-colors shadow-xl"
                  >
                    Shop The Collection
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Flash Sale Section - Beige with Slogan */}
            <section 
              id="flash-sale" 
              className="relative bg-[#FAF8F5] -mt-[4vw] pt-[12vw] pb-[8vw] z-20"
              style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center justify-center mb-12 md:mb-20">
                  <p className="font-serif text-2xl md:text-4xl text-[#661620] italic tracking-wide text-center">
                    "Adorn yourself with the finest pieces."
                  </p>
                </div>

                <div className="flex flex-col items-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-darkText">Flash Sale</h2>
                  <div className="w-16 h-0.5 bg-[#661620] mt-4"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {saleProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
                  ))}
                </div>
              </div>
            </section>

            {/* 3. New Collection Section - Mint Green with Slogan */}
            <section 
              id="new-collection" 
              className="relative bg-[#eaf3ed] -mt-[4vw] pt-[12vw] pb-[8vw] z-30"
              style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center justify-center mb-12 md:mb-20">
                  <p className="font-serif text-2xl md:text-4xl text-[#1f3d32] italic tracking-wide text-center">
                    "Where luxury meets everyday elegance."
                  </p>
                </div>

                <div className="flex justify-center mb-10">
                  <button className="bg-[#111111] text-white px-8 py-3 text-xs md:text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-[#661620] transition-colors shadow-md">
                    View All Arrivals
                  </button>
                </div>
                <div className="flex flex-col items-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-darkText">New Collection</h2>
                  <div className="w-16 h-0.5 bg-[#1f3d32] mt-4"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {newProducts.map(product => (
                    <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Categories Section - Burgundy with Slogan */}
            <section 
              id="categories" 
              className="relative bg-[#661620] -mt-[4vw] pt-[12vw] pb-[8vw] z-40"
              style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center justify-center mb-12 md:mb-20">
                  <p className="font-serif text-2xl md:text-4xl text-[#e2c78f] italic tracking-wide text-center">
                    "Define your moments with our exclusive collections."
                  </p>
                </div>

                <div className="flex flex-col items-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif text-white">Shop by Category</h2>
                  <div className="w-16 h-0.5 bg-[#e2c78f] mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                  {[
                    { name: 'Perfumes', img: '/images/products/bodysplash1.jpeg' },
                    { name: 'Rings', img: '/images/products/rings1.jpeg' },
                    { name: 'Accessories', img: '/images/products/bagcharm1.jpeg' }
                  ].map((cat, idx) => (
                    <div 
                      key={idx} 
                      className="relative aspect-[4/5] overflow-hidden group cursor-pointer shadow-2xl rounded-sm border border-white/10"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-colors duration-500 flex flex-col items-center justify-center">
                        <h3 className="text-white text-3xl font-serif tracking-widest mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                        <span className="text-[#e2c78f] text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-b border-[#e2c78f] pb-1">Explore</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* =======================================================
          Luxury Footer - Slanted Top
          ======================================================= */}
      <footer 
        className="relative bg-[#111111] text-gray-300 px-4 -mt-[4vw] pt-[12vw] pb-16 z-50"
        style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% 100%, 0 100%)' }}
      >
        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mt-8">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="bg-white p-2 rounded-lg inline-block mb-6 shadow-md cursor-pointer" onClick={handleLogoClick}>
              <img src="/images/logo.jpeg" alt="Al-Haramain" className="h-12 object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Al-Haramain Accessories.<br/>
              Your ultimate destination for luxury, elegance, and timeless pieces designed to make you shine on every occasion.
            </p>
          </div>

          {/* Contact / Location */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-serif tracking-widest uppercase mb-6 text-lg">Contact & Location</h4>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <span>📍</span> 123 Luxury Street, Alexandria, Egypt
            </p>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <span>📞</span> +20 102 095 5429
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <span>✉️</span> info@alharamain.store
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-serif tracking-widest uppercase mb-6 text-lg">Follow Us</h4>
            <div className="flex justify-center gap-5">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://wa.me/201020955429" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            © {new Date().getFullYear()} Al-Haramain Store. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-[#FAF8F5]">
              <h2 className="text-xl font-serif tracking-widest uppercase text-darkText">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-[#661620] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-32">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <p className="font-serif italic text-lg text-gray-500">Your cart is currently empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-lg border border-gray-50 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-medium text-darkText text-sm mb-1 text-right dir-rtl">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-3 font-semibold">{item.price} EGP</p>
                      <div className="flex items-center gap-4 border border-gray-200 w-fit px-3 py-1 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-black font-bold">-</button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-black font-bold">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-[#FAF8F5] border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-gray-600 font-semibold">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-[#661620]">{cartTotal} EGP</span>
                </div>
                <button 
                  onClick={() => sendOrderToWhatsApp(cartItems)}
                  className="w-full bg-[#111111] text-white py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#661620] transition-colors flex justify-center items-center gap-2 shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Checkout via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}