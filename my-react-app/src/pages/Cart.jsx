import React from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';

const Cart = ({ cart, setCart, user }) => {
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

const handlePlaceOrder = async () => {
  if (!user) {
    alert("Увійдіть, щоб оформити замовлення!");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userEmail: user.email,
      items: cart,
      totalPrice: total,
      date: new Date().toISOString()
    });

    alert(`Дякуємо, ${user.email}! Замовлення оформлено та збережено в БД.`);
    setCart([]); 
  } catch (e) {
    console.error("Помилка при оформленні: ", e);
  }
};
  return (
    <section id="cart">
      <h2>Ваш кошик</h2>
      <div className="cart-container">
        {cart.length === 0 ? (
          <p style={{textAlign: 'center', padding: '20px'}}>Кошик порожній. Час додати дещо «естетичне»!</p>
        ) : (
          <>
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="item-info">
                  <div>
                    <h4>{item.title}</h4>
                    <p className="item-price">{item.price} ₴</p>
                  </div>
                </div>
                <div className="item-actions">
                  <button onClick={() => updateQty(item.id, -1)} className="qty-btn">-</button>
                  <span className="qty-val"> {item.qty} </span>
                  <button onClick={() => updateQty(item.id, 1)} className="qty-btn">+</button>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    style={{color: '#ff4d4d', marginLeft: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-summary" style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
              <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                Разом до сплати: <span className="total-price" style={{color: '#4f46e5'}}>{total} ₴</span>
              </p>
            </div>

            {/* Логіка кнопки згідно з варіантом завдання */}
            <button 
              className="primary-btn" 
              onClick={handlePlaceOrder}
              style={{width: '100%', marginTop: '20px', padding: '15px'}}
            >
              {user ? "Оформити замовлення" : "Увійдіть, щоб оформити замовлення"}
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;