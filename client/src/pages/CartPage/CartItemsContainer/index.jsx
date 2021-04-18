import { useHistory } from 'react-router';
import { useTheme } from '../../../context/ThemeProvider';

// React components
import { CartItems } from './CartItems';

export const CartItemsContainer = ({ cart }) => {
    const history = useHistory();
    const { theme } = useTheme();

    return (
        <div className='cart'>
            <h1 className='font-xl' style={{ color: theme.color }}>
                Items in my cart ({cart.length})
            </h1>
            {cart.length === 0 ? (
                <p style={{ color: theme.color }}>No items in cart</p>
            ) : (
                <div className='cart-items' style={{ color: theme.color }}>
                    <div className='cart-items-heading'>
                        <span>item</span>
                        <span>price</span>
                        <span>quantity</span>
                        <span>total price</span>
                        <span>remove</span>
                    </div>
                    <CartItems cart={cart} />
                </div>
            )}
            <button
                className='continue-shopping mt-2 mr-2 font-s'
                style={{
                    backgroundColor: theme.light_background,
                    color: theme.color,
                }}
                onClick={() => history.push('/')}
            >
                Continue Shopping
            </button>
        </div>
    );
};
