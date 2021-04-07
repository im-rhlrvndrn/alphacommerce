// React components
import { CartItem } from '../../../../components/CartItem';

export const CartItems = ({ cart }) => {
    return (
        <>
            {cart.map((cartItem) => (
                <CartItem key={cartItem.id} item={cartItem} />
            ))}
        </>
    );
};
