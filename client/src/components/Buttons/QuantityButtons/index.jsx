import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './quantitybuttons.scss';
import { useCart } from '../../../hooks/useCart';

export const QuantityButtons = ({ productId, variant }) => {
    const { theme } = useTheme();
    const [quantity, setQuantity] = useState();
    const [{ cart }, dataDispatch] = useDataLayer();
    const { removeFromCart, updateCart } = useCart();
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const cartItemIndex = cart.data.findIndex(
            (item) => item.book._id === productId && item.variant.type === variant.type
        );
        setQuantity((prevState) => cart.data[cartItemIndex].quantity);
        setDisabled(false);
    }, [cart.data, variant.type]);

    return (
        <div className='quantityBtns'>
            <button
                disabled={disabled}
                className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: theme.color, color: theme.dark_background }}
                onClick={() => {
                    setDisabled(true);
                    quantity === 1
                        ? removeFromCart({ id: productId, variant })
                        : updateCart({ id: productId, variant, inc: false });
                }}>
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
                disabled={disabled}
                className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ backgroundColor: theme.color, color: theme.dark_background }}
                onClick={() => updateCart({ id: productId, variant, inc: true })}>
                +
            </button>
        </div>
    );
};
