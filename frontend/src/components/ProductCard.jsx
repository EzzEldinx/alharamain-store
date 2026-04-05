import React from 'react';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product, onClick }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      onClick={() => onClick(product)}
      className="group cursor-pointer flex flex-col h-full"
    >
      {/* Image Container (Portrait 4:5) */}
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isSale && (
            <span className="bg-luxuryRed text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-darkText text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Hover Add to Cart Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 hidden md:block">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur text-darkText font-medium py-3 text-sm hover:bg-black hover:text-white transition-colors"
          >
            + Add to cart
          </button>
        </div>
      </div>

      {/* Product Details (Centered like the screenshot) */}
      <div className="flex flex-col items-center text-center px-2">
        <h3 className="text-sm md:text-base font-medium text-darkText mb-1">{product.name}</h3>
        
        {/* Star Rating Dummy */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs text-gray-500">5.0 ( {product.id + 2} reviews )</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-luxuryRed">
            {product.price} EGP
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.oldPrice} EGP
            </span>
          )}
        </div>
      </div>
    </div>
  );
}