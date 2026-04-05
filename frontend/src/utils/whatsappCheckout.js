export const sendOrderToWhatsApp = (cartItems) => {
    if (cartItems.length === 0) return;
  
    const phoneNumber = "201020955429"; 
    let totalAmount = 0;
    
    let message = `*Hello Al-Haramain Accessories!* ✨\n`;
    message += `I would like to place a new order:\n\n`;
  
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Quantity: ${item.quantity} | Price: ${item.price} EGP\n`;
    });
  
    message += `\n*Total Amount:* ${totalAmount} EGP\n`;
    message += `*Payment Method:* InstaPay 💸\n\n`;
    message += `Please confirm my order. Thank you!`;
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };