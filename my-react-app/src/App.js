import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from './firebase';

import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import './style.css';




function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (book) => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт!");
      return;
    }
    setCart((prev) => [...prev, { ...book, qty: 1 }]);
  };

  return (
    <Router>
      <header>
        <div className="header-container">
          <h1>Естетика.</h1>
          {}

          <nav>
            <ul>
              <li><Link to="/">Каталог</Link></li>
              <li><Link to="/cart">Кошик ({cart.length})</Link></li>
              <li><Link to="/profile">Мій акаунт</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog onAddToCart={addToCart} user={user} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </main>
      {}
    </Router>
  );
}

export default App;