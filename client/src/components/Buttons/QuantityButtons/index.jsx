import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './quantitybuttons.scss';
import axios from '../../../axios';

export const QuantityButtons = ({ productId, variant }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [quantity, setQuantity] = useState();
    const [{ cart }, dataDispatch] = useDataLayer();

    const updateCart = async (inc) => {
        try {
            const {
                data: {
                    success,
                    data: { _id, updatedItem, checkout },
                    toast,
                },
            } = await axios.post(`/carts/${cart._id}`, {
                _id: productId,
                variant,
                inc,
                cart: cart._id === 'guest' ? cart : null,
                type: 'UPDATE_QUANTITY',
            });
            if (success)
                dataDispatch({
                    type: 'UPDATE_CART_ITEM',
                    payload: {
                        _id,
                        updatedItem,
                        checkout,
                    },
                });
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async () => {
        try {
            const cartItemIndex = cart.data.findIndex(
                (item) => item.book._id === productId && item.variant.type === variant.type
            );
            if (cartItemIndex === -1) return; // ! Error Handling with toast that says "This item doesn't exist in cart"

            const {
                data: {
                    success,
                    data: { _id, variant: variantResponse, checkout },
                    toast,
                },
            } = await axios.post(`/carts/${cart._id}`, {
                variant,
                _id: productId,
                type: 'REMOVE_FROM_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success)
                dataDispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: {
                        _id,
                        variant: variantResponse,
                        checkout,
                    },
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // const userIndex = cart.findIndex((item) => item.userId === currentUser);
        const cartItemIndex = cart.data.findIndex(
            (item) => item.book._id === productId && item.variant.type === variant.type
        );
        setQuantity((prevState) => cart.data[cartItemIndex].quantity);
    }, [cart.data, variant.type]);

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
