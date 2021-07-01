import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// React components
import { CartItems } from './CartItems';

export const CartItemsContainer = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [{ cart }] = useDataLayer();

    return (
        <div className='cart'>
            <div className='text-md cart-heading' style={{ color: theme.color }}>
                My bag <span className='font-light'>{cart.data.length} item(s)</span>
            </div>
            {cart.data.length === 0 ? (
                <p style={{ color: theme.color }}>No items in cart</p>
            ) : (
                <div className='cart-items' style={{ color: theme.color }}>
                    {/* <div className='cart-items-heading'>
                        <span>item</span>
                        <span>price</span>
                        <span>quantity</span>
                        <span>total price</span>
                        <span>remove</span>
                    </div> */}
                    <CartItems />
                </div>
            )}
            <button
                className='continue-shopping mt-8 mr-8 text-s'
                style={{
                    backgroundColor: theme.light_background,
                    color: theme.color,
                }}
                onClick={() => navigate('/')}
            >
                Continue Shopping
            </button>
        </div>
    );
};
