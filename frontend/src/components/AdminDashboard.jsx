import React, { useState, useEffect } from 'react';

// اللينك بتاع الـ API
const API_URL = "http://alharamain-api.rf.gd/api/products.php";

const mockOrders = [
  { id: "ORD-001", customer: "Ahmed Ali", date: "2026-04-07", total: 450, status: "Pending" },
  { id: "ORD-002", customer: "Nourhan M.", date: "2026-04-06", total: 1200, status: "Shipped" },
  { id: "ORD-003", customer: "Salma K.", date: "2026-04-05", total: 340, status: "Delivered" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State جديد عشان نعرف إحنا بنعمل Edit ولا Add
  const [editId, setEditId] = useState(null); 

  const emptyForm = { name: '', price: '', oldPrice: '', category: 'Bag Charms', image: '', description: '', isSale: false, isNew: true };
  const [formData, setFormData] = useState(emptyForm);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // دالة الحفظ (بتضيف جديد أو بتعدل القديم حسب الـ editId)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? 'PUT' : 'POST';
      const payload = editId ? { ...formData, id: editId } : formData;

      const res = await fetch(API_URL, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      
      if (result.message) {
        alert(editId ? "Product Updated Successfully! ✏️" : "Product Added Successfully! ✅");
        closeModal();
        fetchProducts(); 
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    }
  };

  // دالة المسح
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        const res = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.message) {
          fetchProducts();
        } else {
          alert("Error deleting product");
        }
      } catch (error) {
        alert("Failed to connect to server");
      }
    }
  };

  // دالة فتح نافذة التعديل
  const handleEditClick = (product) => {
    setFormData(product);
    setEditId(product.id);
    setIsAddModalOpen(true);
  };

  // دالة قفل النافذة وتصفير البيانات
  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="flex h-screen bg-[#FAF8F5] font-sans overflow-hidden">
      
      <aside className="w-64 bg-[#111111] text-gray-400 flex flex-col shadow-2xl z-20 border-r-4 border-[#5C131C]">
        <div className="p-6 border-b border-white/10 flex flex-col items-center">
          <img src="/images/logo.jpeg" alt="Al-Haramain" className="h-12 object-contain mb-2 brightness-0 invert" />
          <span className="text-xs tracking-widest uppercase text-[#e2c78f] font-bold">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'overview' ? 'bg-[#5C131C] text-white shadow-md' : 'hover:bg-white/5 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="font-medium tracking-wide">Overview</span>
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'products' ? 'bg-[#5C131C] text-white shadow-md' : 'hover:bg-white/5 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <span className="font-medium tracking-wide">Products</span>
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'orders' ? 'bg-[#5C131C] text-white shadow-md' : 'hover:bg-white/5 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span className="font-medium tracking-wide">Orders</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-3 text-gray-400 hover:text-[#e2c78f] transition-colors w-full px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-medium tracking-wide text-sm uppercase">Storefront</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF8F5]">
        <header className="bg-white shadow-sm h-20 flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-2xl font-serif text-gray-800 capitalize">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'products' && 'Manage Products'}
            {activeTab === 'orders' && 'Recent Orders'}
          </h2>
          {activeTab === 'products' && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#5C131C] text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#a68953] transition-colors shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add New Product
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-[#5C131C]">
                  <div className="p-4 bg-[#5C131C]/10 rounded-full text-[#5C131C]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Revenue</p><p className="text-3xl font-serif font-bold text-gray-900">0 <span className="text-lg text-[#a68953]">EGP</span></p></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-[#a68953]">
                  <div className="p-4 bg-[#a68953]/10 rounded-full text-[#a68953]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>
                  <div><p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Active Orders</p><p className="text-3xl font-serif font-bold text-gray-900">0</p></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 border-l-4 border-l-[#25D366]">
                  <div className="p-4 bg-[#25D366]/10 rounded-full text-[#25D366]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                  <div><p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total Products</p><p className="text-3xl font-serif font-bold text-gray-900">{products.length}</p></div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
              {isLoading ? (
                <div className="p-10 text-center text-gray-500 font-serif">Loading products from Localhost...</div>
              ) : (
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-gray-200 text-[#a68953] text-xs uppercase tracking-widest">
                      <th className="py-4 px-6 font-bold">Image</th>
                      <th className="py-4 px-6 font-bold">Name</th>
                      <th className="py-4 px-6 font-bold">Category</th>
                      <th className="py-4 px-6 font-bold">Price</th>
                      <th className="py-4 px-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {products.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-gray-400">No products found in DB. Add your first product!</td></tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-50 hover:bg-[#FAF8F5]/50 transition-colors">
                          <td className="py-3 px-6"><img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" /></td>
                          <td className="py-3 px-6 font-medium text-gray-900">{product.name}</td>
                          <td className="py-3 px-6"><span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">{product.category}</span></td>
                          <td className="py-3 px-6 font-bold text-[#5C131C]">
                            {product.price} EGP 
                            {product.oldPrice && <span className="text-xs text-gray-400 line-through ml-2">{product.oldPrice}</span>}
                          </td>
                          <td className="py-3 px-6 flex justify-center gap-2">
                            {/* زرار التعديل */}
                            <button onClick={() => handleEditClick(product)} className="text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 p-2 rounded-lg transition-all" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            {/* زرار المسح */}
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-all" title="Delete">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-gray-200 text-[#a68953] text-xs uppercase tracking-widest">
                    <th className="py-4 px-6 font-bold">Order ID</th>
                    <th className="py-4 px-6 font-bold">Customer</th>
                    <th className="py-4 px-6 font-bold">Date</th>
                    <th className="py-4 px-6 font-bold">Total</th>
                    <th className="py-4 px-6 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">{order.id}</td>
                      <td className="py-4 px-6 font-medium">{order.customer}</td>
                      <td className="py-4 px-6 text-gray-500">{order.date}</td>
                      <td className="py-4 px-6 font-bold text-[#5C131C]">{order.total} EGP</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* الـ Modal بتاع الإضافة والتعديل */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveProduct} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAF8F5]">
              <h3 className="text-xl font-serif font-bold text-[#5C131C]">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors bg-white p-1.5 rounded-full shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Product Name <span className="text-red-500">*</span></label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Price (EGP) <span className="text-red-500">*</span></label>
                  <input required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Old Price (EGP)</label>
                  <input value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all text-gray-600">
                    <option value="Bag Charms">Bag Charms</option>
                    <option value="Body Splash">Body Splash</option>
                    <option value="Headbands">Headbands</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Image URL</label>
                  <input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#e2c78f] focus:border-transparent transition-all resize-none"></textarea>
              </div>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isSale} onChange={(e) => setFormData({...formData, isSale: e.target.checked})} className="w-4 h-4 text-[#5C131C] rounded border-gray-300 focus:ring-[#5C131C]" />
                  <span className="text-sm font-semibold text-gray-700">On Sale</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({...formData, isNew: e.target.checked})} className="w-4 h-4 text-[#5C131C] rounded border-gray-300 focus:ring-[#5C131C]" />
                  <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[#5C131C] hover:bg-[#8a1c29] shadow-md transition-colors">
                {editId ? 'Save Changes' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}