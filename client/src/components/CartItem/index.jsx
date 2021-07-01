import axios from '../../axios';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useModal } from '../../context/ModalProvider';
import { useDataLayer } from '../../context/DataProvider';

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
    const [_, modalDispatch] = useModal();
    const { theme } = useTheme();
    const [{ cart }, dataDispatch] = useDataLayer();

    const removeFromCart = async (id) => {
        const {
            data: { success, data, toast },
        } = await axios.post(`/carts/${cart._id}`, {
            variant,
            _id: id,
            type: 'REMOVE_FROM_CART',
            cart: cart._id === 'guest' ? cart : null,
        });
        if (success) {
            dataDispatch({
                type: 'REMOVE_FROM_CART',
                payload: {
                    _id: data._id,
                    variant: data.variant,
                    checkout: data.checkout,
                },
            });
            dataDispatch({ type: 'SET_TOAST', payload: { data: toast } });
        }
    };

    return (
        <>
            <div className='cartItem_wrapper' style={{ color: theme.color }}>
                <div className='cartItem_container'>
                    <div className='cartItem_details'>
                        <p className='name'>{maxWords(name, 30)}</p>
                        <p className='total_price text-lg'>₹ {total}</p>
                        {/* <p className='price'>
                        ₹ {getSelectedVariantPrice(item.book.variants, variant.type)}
                    </p> */}
                        <div className='quantity_container'>
                            <AddToCart item={item?.book} variant={variant} />
                            <button
                                className='variant'
                                style={{
                                    backgroundColor: theme.color,
                                    color: theme.dark_background,
                                }}
                                onClick={() =>
                                    modalDispatch({
                                        type: 'UPDATE_VARIANT_MODAL',
                                        payload: {
                                            state: {
                                                selectedVariant: {
                                                    cartItemId: item._id,
                                                    variant,
                                                    bookId: _id,
                                                },
                                                variants: item.book.variants,
                                            },
                                        },
                                    })
                                }
                            >
                                Variant: <strong className='font-semibold'>{variant?.type}</strong>
                            </button>
                        </div>
                    </div>
                    <img src={cover_image?.url} alt={name} />
                </div>
                <div className='cartItem_cta'>
                    <button
                        className='remove_item'
                        onClick={() => removeFromCart(_id)}
                        style={{ color: theme.color }}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </>
    );
};
