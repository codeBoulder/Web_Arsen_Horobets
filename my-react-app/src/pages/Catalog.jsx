import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

const Catalog = ({ onAddToCart }) => {
  const [allBooks, setAllBooks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllBooks(booksData);
      } catch (error) {
        console.error("Помилка завантаження книг:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = filter === 'All' 
    ? allBooks 
    : allBooks.filter(b => b.genre === filter || b.author === filter);

  if (loading) return <div className="loader">Завантаження каталогу...</div>;

  return (
    <section id="catalog">
      <div className="section-header">
        <h2>Каталог видань</h2>
        <div className="filter-container" style={{margin: '20px 0'}}>
          <label>Фільтр: </label>
          <select onChange={(e) => setFilter(e.target.value)} className="secondary-btn">
            <option value="All">Всі книги</option>
            <option value="IT">Програмування</option>
            <option value="Класика">Класика</option>
            <option value="Роберт Мартін">Роберт Мартін</option>
          </select>
        </div>
      </div>
      
      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <article className="book-card" key={book.id}>
              <div className="img-wrapper">
                {/* Якщо в БД img — це просто назва файлу, додаємо шлях */}
                <img src={process.env.PUBLIC_URL + '/' + book.img} alt={book.title} />
              </div>
              
              <div className="card-content">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <div className="card-footer">
                  <span className="price">{book.price} ₴</span>
                  <span className="rating">★ 5.0</span>
                </div>
                <button className="primary-btn" onClick={() => onAddToCart(book)}>
                  Додати в кошик
                </button>
              </div>
            </article>
          ))
        ) : (
          <p>Книг за цим фільтром не знайдено.</p>
        )}
      </div>
    </section>
  );
};

export default Catalog;