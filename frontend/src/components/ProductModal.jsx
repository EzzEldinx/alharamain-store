import React from 'react';
import { useCartStore } from '../store/cartStore';
import { sendOrderToWhatsApp } from '../utils/whatsappCheckout'; // استدعاء دالة الواتساب

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCartStore();
  
  if (!isOpen || !product) return null;

  // الدالة دي بتقفل الـ Pop-up لو اليوزر داس على الخلفية السودة الشفافة
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-4"
      onClick={handleBackdropClick}
    >
      {/* خليت الـ Modal زواياه مدورة وناعمة */}
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row relative">
        
        {/* زرار الـ X (موجود كخيار إضافي لليوزر) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-[#5C131C] bg-white rounded-full p-2 shadow-md transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* صورة المنتج */}
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.isSale && <span className="absolute top-4 left-4 bg-[#5C131C] text-white text-xs font-bold px-4 py-1 uppercase tracking-widest rounded-full">Sale</span>}
        </div>

        {/* تفاصيل المنتج والزراير */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <span className="text-[#a68953] text-xs font-bold uppercase tracking-widest mb-2">{product.category}</span>
          <h2 className="text-3xl font-serif text-[#5C131C] mb-4 leading-tight">{product.name}</h2>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-serif font-bold text-[#a68953]">{product.price} EGP</span>
            {product.oldPrice && <span className="text-gray-400 line-through text-lg">{product.oldPrice} EGP</span>}
          </div>

          {/* الزراير بالزوايا المدورة (Rounded-full) */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* زرار الشراء السريع عبر الواتساب */}
            <button 
              onClick={() => {
                // بيبعت المنتج الحالي كـ Array للواتساب علطول بـ Quantity 1
                sendOrderToWhatsApp([{ ...product, quantity: 1 }]);
              }}
              className="w-full bg-[#25D366] text-white py-3.5 uppercase tracking-widest text-sm font-bold hover:bg-[#1EBE5A] transition-colors shadow-md rounded-full flex justify-center items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Quick Checkout
            </button>

            {/* زرار إضافة للسلة العادي */}
            <button 
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full bg-[#111111] text-[#FAF8F5] py-3.5 uppercase tracking-widest text-sm font-bold hover:bg-[#a68953] transition-colors shadow-md rounded-full"
            >
              Add to Cart
            </button>
            
            {/* زرار Continue Shopping العنابي الرايق */}
            <button 
              onClick={onClose}
              className="w-full bg-transparent border border-[#5C131C] text-[#5C131C] py-3.5 uppercase tracking-widest text-sm font-bold hover:bg-[#5C131C] hover:text-[#FAF8F5] transition-colors shadow-sm rounded-full mt-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}