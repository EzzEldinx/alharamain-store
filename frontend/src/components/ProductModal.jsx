import React from 'react';
import { useCartStore } from '../store/cartStore';
import { sendOrderToWhatsApp } from '../utils/whatsappCheckout';

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart } = useCartStore();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose(); // بيقفل الـ Modal بعد ما يضيف للسلة عشان يكمل فرجة
  };

  const handleQuickOrder = () => {
    sendOrderToWhatsApp([{ ...product, quantity: 1 }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-fade-in-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-auto bg-secondary relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          <p className="text-sm text-gold-dark uppercase tracking-widest font-bold mb-2">
            {product.category}
          </p>
          
          <div dir="rtl" className="text-right mb-6">
            <h2 className="text-3xl font-bold text-darkText mb-4">{product.name}</h2>
            <div className="prose text-gray-600 text-lg leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>

          <p className="text-3xl text-gold mb-8 font-bold">{product.price} EGP</p>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-100">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-gold/30 text-lg"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleQuickOrder}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Quick Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}