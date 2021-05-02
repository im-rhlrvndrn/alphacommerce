import axios from '../../axios';
import { useEffect, useState } from 'react';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './cartItem.scss';

// React components
import { Modal } from '../Modal';
import { AddToCart } from '../Buttons';
import { VariantModal } from '../Modals/VariantModal';

export const CartItem = ({ item }) => {
    const {
        book: { _id, name, cover_image },
        variant,
        total,
    } = item;
    const { theme } = useTheme();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [variantModal, setVariantModal] = useState({ isActive: false });

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
        <>
            <div className='cartItem_wrapper' style={{ color: theme.color }}>
                <div className='cartItem_container'>
                    <div className='cartItem_details'>
                        <p className='name'>{maxWords(name, 30)}</p>
                        <p className='total_price font-lg'>₹ {total}</p>
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
                                    setVariantModal((prevState) => ({
                                        ...prevState,
                                        isActive: !prevState.isActive,
                                    }))
                                }
                            >
                                Variant: <strong className='font-weight-md'>{variant?.type}</strong>
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
            {variantModal.isActive && (
                <Modal setIsModalActive={setVariantModal}>
                    <VariantModal
                        selectedVariant={{ cartItemId: item._id, variant, bookId: _id }}
                        variants={item.book.variants}
                        setVariantModal={setVariantModal}
                    />
                </Modal>
            )}
        </>
    );
};
