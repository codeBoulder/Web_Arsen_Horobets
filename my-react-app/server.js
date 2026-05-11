const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

let db;
try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    console.log("✅ Firebase Admin ініціалізовано успішно");
} catch (err) {
    console.error("❌ КРИТИЧНА ПОМИЛКА: Не вдалося завантажити serviceAccountKey.json або ініціалізувати Firebase:");
    console.error(err.message);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.post('/api/orders', async (req, res) => {
    const { userId, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Кошик порожній." });
    }

    try {
        const newOrder = {
            userId: userId || "guest",
            items,
            total,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('orders').add(newOrder);
        console.log(`✅ Замовлення створено: ${docRef.id}`);
        res.status(201).json({ message: "Успіх", orderId: docRef.id });
    } catch (error) {
        console.error("❌ ПОМИЛКА ПРИ ЗБЕРЕЖЕННІ ЗАМОВЛЕННЯ:");
        console.error(error); 
        res.status(500).json({ error: "Помилка сервера при збереженні", details: error.message });
    }
});

app.get('/api/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const snapshot = await db.collection('orders').where('userId', '==', userId).get();
        const orders = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            orders.push({
                id: doc.id,
                ...data,
                timeMs: data.createdAt ? data.createdAt.toMillis() : 0 
            });
        });
        orders.sort((a, b) => b.timeMs - a.timeMs);
        res.json(orders.map(({ timeMs, ...rest }) => rest));
    } catch (error) {
        console.error("❌ ПОМИЛКА ПРИ ОТРИМАННІ ЗАМОВЛЕНЬ:");
        console.error(error);
        res.status(500).json({ error: "Помилка сервера при читанні" });
    }
});

app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: "Маршрут API не знайдено" });
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));