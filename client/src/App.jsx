import { useEffect } from 'react';
import { useDataLayer } from './context/DataProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Styles
import './global.scss';

// React components
import { Nav } from './components/Nav';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { Readlist } from './pages/Readlist';
import { ListingPage } from './pages/ListingPage';
import { ProductPage } from './pages/ProductPage';
import { ReadlistPage } from './pages/ReadlistPage';

export const App = () => {
    const [_, dataDispatch] = useDataLayer();
    const [saveToLocalStorage, getFromLocalStorage] = useLocalStorage();

    useEffect(() => {
        if (!getFromLocalStorage('currentUser'))
            saveToLocalStorage('currentUser', {
                _id: 'guestUser',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            });
        if (!getFromLocalStorage('cart'))
            saveToLocalStorage('cart', { _id: 'guestCart', user: 'guestUser', data: [] });
        if (!getFromLocalStorage('wishlists')) saveToLocalStorage('wishlists', []);
        // if (!getFromLocalStorage('users'))
        //     saveToLocalStorage('users', [
        //         {
        //             id: 'guest',
        //             username: { text: 'guest' },
        //             password: { text: 'guest123' },
        //             full_name: { text: 'Guest user' },
        //             email: null,
        //         },
        //     ]);

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
                    <Route exact path='/wishlists' component={ReadlistPage} />
                    <Route exact path='/wishlists/:id' component={Readlist} />
                </Switch>
            </Router>
        </>
    );
};
