import React from 'react';

const Cart = ({ cart = [], setCart, user }) => {
  const safeCart = Array.isArray(cart) ? cart : [];

  const updateQty = (id, delta) => {
    if (!setCart) return;
    setCart(prev => {
      const prevCart = Array.isArray(prev) ? prev : [];
      return prevCart.map(item => 
        item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
      );
    });
  };

  const removeItem = (id) => {
    if (!setCart) return;
    setCart(prev => {
      const prevCart = Array.isArray(prev) ? prev : [];
      return prevCart.filter(item => item.id !== id);
    });
  };

  const total = safeCart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Увійдіть, щоб оформити замовлення!");
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          items: safeCart,
          total: total
        })
      });

      const textResponse = await response.text();
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch(e) {
        console.error("Сервер повернув не JSON:", textResponse);
        alert("Помилка! Ви точно відкрили сайт через localhost:5000?");
        return;
      }

      if (response.ok) {
        alert(`Дякуємо, ${user.email}! Замовлення оформлено. ID: ${result.orderId}`);
        if (setCart) setCart([]); 
      } else {
        alert("Помилка від сервера: " + result.error); 
      }
    } catch (e) {
      console.error("Помилка при з'єднанні з сервером: ", e);
      alert("Не вдалося відправити замовлення на сервер.");
    }
  };

  return (
    <section id="cart">
      <h2>Ваш кошик</h2>
      <div className="cart-container">
        
        {safeCart.length === 0 ? (
          <p style={{textAlign: 'center', padding: '20px', color: '#666'}}>
            Кошик порожній. Перейдіть до каталогу!
          </p>
        ) : (
          <>
            {safeCart.map((item, index) => (
              <div className="cart-item" key={item.id || index} style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0'}}>
                <div className="item-info">
                  <h4>{item.title || "Невідомий товар"}</h4>
                  <p className="item-price">{item.price || 0} ₴</p>
                </div>
                <div className="item-actions" style={{display: 'flex', alignItems: 'center'}}>
                  <button onClick={() => updateQty(item.id, -1)} className="qty-btn" style={{padding: '5px 10px'}}>-</button>
                  <span className="qty-val" style={{margin: '0 10px'}}> {item.qty || 1} </span>
                  <button onClick={() => updateQty(item.id, 1)} className="qty-btn" style={{padding: '5px 10px'}}>+</button>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    style={{color: '#ff4d4d', marginLeft: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        
        <div className="cart-summary" style={{marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '20px'}}>
          <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
            Разом до сплати: <span className="total-price" style={{color: '#4f46e5'}}>{total} ₴</span>
          </p>
        </div>

        <button 
          className="primary-btn" 
          onClick={handlePlaceOrder}
          style={{width: '100%', marginTop: '20px', padding: '15px'}}
        >
          {user ? "Оформити замовлення" : "Увійдіть, щоб оформити замовлення"}
        </button>
      </div>
    </section>
  );
};

export default Cart;