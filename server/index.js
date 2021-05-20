require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
// const verifyToken = require('./middlewares');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.router');
const cartRoutes = require('./routes/carts.router');
const userRoutes = require('./routes/users.router');
const bookRoutes = require('./routes/books.router');
const genresRoutes = require('./routes/genres.router');
const wishlistRoutes = require('./routes/wishlists.router');

const app = express();
const PORT = process.env.PORT || 4000;

app.set('Access-Control-Allow-Credentials', true);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//     req.user = { id: '' };
//     next();
// });
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/genres', genresRoutes);
app.use('/wishlists', wishlistRoutes);
app.get('/', (req, res) => {
    res.json({ message: 'Hello everyone' });
});

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            },
            () => console.log('MongoDB connection established')
        );
    } catch (error) {
        console.error('Error connecting to MongoDB => ', error);
    }
})();
