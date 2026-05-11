import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

const MyAccount = ({ user }) => {
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
        } else {
          console.error("Помилка від сервера:", data.error);
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
    <div>
      <h2>Мої замовлення</h2>
      {loading ? (
        <p>Завантаження...</p>
      ) : orders.length === 0 ? (
        <p>У вас ще немає замовлень.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Замовлення ID:</strong> {order.id} <br />
              <strong>Сума:</strong> {order.total} грн <br />
              <strong>Товари:</strong> {order.items.length} шт.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAccount;

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
    <section id="account">
      <h2>{user ? "Особистий кабінет" : "Вхід до системи"}</h2>
      
      <div className="account-grid">
        {user ? (
          <div className="account-card profile">
            <div className="avatar" style={{background: '#4f46e5', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
              {user.email.substring(0, 2).toUpperCase()}
            </div>
            <h3>Арсен Горобець</h3>
            <p>{user.email}</p>
            <p>Студент Львівської політехніки (ОІ-24)</p>
            <button className="secondary-btn" onClick={handleLogout} style={{marginTop: '20px'}}>
              Вийти з акаунту
            </button>
          </div>
        ) : (
          <div className="account-card profile">
            <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <input 
                type="email" 
                placeholder="Електронна пошта" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="input-field"
              />
              <input 
                type="password" 
                placeholder="Пароль" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="input-field"
              />
              <button type="submit" className="primary-btn">
                {isRegistering ? "Зареєструватися" : "Увійти"}
              </button>
            </form>
            <p style={{marginTop: '15px', fontSize: '0.9rem'}}>
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