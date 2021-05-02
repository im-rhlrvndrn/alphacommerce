import { useEffect } from 'react';
import { useDataLayer } from '../../../../context/DataProvider';

// React components
import { CartItem } from '../../../../components/CartItem';

export const CartItems = () => {
    const [{ cart }] = useDataLayer();

    useEffect(() => {}, [cart.checkout]);

    return (
        <>
            {cart.data.map((cartItem) => (
                <CartItem key={cartItem.book._id} item={cartItem} />
            ))}
        </>
    );
};
