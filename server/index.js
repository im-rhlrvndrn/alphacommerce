require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products.router');
const readlistRoutes = require('./routes/readlists.router');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.user = { id: '' };
    next();
});
app.use('/products', productRoutes);
app.use('/readlists', readlistRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Hello everyone' });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log('MongoDB connection established')
);
