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
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();

  // الحصول على المنتجات للأقسام المختلفة (ناخد أول 4 للـ Flash Sale عشان الشكل يكون متناسق)
  const saleProducts = dummyProducts.filter(p => p.isSale).slice(0, 4);
  const newProducts = dummyProducts.filter(p => p.isNew).slice(0, 8); // 8 منتجات للجديد

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen font-sans relative flex flex-col">
      
      {/* Announcement Bar */}
      <div className="bg-[#661620] text-white text-xs py-2.5 overflow-hidden flex justify-center whitespace-nowrap tracking-wide font-medium">
        <div className="flex gap-12 animate-marquee">
          <span>✨ 20% OFF on Selected Items</span>
          <span className="hidden sm:inline">✨ Premium Quality Guaranteed</span>
          <span className="hidden md:inline">✨ 20% OFF on Selected Items</span>
          <span className="hidden lg:inline">✨ Free Shipping on Orders over 1000 EGP</span>
        </div>
      </div>

      {/* Luxury Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl md:text-3xl font-serif tracking-widest uppercase font-semibold text-darkText cursor-pointer">
                Al-Haramain
              </h1>
            </div>

            <nav className="hidden lg:flex space-x-10">
              <a href="#flash-sale" className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">Flash Sale</a>
              <a href="#new-collection" className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">New Arrivals</a>
              <a href="#categories" className="text-sm text-darkText hover:text-[#661620] uppercase tracking-wider font-medium transition-colors">Categories</a>
            </nav>

            <div className="flex-1 flex justify-end items-center space-x-6">
              <button className="text-darkText hover:text-gray-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-darkText hover:text-gray-500 transition-colors flex items-center"
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

      <main className="flex-grow">
        {/* Massive Hero Section - Aesthetic Image */}
        <section className="relative w-full h-[60vh] md:h-[85vh] bg-black">
          <img 
            src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Accessories" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-24 bg-gradient-to-r from-black/50 to-transparent">
            <div className="text-center md:text-left text-white max-w-2xl px-6">
              <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 text-gray-200">The New Standard</p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-wide leading-tight drop-shadow-lg">
                Timeless. <br/> <span className="text-gray-300">Elegance.</span>
              </h2>
              <button className="mt-6 bg-white text-black px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-gray-200 transition-colors shadow-xl">
                Shop The Collection
              </button>
            </div>
          </div>
        </section>

        {/* Flash Sale Section - Creamy Beige Background */}
        <section id="flash-sale" className="py-20 md:py-32 bg-[#FAF8F5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* New Collection Section - Pure White Background */}
        <section id="new-collection" className="py-20 md:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-10">
              <button className="bg-brandDark text-white px-8 py-3 text-xs md:text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-gray-800 transition-colors shadow-md">
                View All Arrivals
              </button>
            </div>
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-darkText">New Collection</h2>
              <div className="w-16 h-0.5 bg-[#661620] mt-4"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid - Warm Light Gray Background */}
        <section id="categories" className="py-20 md:py-32 bg-[#F4F4F6]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-darkText">Shop by Category</h2>
              <div className="w-16 h-0.5 bg-[#661620] mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {[
                { name: 'Perfumes', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80' },
                { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f66122bc8?w=800&q=80' },
                { name: 'Accessories', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80' }
              ].map((cat, idx) => (
                <div key={idx} className="relative aspect-[4/5] overflow-hidden group cursor-pointer shadow-lg">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500 flex flex-col items-center justify-center">
                    <h3 className="text-white text-3xl font-serif tracking-widest mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                    <span className="text-white text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-b border-white pb-1">Explore</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-[#FAF8F5]">
              <h2 className="text-xl font-serif tracking-widest uppercase text-darkText">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black transition-colors">
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
                  <div key={item.id} className="flex gap-4 items-center bg-white p-2 rounded-lg border border-gray-50">
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
                  <span className="text-2xl font-serif font-bold text-darkText">{cartTotal} EGP</span>
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