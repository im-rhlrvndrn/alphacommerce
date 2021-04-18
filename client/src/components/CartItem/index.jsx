import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './cartItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const CartItem = ({ item: { _id, name, cover_image, quantity, price, totalPrice } }) => {
    const { theme } = useTheme();
    const [data, dataDispatch] = useDataLayer();

    const updateQuantity = (id, inc) => {
        dataDispatch({ type: 'UPDATECARTITEM', payload: { id, inc } });
    };
    const removeFromCart = (id) => dataDispatch({ type: 'REMOVEFROMCART', payload: id });

    return (
        <div className='cartItem' style={{ color: theme.color }}>
            <img src={cover_image?.url} alt={name} />
            <p className='cartItem_name'>{maxWords(name, 30)}</p>
            <p className='cartItem_price'>₹ {price}</p>
            <div className='quantity-container'>
                <AddToCart item={{ _id, name, cover_image, quantity, price, totalPrice }} />
            </div>
            <p className='cartItem_total_price'>₹ {totalPrice}</p>
            <button
                className='remove-item'
                onClick={() => removeFromCart(_id)}
                style={{ color: theme.color }}
            >
                X
            </button>
        </div>
    );
};
