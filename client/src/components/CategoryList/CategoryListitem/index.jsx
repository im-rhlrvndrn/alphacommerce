import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { maxWords } from '../../../utils/math_helpers';
import { useAuth } from '../../../context/AuthProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// React components
import { Modal } from '../../Modal';
import { WishlistModal } from '../../WishlistModal';
import { CartIcon } from '../../../react_icons/CartIcon';
import { RightArrowIcon } from '../../../react_icons/RightArrowIcon';
import { OutlinedWishListIcon } from '../../../react_icons/OutlinedWishListIcon';

// styles
import './categorylistitem.scss';

export const CategoryListItem = ({ item }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const { _id, name, cover_image, variants, link, authors } = item;
    const [existsInCart, setExistsInCart] = useState(false);
    const [wishlistModal, setWishlistModal] = useState({ isActive: false });

    useEffect(() => {
        // const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart.data?.findIndex((productItem) => productItem.book._id === item._id) === -1
                ? false
                : true
        );
    }, [cart, currentUser._id]);

    const addToCart = (item) => dataDispatch({ type: 'ADD_TO_CART', payload: item });
    const removeFromCart = (id) => dataDispatch({ type: 'REMOVE_FROM_CART', payload: id });

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
                                : addToCart({
                                      _id,
                                      name,
                                      cover_image,
                                      quantity: 1,
                                      price: variants[0].price,
                                      totalPrice: variants[0].price,
                                  })
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
                        onClick={() =>
                            setWishlistModal((prevState) => ({
                                ...prevState,
                                isActive: !prevState.isActive,
                            }))
                        }
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
                        <div className='font-weight-md'>{maxWords(name, 12)}</div>
                        <div className='font-xs opac-6'>By {maxWords(authors.join(', '), 12)}</div>
                        <div className='font-md font-weight-md'>₹ {variants[0].price}</div>
                    </div>
                    <Link
                        // target='_blank'
                        to={`/p/${_id}`}
                        className='text-align-center font-lg rounded icon-50 flex flex-align-center flex-justify-center'
                        style={{ backgroundColor: theme.color, color: theme.dark_background }}
                    >
                        <RightArrowIcon fill={theme.dark_background} />
                    </Link>
                </div>
            </div>
            {wishlistModal.isActive && (
                <Modal setIsModalActive={setWishlistModal}>
                    <WishlistModal setIsModalActive={setWishlistModal} items={[item]} />
                </Modal>
            )}
        </>
    );
};
