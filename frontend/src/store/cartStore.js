import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      // لو المنتج موجود، زود الكمية
      return {
        cartItems: state.cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    // لو مش موجود، ضيفه لأول مرة بكمية 1
    return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== productId)
  })),
  updateQuantity: (productId, amount) => set((state) => ({
    cartItems: state.cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
  })),
  clearCart: () => set({ cartItems: [] })
}));