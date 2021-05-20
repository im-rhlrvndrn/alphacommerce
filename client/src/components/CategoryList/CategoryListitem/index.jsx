import axios from '../../../axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { maxWords } from '../../../utils/math_helpers';
import { useAuth } from '../../../context/AuthProvider';
import useWindowSize from '../../../hooks/useWindowSize';
import { useModal } from '../../../context/ModalProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// React components
import { CartIcon } from '../../../react_icons/CartIcon';
import { RightArrowIcon } from '../../../react_icons/RightArrowIcon';
import { OutlinedWishListIcon } from '../../../react_icons/OutlinedWishListIcon';

// styles
import './categorylistitem.scss';

export const CategoryListItem = ({ item }) => {
    const { theme } = useTheme();
    const _window = useWindowSize();
    const [{ currentUser }] = useAuth();
    const [_, modalDispatch] = useModal();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [existsInCart, setExistsInCart] = useState(false);
    const { _id, name, cover_image, variants, link, authors } = item;
    const [wishlistModal, setWishlistModal] = useState({ isActive: false });

    useEffect(() => {
        // const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart.data?.findIndex((productItem) => productItem.book._id === item._id) === -1
                ? false
                : true
        );
    }, [cart, currentUser._id]);

    const addToCart = async (items, multi = false) => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/carts/${cart._id}`, {
                multi: false,
                data: [...items],
                type: 'ADD_TO_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dataDispatch({ type: 'ADD_TO_CART', payload: data });
                dataDispatch({ type: 'SET_TOAST', payload: { data: toast } });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (id) => {
        try {
            const cartItemIndex = cart.data.findIndex(
                (item) => item.book._id === id && item.variant.type === 'paperback'
            );
            if (cartItemIndex === -1) return; // ! Error Handling with toast that says "This item doesn't exist in cart"

            const {
                data: {
                    success,
                    data: { _id, variant: variantResponse, checkout },
                    toast,
                },
            } = await axios.post(`/carts/${cart._id}`, {
                variant:
                    item.variants[item.variants.findIndex((item) => item.type === 'paperback')],
                _id: id,
                type: 'REMOVE_FROM_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dataDispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: {
                        _id,
                        variant: variantResponse,
                        checkout,
                    },
                });
                dataDispatch({ type: 'SET_TOAST', payload: { data: toast } });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='card'>
                <div className='cta'>
                    <div
                        className='cart-icon'
                        style={{
                            backgroundColor: existsInCart ? theme.constants.primary : theme.color,
                        }}
                        onClick={() =>
                            existsInCart
                                ? removeFromCart(_id)
                                : addToCart([
                                      {
                                          book: { ...item },
                                          quantity: 1,
                                          variant:
                                              item.variants[
                                                  item.variants.findIndex(
                                                      (item) => item.type === 'paperback'
                                                  )
                                              ],
                                      },
                                  ])
                        }
                    >
                        <CartIcon
                            style={{
                                fill: existsInCart ? theme.constants.dark : theme.dark_background,
                            }}
                        />
                    </div>
                    <div
                        className='bibliography-icon'
                        style={{ backgroundColor: theme.color }}
                        onClick={() => modalDispatch({ type: 'UPDATE_WISHLIST_MODAL' })}
                    >
                        <OutlinedWishListIcon style={{ fill: theme.dark_background }} />
                    </div>
                </div>
                <img className='stretch' src={cover_image?.url} alt={name} />
                <div
                    className='overlay flex flex-justify-sb flex-align-center'
                    style={{ backgroundColor: theme.dark_background }}
                >
                    <div className='info' style={{ color: theme.color }}>
                        <div className='title font-weight-md'>{maxWords(name, 12)}</div>
                        <div className='authors font-xs opac-6'>
                            By {maxWords(authors.join(', '), 12)}
                        </div>
                        <div className='price font-md font-weight-md'>₹ {variants[0].price}</div>
                    </div>
                    <Link
                        // target='_blank'
                        to={`/p/${_id}`}
                        className='text-align-center font-lg rounded icon-50 flex flex-align-center flex-justify-center'
                        style={{
                            backgroundColor: _window.width <= 768 ? 'transparent' : theme.color,
                            color: theme.dark_background,
                        }}
                    >
                        <RightArrowIcon
                            fill={_window.width <= 768 ? theme.color : theme.dark_background}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
};
