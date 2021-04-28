import axios from './axios';
import { useEffect } from 'react';
import { useAuth } from './context/AuthProvider';
import { useDataLayer } from './context/DataProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Styles
import './global.scss';

// React components
import { Nav } from './components/Nav';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { Wishlist } from './pages/Wishlist';
import { ListingPage } from './pages/ListingPage';
import { ProductPage } from './pages/ProductPage';
import { WishlistPage } from './pages/WishlistPage';
import Cookies from 'js-cookie';

export const App = () => {
    const [{ currentUser }, authDispatch] = useAuth();
    const [{ books, authors, genres }, dataDispatch] = useDataLayer();
    const [saveToLocalStorage, getFromLocalStorage] = useLocalStorage();

    const getBooks = async () => {
        try {
            if (books.length === 0) {
                const {
                    data: { success, books },
                } = await axios.get('/books');

                if (success) {
                    dataDispatch({
                        type: 'STOREBOOKS',
                        payload: books.map((book) => ({
                            ...book,
                            variants: book.variants.map((variant) =>
                                variant.type === 'paperback'
                                    ? { ...variant, isSelected: true }
                                    : { ...variant, isSelected: false }
                            ),
                        })),
                    });
                }
            }
            dataDispatch({
                type: 'SET_AUTHORS',
                payload: books.reduce((acc, curVal) => [...acc, ...curVal.authors], []),
            });
            dataDispatch({
                type: 'SET_GENRES',
                payload: books.reduce((acc, curVal) => [...acc, ...curVal.genres], []),
            });
        } catch (error) {
            console.error(error);
        }
    };

    // const getUser = async () => {
    //     const userId = Cookies.get('userId');
    //     try {
    //         const {
    //             data: { success, user },
    //         } = await axios.get(`/users/${userId}`);
    //         console.log('USER DATA => ', { success, user, cookie: userId });

    //         if (success) {
    //             authDispatch({ type: 'LOGIN', payload: user });
    //             const {
    //                 data: { success, data, toast },
    //             } = await axios.get(`/carts/${user.cart._id}`);

    //             console.log('CART DATA => ', { success, data });
    //             if (success) dataDispatch({ type: 'SET_CART', payload: { cart: data.cart } });
    //             dataDispatch({ type: 'SET_WISHLISTS', payload: { wishlists: user.wishlists } });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        // getUser();
        if (!getFromLocalStorage('currentUser'))
            saveToLocalStorage('currentUser', {
                _id: 'guest',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            });
        if (!getFromLocalStorage('cart'))
            saveToLocalStorage('cart', {
                _id: 'guest',
                user: 'guest',
                data: [],
                checkout: { subtotal: 0, total: 0 },
            });
        if (!getFromLocalStorage('wishlists')) saveToLocalStorage('wishlists', []);

        getBooks();

        // fetch('/api/products')
        //     .then((res) => res.json())
        //     .then((response) =>
        //         dataDispatch({ type: 'UPDATEPRODUCTS', payload: response.products })
        //     );

        // fetch('/api/genres')
        //     .then((res) => res.json())
        //     .then((response) => dataDispatch({ type: 'SET_GENRES', payload: response.genres }));

        // fetch('/api/authors')
        //     .then((res) => res.json())
        //     .then((response) => dataDispatch({ type: 'SET_AUTHORS', payload: response.authors }));

        // document.title('TheBookStore');
    }, []);

    return (
        <>
            <Router>
                <Nav />
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/p' component={ListingPage} />
                    <Route exact path='/p/:id' component={ProductPage} />
                    <Route exact path='/cart' component={CartPage} />
                    <Route exact path='/wishlists' component={WishlistPage} />
                    <Route exact path='/wishlists/:id' component={Wishlist} />
                </Switch>
            </Router>
        </>
    );
};
