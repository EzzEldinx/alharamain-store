import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import al Storefront aly lsa m8yren esmo
import Storefront from './Storefront';

// 2. Import al AdminDashboard (Et2kd mn al path bta3ha 3andak)
// Law hya gwa folder components, hyb2a kda:
import AdminDashboard from './components/AdminDashboard'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Saf7et al Storefront al r2esya */}
        <Route path="/" element={<Storefront />} />
        
        {/* Saf7et al Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}