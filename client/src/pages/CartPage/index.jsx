import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './cartpage.scss';

// React components
import { Modal } from '../../components/Modal';
import { CartItemsContainer } from './CartItemsContainer';
import { WishlistModal } from '../../components/WishlistModal';
import { CartCheckout } from './CartCheckout';

export const CartPage = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const [{ currentUser }] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [wishlistModal, setWishlistModal] = useState({ isActive: false });
    const [userCart, setUserCart] = useState([]);

    // Determining the cart values based on authentication

    useEffect(() => {
        // const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setUserCart((prevState) => cart.data);
        // if (cart.data.length === 0) history.replace('/');
    }, [cart, currentUser]);

    // useEffect(() => {
    //     console.log('Re-render because of change in currentUser (CartPageComp)', currentUser);
    // }, [currentUser]);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <CartItemsContainer cart={userCart} />
                <CartCheckout cart={userCart} setWishlistModal={setWishlistModal} />
            </div>
            {wishlistModal.isActive && (
                <Modal setIsModalActive={setWishlistModal}>
                    <WishlistModal
                        setIsModalActive={setWishlistModal}
                        productIds={userCart?.map((item) => ({
                            id: item.id,
                            totalPrice: item.totalPrice,
                        }))}
                    />
                </Modal>
            )}
        </>
    );
};
