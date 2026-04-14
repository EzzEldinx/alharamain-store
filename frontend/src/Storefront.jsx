import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import { useCartStore } from './store/cartStore';
import { sendOrderToWhatsApp } from './utils/whatsappCheckout';

// 1. اللينك بتاع الـ API
const API_URL = "https://alharamain-api.rf.gd/api/products.php";
// 2. بيانات المنتجات الأساسية (اللي إنت ضفتها يدوي)
const dummyProducts = [
  { id: 101, name: "تعليقة حقيبة دبدوب كراش", category: "Bag Charms", price: 150, image: "/images/products/bagcharm1.jpeg", description: "ميدالية أنيقة للحقائب بتصميم دب عصري ومميز.", isSale: false, isNew: true },
  { id: 102, name: "تعليقة قلب تايجر", category: "Bag Charms", price: 180, oldPrice: 220, image: "/images/products/bagcharm2.jpeg", description: "ميدالية للحقائب بتصميم قلب بنقشة التايجر الجريئة.", isSale: true, isNew: false },
  { id: 103, name: "ميدالية بوهو ستايل", category: "Bag Charms", price: 160, image: "/images/products/bagcharm3.jpeg", description: "تعليقة حقيبة بتفاصيل بوهيمية رقيقة باللون الأبيض والأحمر.", isSale: false, isNew: true },
  { id: 104, name: "تعليقة الفواكه المرحة", category: "Bag Charms", price: 140, image: "/images/products/bagcharm4.jpeg", description: "تصميم شبابي بألوان مبهجة يضيف طاقة إيجابية لحقيبتك.", isSale: false, isNew: false },
  { id: 105, name: "ميدالية الحروف الملونة", category: "Bag Charms", price: 170, image: "/images/products/bagcharm5.jpeg", description: "تعليقة بتصميم عصري وألوان دافئة تناسب الشنط الصيفية.", isSale: false, isNew: true },
  { id: 106, name: "تعليقة لاف بينك", category: "Bag Charms", price: 190, oldPrice: 240, image: "/images/products/bagcharm6.jpeg", description: "تصميم بناتي رقيق باللون الوردي الممزوج بالشرائط الناعمة.", isSale: true, isNew: false },
  { id: 107, name: "ميدالية بلو ماجيك", category: "Bag Charms", price: 155, image: "/images/products/bagcharm7.jpeg", description: "تعليقة بتفاصيل زرقاء أنيقة وخرز ملون يعكس شخصيتك.", isSale: false, isNew: false },
  { id: 108, name: "ميدالية خشبية كلاسيك", category: "Bag Charms", price: 185, image: "/images/products/bagcharm8.jpeg", description: "تصميم مميز يعتمد على الخامات الطبيعية والألوان الترابية.", isSale: false, isNew: true },
  { id: 109, name: "بدي سبلاش بينك بلوسوم", category: "Body Splash", price: 250, image: "/images/products/bodysplash1.jpeg", description: "معطر للجسم بتركيبة غنية بنفحات الزهور الرقيقة.", isSale: false, isNew: true },
  { id: 110, name: "بدي سبلاش سويت فانيلا", category: "Body Splash", price: 260, oldPrice: 320, image: "/images/products/bodysplash2.jpeg", description: "رائحة الفانيليا الدافئة التي تمنحك إحساساً بالاسترخاء.", isSale: true, isNew: false },
  { id: 111, name: "بدي سبلاش ريد روز", category: "Body Splash", price: 270, image: "/images/products/bodysplash3.jpeg", description: "رذاذ عطري آسر بخلاصة الورد الجوري الفاخر للسهرات.", isSale: false, isNew: true },
  { id: 112, name: "بدي سبلاش فروتي ميكس", category: "Body Splash", price: 240, oldPrice: 290, image: "/images/products/bodysplash4.jpeg", description: "مزيج منعش من الفواكه الاستوائية مثالي لأيام الصيف.", isSale: true, isNew: false },
  { id: 113, name: "بدي سبلاش مسك أبيض", category: "Body Splash", price: 280, image: "/images/products/bodysplash5.jpeg", description: "رائحة النظافة والانتعاش مع لمسات المسك الأبيض الفاخر.", isSale: false, isNew: true },
  { id: 114, name: "مجموعة أطواق باستيل", category: "Headbands", price: 320, oldPrice: 400, image: "/images/products/headbands1.jpeg", description: "مجموعة راقية من أطواق الشعر بألوان الباستيل الهادئة.", isSale: true, isNew: false },
  { id: 115, name: "مجموعة أطواق مخملية", category: "Headbands", price: 350, image: "/images/products/headbands2.jpeg", description: "أطواق شعر من المخمل الناعم بألوان شتوية دافئة.", isSale: false, isNew: true },
  { id: 116, name: "مجموعة سمر فايبر", category: "Headbands", price: 300, oldPrice: 380, image: "/images/products/headbands3.jpeg", description: "ألوان حيوية ومشرقة تناسب إطلالاتك الصيفية اليومية.", isSale: true, isNew: false },
  { id: 117, name: "مجموعة بيسيك نود", category: "Headbands", price: 280, image: "/images/products/headbands4.jpeg", description: "ألوان النود الأساسية التي تليق مع جميع ملابسك.", isSale: false, isNew: true },
  { id: 118, name: "قلادة ذهبية راقية", category: "Necklaces", price: 450, oldPrice: 550, image: "/images/products/necklase1.jpeg", description: "قلادة ذهبية بتفاصيل دقيقة وتصميم ساحر لإبراز جمالك.", isSale: true, isNew: true },
  { id: 119, name: "كوليكشن خواتم مرصعة", category: "Rings", price: 550, oldPrice: 700, image: "/images/products/rings1.jpeg", description: "مجموعة فاخرة من الخواتم المرصعة بالكريستال اللامع.", isSale: true, isNew: false },
  { id: 120, name: "خاتم كلاسيكي ناعم", category: "Rings", price: 200, image: "/images/products/rings2.jpeg", description: "خاتم ذهبي بتصميم كلاسيكي ناعم يزينه فص براق.", isSale: false, isNew: true },
  { id: 121, name: "مجموعة خواتم فضية", category: "Rings", price: 480, image: "/images/products/rings3.jpeg", description: "تصميمات فضية هندسية عصرية تناسب الإطلالات العملية.", isSale: false, isNew: false },
  { id: 122, name: "خاتم ذهبي بسيط", category: "Rings", price: 190, oldPrice: 250, image: "/images/products/rings4.jpeg", description: "لمسة من الرقة والأنوثة بتصميم مينيماليست جذاب.", isSale: true, isNew: true },
  { id: 123, name: "خاتم بفص ماسي", category: "Rings", price: 350, image: "/images/products/rings5.jpeg", description: "تصميم أنيق بفص لامع كبير يخطف الأنظار في مناسباتك.", isSale: false, isNew: true },
];

