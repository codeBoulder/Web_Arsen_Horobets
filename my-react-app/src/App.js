import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // ДОДАЙ ЦЕЙ ІМПОРТ
import { auth, db } from './firebase'; // ДОДАЙ db СЮДИ

import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import './style.css';

// 1. ВИЗНАЧАЄМО ФУНКЦІЮ ТУТ (ПОЗА КОМПОНЕНТОМ)
const seedDatabase = async () => {
  const books = [
    { title: "Чистий код", author: "Роберт Мартін", price: 850, genre: "IT", img: "images/book3.jpg" },
    { title: "Чиста архітектура", author: "Роберт Мартін", price: 920, genre: "IT", img: "images/book4.jpg" },
    { title: "Кобзар", author: "Тарас Шевченко", price: 650, genre: "Класика", img: "images/book1.jpg" },
    { title: "Не озирайся і мовчи", author: "Макс Кідрук", price: 290, genre: "Трилер", img: "images/book2.jpg" },
    { title: "Гаррі Поттер", author: "Дж. К. Роулінг", price: 350, genre: "Фентезі", img: "images/book5.jpg" }
  ];

  try {
    const booksCol = collection(db, "books");
    for (const book of books) {
      await addDoc(booksCol, book);
    }
    alert("Книги успішно додані в Firestore!");
  } catch (e) {
    console.error("Помилка завантаження: ", e);
  }
};

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
          {/* ТИМЧАСОВА КНОПКА ДЛЯ ЗАПОВНЕННЯ БАЗИ */}
          <button onClick={seedDatabase} style={{padding: '5px', fontSize: '10px'}}>
            Заповнити БД (Seed)
          </button>
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
      {/* ... footer ... */}
    </Router>
  );
}

export default App;