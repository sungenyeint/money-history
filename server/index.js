const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const verifyFirebaseToken = require("./middleware/authMiddleware");
require('dotenv').config()

const app = express();
app.use(cors({
    origin: "http://localhost:3000", // Replace with your client URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Middleware to verify Firebase ID token
app.get("/api/auth", verifyFirebaseToken, (req, res) => {
    const user = req.user;
    res.json({ message: "Authenticated successfully", user });
});

app.get('/api', (req, res) => {
    res.send({ message: 'Hello from backend!' });
});

const CategoryRoutes = require('./routes/CategoryRoutes');
const TransactionRoutes = require('./routes/TransactionRoutes');
app.use('/api/categories', verifyFirebaseToken, CategoryRoutes);
app.use('/api/transactions', verifyFirebaseToken, TransactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
