import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useDataLayer } from '../../../context/DataLayerContext';

// React components
import { Modal } from '../../Modal';
import { ReadlistModal } from '../../ReadlistModal';
import { maxWords } from '../../../utils/math_helpers';
import { useAuth } from '../../../context/AuthContext';
import { CartIcon } from '../../../react_icons/CartIcon';
import { RightArrowIcon } from '../../../react_icons/RightArrowIcon';
import { OutlinedWishListIcon } from '../../../react_icons/OutlinedWishListIcon';

// styles
import './categorylistitem.scss';

export const CategoryListItem = ({ item }) => {
    const { theme } = useTheme();
    const [{ currentUser }] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const { id, name, coverImage, price, link, authors } = item;
    const [existsInCart, setExistsInCart] = useState(false);
    const [readlistModal, setReadlistModal] = useState({ isActive: false });

    useEffect(() => {
        const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setExistsInCart((prevState) =>
            cart[userIndex].data?.findIndex((productItem) => productItem.id === item.id) === -1
                ? false
                : true
        );
    }, [cart, currentUser]);

    const addToCart = (item) => dataDispatch({ type: 'ADDTOCART', payload: item });

    return (
        <>
            <div class='card'>
                <div className='cta'>
                    <div
                        className='cart-icon'
                        style={{
                            backgroundColor: existsInCart ? theme.constants.primary : theme.color,
                        }}
                        onClick={() => {
                            addToCart({
                                id,
                                name,
                                coverImage: coverImage,
                                quantity: 1,
                                price: price.value,
                                totalPrice: price.value,
                            });
                        }}
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
                            setReadlistModal((prevState) => ({
                                ...prevState,
                                isActive: !prevState.isActive,
                            }))
                        }
                    >
                        <OutlinedWishListIcon style={{ fill: theme.dark_background }} />
                    </div>
                </div>
                <img
                    class='stretch'
                    src={coverImage?.url}
                    alt='girl with code reflection on face'
                />
                <div
                    class='overlay flex flex-justify-sb flex-align-center'
                    style={{ backgroundColor: theme.dark_background }}
                >
                    <div class='info' style={{ color: theme.color }}>
                        <div class='font-weight-md'>{maxWords(name, 12)}</div>
                        <div class='font-xs opac-6'>By {maxWords(authors.join(', '), 12)}</div>
                        <div class='font-md font-weight-md'>₹ {price.value}</div>
                    </div>
                    <Link
                        // target='_blank'
                        to={`/p/${id}`}
                        class='text-align-center font-lg rounded icon-50 flex flex-align-center flex-justify-center'
                        style={{ backgroundColor: theme.color, color: theme.dark_background }}
                    >
                        <RightArrowIcon fill={theme.dark_background} />
                    </Link>
                </div>
            </div>
            {readlistModal.isActive && (
                <Modal setIsModalActive={setReadlistModal}>
                    <ReadlistModal
                        setIsModalActive={setReadlistModal}
                        productIds={[{ id, totalPrice: price.value }]}
                    />
                </Modal>
            )}
        </>
    );
};
