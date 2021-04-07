import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useDataLayer } from '../../../context/DataLayerContext';

// styles
import './addtocart.scss';

// React components
import { QuantityButtons } from '../';

export const AddToCart = ({ item, style }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [existsInCart, setExistsInCart] = useState(false);

    useEffect(() => {
        const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart[userIndex].data?.findIndex((productItem) => productItem.id === item.id) === -1
                ? false
                : true
        );
    }, [cart, currentUser]);

    const addToCart = (item) => {
        dataDispatch({ type: 'ADDTOCART', payload: item });
    };

    console.log('existsInCart: ', { existsInCart });
    return (
        <>
            {!existsInCart ? (
                <button
                    style={{ backgroundColor: theme.color, color: theme.dark_background, ...style }}
                    className='add-to-cart mt-2 font-weight-md font-s'
                    onClick={() =>
                        addToCart({
                            ...item,
                            price: item.price.value,
                            totalPrice: item.price.value,
                            quantity: 1,
                        })
                    }
                >
                    Add to cart
                </button>
            ) : (
                <QuantityButtons productId={item.id} />
            )}
        </>
    );
};
