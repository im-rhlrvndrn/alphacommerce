import axios from '../../../axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './addtocart.scss';

// React components
import { QuantityButtons } from '../';

export const AddToCart = ({ item, variant, style }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [existsInCart, setExistsInCart] = useState(false);

    useEffect(() => {
        // const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart.data?.findIndex(
                (cartItem) =>
                    cartItem.book._id === item._id && cartItem.variant.type === variant.type
            ) === -1
                ? false
                : true
        );
        console.log('---- Ran useEffect in AddToCart ----');
    }, [cart.data, currentUser._id, variant.type]);

    const addToCart = async (items, multi = false) => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/carts/${cart._id}`, {
                multi: false,
                data: [...items],
                type: 'ADD_TO_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dataDispatch({ type: 'ADD_TO_CART', payload: data });
                dataDispatch({ type: 'SET_TOAST', payload: { data: toast } });
            }
        } catch (error) {
            console.error(error);
        }
    };

    console.log('existsInCart: ', { existsInCart });
    return (
        <>
            {!existsInCart ? (
                <button
                    style={{ backgroundColor: theme.color, color: theme.dark_background, ...style }}
                    className='add-to-cart mt-2 font-weight-md font-s'
                    onClick={() =>
                        addToCart([
                            {
                                book: { ...item },
                                quantity: 1,
                                variant:
                                    item.variants[
                                        item.variants.findIndex(
                                            (item) => item.type === variant.type
                                        )
                                    ],
                                // total: getSelectedVariantPrice(item.variants),
                            },
                        ])
                    }
                >
                    Add to cart
                </button>
            ) : (
                <QuantityButtons productId={item._id} variant={variant} />
            )}
        </>
    );
};