const testimonials = [
  { id: 1, name: "Nourhan M.", text: "The quality of the rings is amazing! Will definitely buy again. ✨", rating: 5 },
  { id: 2, name: "Salma A.", text: "Fast delivery and the body splash smells heavenly! Highly recommended. 💕", rating: 5 },
  { id: 3, name: "Yasmine K.", text: "In love with my new bag charm. It adds such a cute touch to my bag! 👜", rating: 4 },
];

const Sparkle = ({ top, left, delay, size = "24px", color = "#e2c78f" }) => (
  <div className="absolute pointer-events-none animate-float" style={{ top, left, animationDelay: delay }}>
    <svg className="animate-sparkle-pulse" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" fill={color} opacity="0.9" filter={`drop-shadow(0 0 4px ${color}cc)`}/>
    </svg>
  </div>
);

export default function Storefront() {
  // الـ State المبدئي هو الداتا الوهمية عشان الموقع ميفتحش فاضي
  const [products, setProducts] = useState(dummyProducts); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // مش محتاجين لودنج يوقف الموقع

  const { cartItems, removeFromCart, updateQuantity, toastMessage } = useCartStore();

  // سحب المنتجات من الداتا بيز ودمجها مع الداتا الوهمية
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // دمج المنتجات: الداتا اللي جاية من الداشبورد + الداتا الوهمية
        if (data && data.length > 0) {
          setProducts([...data, ...dummyProducts]);
        }
      } catch (error) {
        console.error("Error fetching products from DB, falling back to dummy data:", error);
      }
    };
    fetchProducts();
  }, []);

  const saleProducts = products.filter(p => p.isSale).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 8);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Scroll logic for navbar and reveal animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [activeCategory, sortOrder, products]);

  const getCategoryProducts = (catName) => {
    return products.filter(p => {
      if (catName === 'Perfumes') return p.category === 'Body Splash';
      if (catName === 'Rings') return p.category === 'Rings';
      if (catName === 'Accessories') return ['Bag Charms', 'Headbands', 'Necklaces'].includes(p.category);
      return false;
    });
  };

  let displayProducts = activeCategory ? getCategoryProducts(activeCategory) : [];
  if (sortOrder === 'price-asc') displayProducts.sort((a, b) => a.price - b.price);
  else if (sortOrder === 'price-desc') displayProducts.sort((a, b) => b.price - a.price);
  else if (sortOrder === 'newest') displayProducts = displayProducts.filter(p => p.isNew);

  const doScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = scrolled ? 100 : 80;
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
    <div className="min-h-screen font-sans relative flex flex-col bg-white overflow-clip">
      
      <style>{`
        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .reveal-on-scroll.animate-in { opacity: 1; transform: translateY(0); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee-scroll { display: flex; min-width: 100%; animation: marquee 15s linear infinite; }
        .marquee-wrapper { display: flex; overflow: hidden; }
        @keyframes slowZoom { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .animate-slow-zoom { animation: slowZoom 20s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes sparklePulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .animate-sparkle-pulse { animation: sparklePulse 2s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>

      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[100] bg-[#5C131C] text-[#e2c78f] px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 animate-fade-in-up border-l-4 border-[#e2c78f]">
          <span className="text-[#e2c78f] text-xl">✨</span>
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/201020955429" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group">
        <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-40 group-hover:hidden"></span>
        <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>

      {/* Announcement Bar */}
      <div className="bg-[#5C131C] text-[#e2c78f] text-xs py-2.5 marquee-wrapper tracking-widest font-medium relative z-[100] border-b border-[#e2c78f]/20">
        <div className="animate-marquee-scroll shrink-0 items-center justify-around">
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ Luxury Awaits You</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ Free Delivery Over 1000 EGP</span>
        </div>
        <div className="animate-marquee-scroll shrink-0 items-center justify-around" aria-hidden="true">
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ Luxury Awaits You</span>
          <span className="mx-6">✨ 20% OFF on Selected Items</span>
          <span className="mx-6">✨ Free Delivery Over 1000 EGP</span>
        </div>
      </div>

      {/* Floating Navbar */}
      <div className={`sticky top-0 z-[60] transition-all duration-300 ease-in-out ${scrolled ? 'pt-3 px-4' : 'pt-0 px-0'}`}>
        <header className={`mx-auto transition-all duration-300 ease-in-out ${
          scrolled ? 'max-w-[1000px] bg-[#111111]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-full border border-white/10 px-6 py-2' 
            : 'max-w-full bg-white shadow-sm px-4 sm:px-6 lg:px-8 py-3 md:py-4 rounded-none border-transparent'
        }`}>
          <div className="flex justify-between items-center h-12 md:h-14">
            <div className="flex-1 flex items-center">
              <img src="/images/logo.jpeg" alt="Al-Haramain Logo" className={`cursor-pointer object-contain transition-all duration-300 ${scrolled ? 'h-8 md:h-10' : 'h-12 md:h-16'}`} onClick={handleLogoClick}/>
            </div>
            <nav className="hidden lg:flex space-x-2">
              <a href="#flash-sale" onClick={(e) => scrollToSection(e, 'flash-sale')} className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${scrolled ? 'text-gray-300 hover:bg-[#5C131C] hover:text-[#FAF8F5]' : 'text-[#5C131C] hover:bg-[#5C131C] hover:text-[#FAF8F5]'}`}>Flash Sale</a>
              <a href="#new-collection" onClick={(e) => scrollToSection(e, 'new-collection')} className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${scrolled ? 'text-gray-300 hover:bg-[#5C131C] hover:text-[#FAF8F5]' : 'text-[#5C131C] hover:bg-[#5C131C] hover:text-[#FAF8F5]'}`}>New Arrivals</a>
              <a href="#categories" onClick={(e) => scrollToSection(e, 'categories')} className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${scrolled ? 'text-gray-300 hover:bg-[#5C131C] hover:text-[#FAF8F5]' : 'text-[#5C131C] hover:bg-[#5C131C] hover:text-[#FAF8F5]'}`}>Categories</a>
            </nav>
            <div className="flex-1 flex justify-end items-center space-x-2 md:space-x-4">
              <button onClick={() => alert("Search functionality coming soon!")} className={`p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-gray-300 hover:bg-[#5C131C] hover:text-white' : 'text-[#5C131C] hover:bg-[#5C131C] hover:text-white'}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button onClick={() => setIsCartOpen(true)} className={`relative p-2 rounded-full transition-colors duration-200 ${scrolled ? 'text-gray-300 hover:bg-[#5C131C] hover:text-white' : 'text-[#5C131C] hover:bg-[#5C131C] hover:text-white'}`}>
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 md:-top-1 md:-right-1 bg-[#e2c78f] text-[#5C131C] text-[10px] md:text-[11px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shadow-md border border-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-grow bg-white">
        {activeCategory ? (
          <section className="py-12 md:py-20 bg-[#FAF8F5] min-h-[60vh] animate-fade-in-up">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-[#e2c78f]/30 pb-6 reveal-on-scroll">
                <button onClick={() => { setActiveCategory(null); setSortOrder('default'); }} className="mb-4 md:mb-0 text-[#5C131C] hover:text-[#a68953] flex items-center gap-2 transition-colors font-medium self-start md:self-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back to Home
                </button>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-md border border-[#e2c78f]/30 shadow-sm">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#5C131C] hidden sm:block">Sort By:</span>
                  <select className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer text-[#a68953]" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="default">Recommended</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col items-center mb-12 reveal-on-scroll">
                <h2 className="text-3xl md:text-5xl font-serif text-[#5C131C] tracking-widest">{activeCategory}</h2>
                <div className="w-20 h-0.5 bg-[#e2c78f] mt-6"></div>
              </div>
              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {displayProducts.map((product, idx) => (
                    <div key={product.id} className="reveal-on-scroll" style={{ transitionDelay: `${idx * 100}ms` }}>
                      <ProductCard product={product} onClick={setSelectedProduct} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-[#5C131C]/60 reveal-on-scroll">
                  <p className="text-xl font-serif">No products found in this selection.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="relative w-full h-[85vh] md:h-[85vh] bg-black z-10 overflow-hidden flex items-center justify-center md:justify-start" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)' }}>
              <img src="/images/hero-mobile.jpeg" alt="Luxury Accessories Mobile" className="absolute inset-0 w-full h-full object-cover object-center opacity-80 animate-slow-zoom block md:hidden" />
              <img src="/images/hero.jpeg" alt="Luxury Accessories Desktop" className="absolute inset-0 w-full h-full object-cover object-center opacity-80 animate-slow-zoom hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#5C131C]/80 via-black/30 to-black/70 md:to-transparent pointer-events-none"></div>
              <Sparkle top="15%" left="20%" delay="0s" size="30px" />
              <Sparkle top="40%" left="80%" delay="1s" size="20px" />
              <Sparkle top="70%" left="15%" delay="2s" size="25px" />
              <Sparkle top="25%" left="70%" delay="0.5s" size="35px" />
              <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-24 z-20">
                <div className="text-center md:text-left text-white max-w-2xl px-6 animate-fade-in-up">
                  <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-[#e2c78f] drop-shadow-md">The New Standard</p>
                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-wide leading-tight drop-shadow-2xl">Timeless. <br/> <span className="text-[#e2c78f] italic">Elegance.</span></h2>
                  <button onClick={(e) => scrollToSection(e, 'new-collection')} className="mt-6 bg-[#FAF8F5] text-[#5C131C] px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#e2c78f] transition-all duration-300 shadow-[0_0_15px_rgba(226,199,143,0.5)]">Shop The Collection</button>
                </div>
              </div>
            </section>

            <section id="flash-sale" className="relative bg-[#FAF8F5] -mt-[4vw] pt-[12vw] pb-[10vw] z-20" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}>
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-12 md:mb-20 reveal-on-scroll">
                  <p className="font-serif text-2xl md:text-4xl text-[#a68953] italic tracking-wide text-center">"Adorn yourself with the finest pieces."</p>
                </div>
                <div className="flex flex-col items-center mb-12 relative reveal-on-scroll">
                  <Sparkle top="-10px" left="-30px" delay="0s" size="20px" color="#5C131C" />
                  <h2 className="text-3xl md:text-4xl font-serif text-[#5C131C]">Flash Sale</h2>
                  <div className="w-16 h-0.5 bg-[#e2c78f] mt-4"></div>
                </div>
                {saleProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {saleProducts.map((product, index) => (
                      <div key={product.id} className="reveal-on-scroll group transition-transform hover:-translate-y-2 duration-300" style={{ transitionDelay: `${index * 100}ms` }}>
                        <ProductCard product={product} onClick={setSelectedProduct} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 font-serif">No products on sale currently.</p>
                )}
              </div>
            </section>

            <section id="new-collection" className="relative bg-[#E8F0EB] -mt-[4vw] pt-[12vw] pb-[10vw] z-30" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}>
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center mb-10 reveal-on-scroll">
                  <button className="bg-transparent border border-[#5C131C] text-[#5C131C] px-8 py-3 text-xs md:text-sm font-semibold tracking-widest uppercase hover:bg-[#5C131C] hover:text-[#FAF8F5] transition-all duration-300">View All Arrivals</button>
                </div>
                <div className="flex flex-col items-center mb-12 reveal-on-scroll">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#1b3d2f]">New Collection</h2>
                  <div className="w-16 h-0.5 bg-[#5C131C] mt-4"></div>
                </div>
                {newProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {newProducts.map((product, index) => (
                      <div key={product.id} className="reveal-on-scroll group transition-transform hover:-translate-y-2 duration-300" style={{ transitionDelay: `${index * 100}ms` }}>
                        <ProductCard product={product} onClick={setSelectedProduct} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 font-serif">New arrivals coming soon.</p>
                )}
              </div>
            </section>

            <section id="categories" className="relative bg-[#5C131C] -mt-[4vw] pt-[12vw] pb-[10vw] z-40" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}>
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-12 md:mb-20 relative reveal-on-scroll">
                  <Sparkle top="-20px" left="20%" delay="1s" size="24px" />
                  <p className="font-serif text-2xl md:text-4xl text-[#e2c78f] italic tracking-wide text-center">"Define your moments with our exclusive collections."</p>
                </div>
                <div className="flex flex-col items-center mb-16 reveal-on-scroll">
                  <h2 className="text-3xl md:text-4xl font-serif text-[#FAF8F5]">Shop by Category</h2>
                  <div className="w-16 h-0.5 bg-[#e2c78f] mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                  {[{ name: 'Perfumes', img: '/images/products/bodysplash1.jpeg' }, { name: 'Rings', img: '/images/products/rings1.jpeg' }, { name: 'Accessories', img: '/images/products/bagcharm1.jpeg' }].map((cat, idx) => (
                    <div key={idx} className="reveal-on-scroll relative aspect-[4/5] overflow-hidden group cursor-pointer shadow-2xl rounded-sm border border-[#e2c78f]/20" style={{ transitionDelay: `${idx * 150}ms` }} onClick={() => { setActiveCategory(cat.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 flex flex-col items-center justify-center">
                        <h3 className="text-white text-3xl font-serif tracking-widest mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                        <span className="text-[#e2c78f] text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-b border-[#e2c78f] pb-1">Explore</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="testimonials" className="relative bg-[#FAF8F5] -mt-[4vw] pt-[12vw] pb-[10vw] z-[45]" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% calc(100% - 4vw), 0 100%)' }}>
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-12 md:mb-16 reveal-on-scroll">
                  <p className="font-serif text-2xl md:text-4xl text-[#5C131C] italic tracking-wide text-center">"Loved by our customers."</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testi, index) => (
                    <div key={testi.id} className="reveal-on-scroll bg-white p-8 rounded-sm shadow-[0_4px_20px_rgba(92,19,28,0.08)] text-center transform transition-transform hover:-translate-y-2 duration-300 border border-[#e2c78f]/20" style={{ transitionDelay: `${index * 150}ms` }}>
                      <div className="flex justify-center text-[#e2c78f] mb-4 text-xl">{'★'.repeat(testi.rating)}</div>
                      <p className="text-gray-600 italic mb-6 leading-relaxed">"{testi.text}"</p>
                      <h4 className="font-serif font-bold text-[#5C131C] tracking-widest uppercase text-sm border-t border-[#e2c78f]/30 pt-4 inline-block">{testi.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="relative bg-[#111111] text-gray-300 px-4 -mt-[4vw] pt-[12vw] pb-16 z-50 border-t-[3px] border-[#5C131C]" style={{ clipPath: 'polygon(0 0, 100% 4vw, 100% 100%, 0 100%)' }}>
        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mt-8 reveal-on-scroll">
          <div className="flex flex-col items-center md:items-start">
            <img src="/images/logo.jpeg" alt="Al-Haramain" className="h-20 md:h-28 object-contain mb-6 cursor-pointer drop-shadow-xl" onClick={handleLogoClick} />
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">Al-Haramain Accessories.<br/>Your ultimate destination for luxury, elegance, and timeless pieces designed to make you shine on every occasion.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-serif tracking-widest uppercase mb-6 text-lg">Contact & Location</h4>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2 hover:text-[#e2c78f] transition-colors cursor-pointer"><span>📍</span> 123 Luxury Street, Alexandria, Egypt</p>
            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2 hover:text-[#e2c78f] transition-colors cursor-pointer"><span>📞</span> +20 102 095 5429</p>
            <p className="text-sm text-gray-400 flex items-center gap-2 hover:text-[#e2c78f] transition-colors cursor-pointer"><span>✉️</span> info@alharamain.store</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-serif tracking-widest uppercase mb-6 text-lg">Follow Us</h4>
            <div className="flex justify-center gap-5">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5C131C] hover:border-[#5C131C] transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#5C131C] hover:border-[#5C131C] transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-gray-800 text-center reveal-on-scroll">
          <p className="text-xs text-gray-500 tracking-widest uppercase">© {new Date().getFullYear()} Al-Haramain Store. All rights reserved.</p>
        </div>
      </footer>

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      {isCartOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 flex justify-between items-center border-b border-[#e2c78f]/30 bg-[#FAF8F5]">
              <h2 className="text-xl font-serif tracking-widest uppercase text-[#5C131C]">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-[#5C131C] transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-32"><svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg><p className="font-serif italic text-lg text-gray-500">Your cart is currently empty.</p></div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#5C131C] text-sm mb-1 text-right dir-rtl">{item.name}</h3>
                      <p className="text-[#a68953] text-sm mb-3 font-semibold">{item.price} EGP</p>
                      <div className="flex items-center gap-4 border border-[#e2c78f]/30 w-fit px-3 py-1 rounded-sm">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-[#5C131C] font-bold">-</button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-[#5C131C] font-bold">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 bg-[#FAF8F5] border-t border-[#e2c78f]/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-[#5C131C] font-semibold">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-[#a68953]">{cartTotal} EGP</span>
                </div>
                <button onClick={() => sendOrderToWhatsApp(cartItems)} className="w-full bg-[#5C131C] text-[#FAF8F5] py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#a68953] hover:text-white transition-colors flex justify-center items-center gap-2 shadow-xl rounded-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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