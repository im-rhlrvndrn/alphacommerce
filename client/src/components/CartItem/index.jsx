import axios from '../../axios';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';
import { getSelectedVariantPrice } from '../../utils';

// styles
import './cartItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const CartItem = ({ item }) => {
    const {
        book: { _id, name, cover_image },
        variant,
        total,
    } = item;
    const { theme } = useTheme();
    const [{ cart }, dataDispatch] = useDataLayer();

    const removeFromCart = async (id) => {
        if (cart._id === 'guest') {
            const {
                data: {
                    success,
                    data: { _id, variant, checkout },
                    toast,
                },
            } = await axios.delete(`/carts/${cart._id}`, {
                variant,
                _id: id,
                type: 'REMOVE_FROM_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success)
                dataDispatch({
                    type: 'REMOVEFROMCART',
                    payload: {
                        _id,
                        variant,
                        checkout: checkout,
                    },
                });
        } else {
            dataDispatch({
                type: 'REMOVEFROMCART',
                payload: {
                    _id: id,
                    variant,
                    checkout: {
                        subtotal: +cart.checkout.subtotal - +total,
                        total: +cart.checkout.total - +total,
                    },
                },
            });
        }
    };

    return (
        <div className='cartItem' style={{ color: theme.color }}>
            <img src={cover_image?.url} alt={name} />
            <p className='cartItem_name'>{maxWords(name, 30)}</p>
            <p className='cartItem_price'>
                ₹ {getSelectedVariantPrice(item.book.variants, variant.type)}
            </p>
            <div className='quantity-container'>
                <AddToCart item={item?.book} variant={variant} />
            </div>
            <p className='cartItem_total_price'>₹ {total}</p>
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
