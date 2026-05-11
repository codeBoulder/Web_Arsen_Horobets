import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/orders/${user.uid}`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        }
      } catch (e) {
        console.error("Помилка з'єднання: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="orders-section" style={{marginTop: '30px'}}>
      <h3>Мої замовлення</h3>
      {loading ? (
        <p>Завантаження замовлень...</p>
      ) : orders.length === 0 ? (
        <p>У вас ще немає замовлень.</p>
      ) : (
        <div className="orders-grid" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {orders.map((order) => (
            <div key={order.id} className="order-card" style={{border: '1px solid #eee', padding: '15px', borderRadius: '8px'}}>
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Сума:</strong> {order.total} грн</p>
              <p><strong>Товари:</strong> {order.items.map(i => i.title).join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profile = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Акаунт створено!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <section id="account" style={{padding: '40px 20px'}}>
      <h2 style={{textAlign: 'center', marginBottom: '30px'}}>
        {user ? "Особистий кабінет" : "Вхід до системи"}
      </h2>
      
      <div className="account-container" style={{maxWidth: '600px', margin: '0 auto'}}>
        {user ? (
          <div className="profile-wrapper">
            {/* Блок інформації про тебе */}
            <div className="account-card profile" style={{background: '#f9fafb', padding: '25px', borderRadius: '12px', textAlign: 'center'}}>
              <div className="avatar" style={{background: '#4f46e5', color: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.2rem', fontWeight: 'bold'}}>
                {user.email.substring(0, 2).toUpperCase()}
              </div>
              <p style={{color: '#666'}}>{user.email}</p>
              <button className="secondary-btn" onClick={handleLogout} style={{marginTop: '20px', padding: '10px 20px'}}>
                Вийти з акаунту
              </button>
            </div>

            {/* Блок історії замовлень (Варіант 5) */}
            <OrderHistory user={user} />
          </div>
        ) : (
          <div className="account-card auth-form" style={{background: '#f9fafb', padding: '25px', borderRadius: '12px'}}>
            <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <input 
                type="email" 
                placeholder="Електронна пошта" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
              <input 
                type="password" 
                placeholder="Пароль" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{padding: '12px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
              <button type="submit" className="primary-btn" style={{padding: '12px', cursor: 'pointer'}}>
                {isRegistering ? "Зареєструватися" : "Увійти"}
              </button>
            </form>
            <p style={{marginTop: '20px', textAlign: 'center', fontSize: '0.9rem'}}>
              {isRegistering ? "Вже маєте акаунт?" : "Немає акаунту?"} 
              <span 
                onClick={() => setIsRegistering(!isRegistering)} 
                style={{color: '#4f46e5', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold'}}
              >
                {isRegistering ? "Увійти" : "Створити зараз"}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;