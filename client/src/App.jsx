import { useEffect } from 'react';
import { useDataLayer } from './context/DataLayerContext';
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
        if (!getFromLocalStorage('currentUser')) saveToLocalStorage('currentUser', 'guest');
        if (!getFromLocalStorage('cart'))
            saveToLocalStorage('cart', [{ userId: 'guest', data: [] }]);
        if (!getFromLocalStorage('read_lists'))
            saveToLocalStorage('read_lists', [{ userId: 'guest', data: [] }]);

        fetch('/api/products')
            .then((res) => res.json())
            .then((response) =>
                dataDispatch({ type: 'UPDATEPRODUCTS', payload: response.products })
            );

        fetch('/api/genres')
            .then((res) => res.json())
            .then((response) => dataDispatch({ type: 'SET_GENRES', payload: response.genres }));

        fetch('/api/authors')
            .then((res) => res.json())
            .then((response) => dataDispatch({ type: 'SET_AUTHORS', payload: response.authors }));

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
                    <Route exact path='/readlist' component={ReadlistPage} />
                    <Route exact path='/readlist/:id' component={Readlist} />
                </Switch>
            </Router>
        </>
    );
};
