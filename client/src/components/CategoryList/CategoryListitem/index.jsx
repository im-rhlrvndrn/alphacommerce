import { v4 } from 'uuid';
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
import { useCart } from '../../../hooks/useCart';

export const CategoryListItem = ({ item }) => {
    const { theme } = useTheme();
    const _window = useWindowSize();
    const [{ currentUser }] = useAuth();
    const [_, modalDispatch] = useModal();
    const { addToCart, removeFromCart } = useCart();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [existsInCart, setExistsInCart] = useState(false);
    const { _id, name, cover_image, variants, link, authors } = item;

    useEffect(() => {
        // const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart.data?.findIndex((productItem) => productItem.book._id === item._id) === -1
                ? false
                : true
        );
    }, [cart, currentUser._id]);

    const cartOperation = () => {
        existsInCart
            ? removeFromCart({
                  id: _id,
                  variant: variants[variants.findIndex((variant) => variant.type === 'paperback')],
              })
            : addToCart({
                  items: [
                      {
                          book: { ...item },
                          quantity: 1,
                          variant:
                              item.variants[
                                  item.variants.findIndex((item) => item.type === 'paperback')
                              ],
                      },
                  ],
              });
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
                        onClick={cartOperation}>
                        <CartIcon
                            style={{
                                fill: existsInCart ? theme.constants.dark : theme.dark_background,
                            }}
                        />
                    </div>
                    <div
                        className='bibliography-icon'
                        style={{ backgroundColor: theme.color }}
                        onClick={() =>
                            modalDispatch({
                                type:
                                    currentUser._id !== 'guest'
                                        ? 'UPDATE_WISHLIST_MODAL'
                                        : 'UPDATE_AUTH_MODAL',

                                payload: {
                                    state:
                                        currentUser._id !== 'guest'
                                            ? [item]
                                            : { authState: 'login' },
                                },
                            })
                        }>
                        <OutlinedWishListIcon style={{ fill: theme.dark_background }} />
                    </div>
                </div>
                <img className='stretch' src={cover_image?.url} alt={name} />
                <div
                    className='overlay flex justify-between items-center'
                    style={{ backgroundColor: theme.dark_background }}>
                    <div className='info' style={{ color: theme.color }}>
                        <div className='title font-semibold'>{maxWords(name, 12)}</div>
                        <div className='authors text-xs opac-6'>
                            By {maxWords(authors.join(', '), 12)}
                        </div>
                        <div className='price text-md font-semibold'>₹ {variants[0].price}</div>
                    </div>
                    <Link
                        // target='_blank'
                        to={`/p/${_id}`}
                        className='text-lg icon-50 flex items-center justify-center'
                        style={{
                            backgroundColor: _window.width <= 768 ? 'transparent' : theme.color,
                            color: theme.dark_background,
                        }}>
                        <RightArrowIcon
                            fill={_window.width <= 768 ? theme.color : theme.dark_background}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
};
