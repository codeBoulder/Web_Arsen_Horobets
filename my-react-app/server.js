const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));


app.post('/api/orders', async (req, res) => {
    const { userId, items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Кошик порожній. Додайте товари для оформлення замовлення." });
    }

    try {
        const newOrder = {
            userId: userId || "guest",
            items,
            total,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('orders').add(newOrder);
        res.status(201).json({ message: "Замовлення успішно оформлено", orderId: docRef.id });
    } catch (error) {
        res.status(500).json({ error: "Помилка при збереженні замовлення." });
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

        const sortedOrders = orders.map(({ timeMs, ...rest }) => rest);

        res.json(sortedOrders);
    } catch (error) {
        res.status(500).json({ error: "Помилка при отриманні замовлень." });
    }
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));