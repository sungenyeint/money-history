const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from backend!' });
});

const incomeRoutes = require('./routes/incomeCategoryRoutes');
app.use('/api/income-categories', incomeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
