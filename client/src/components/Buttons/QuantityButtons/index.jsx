import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './quantitybuttons.scss';

export const QuantityButtons = ({ productId }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [quantity, setQuantity] = useState();
    const [{ cart }, dataDispatch] = useDataLayer();

    const updateCart = (inc) => {
        dataDispatch({ type: 'UPDATECARTITEM', payload: { _id: productId, inc } });
    };

    const removeFromCart = () => dataDispatch({ type: 'REMOVEFROMCART', payload: productId });

    useEffect(() => {
        // const userIndex = cart.findIndex((item) => item.userId === currentUser);
        const cartItemIndex = cart.data.findIndex((item) => item._id === productId);
        setQuantity((prevState) => cart.data[cartItemIndex].quantity);
    }, [cart]);

    return (
        <div className='quantityBtns'>
            <button
                style={{ backgroundColor: theme.color, color: theme.dark_background }}
                onClick={() => (quantity === 1 ? removeFromCart() : updateCart(false))}
            >
                {quantity === 1 ? 'x' : '-'}
            </button>
            <input
                readOnly
                type='number'
                value={quantity}
                style={{ color: theme.color }}
                // onChange={(event) => setQuantity((prevState) => event.target.value)}
            />
            <button
                style={{ backgroundColor: theme.color, color: theme.dark_background }}
                onClick={() => updateCart(true)}
            >
                +
            </button>
        </div>
    );
};
