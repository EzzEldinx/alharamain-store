// src/utils/whatsappCheckout.js

export const sendOrderToWhatsApp = (cartItems) => {
  // 1. رقم الواتساب بتاع المحل (تأكد إنه صح وبكود الدولة 20)
  const phoneNumber = "201020955429"; 

  // 2. حساب الإجمالي
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 3. تجميع تفاصيل المنتجات في رسالة شيك
  let message = `*✨ New Order from Al-Haramain Store ✨*\n\n`;
  message += `*Order Details:*\n`;
  message += `--------------------------\n`;

  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Category: ${item.category}\n`;
    message += `   Price: ${item.price} EGP\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Subtotal: ${item.price * item.quantity} EGP\n`;
    message += `--------------------------\n`;
  });

  message += `\n*💰 Total Amount:* ${cartTotal} EGP\n\n`;
  message += `*Customer Details:*\n`;
  message += `(Please reply to this message with your Name, Phone Number, and Delivery Address to confirm your order.)\n\n`;
  message += `Thank you for shopping with Al-Haramain! 👑`;

  // 4. تحويل الرسالة لفورمات يقبله الواتساب
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // 5. فتح الواتساب في تابة جديدة
  window.open(whatsappUrl, '_blank');
};