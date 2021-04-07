import { useAuth } from '../../context/AuthContext';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// styles
import './cartItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const CartItem = ({ item: { id, name, coverImage, quantity, price, totalPrice } }) => {
    const { theme } = useTheme();
    // const [auth, authDispatch] = useAuth();
    const [data, dataDispatch] = useDataLayer();

    const updateQuantity = (id, inc) => {
        // authDispatch({ type: 'UPDATEUSERCART', payload: { id, inc } });
        dataDispatch({ type: 'UPDATECARTITEM', payload: { id, inc } });
    };
    const removeFromCart = (id) => dataDispatch({ type: 'REMOVEFROMCART', payload: id });

    return (
        <div className='cartItem' style={{ color: theme.color }}>
            <img src={coverImage?.url} alt={name} />
            <p className='cartItem_name'>{maxWords(name, 30)}</p>
            <p className='cartItem_price'>₹ {price}</p>
            <div className='quantity-container'>
                <AddToCart item={{ id, name, coverImage, quantity, price, totalPrice }} />
            </div>
            <p className='cartItem_total_price'>₹ {totalPrice}</p>
            <button
                className='remove-item'
                onClick={() => removeFromCart(id)}
                style={{ color: theme.color }}
            >
                X
            </button>
        </div>
    );
};
