import axios from '../../axios';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
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

    const fetchCart = async () => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/carts`, {
                type: 'FETCH_DETAILS',
                populate: {
                    path: 'data.book',
                },
            });
            if (success) {
                setUserCart((prevState) => data.cart.data);
                dataDispatch({ type: 'SET_CART', payload: { cart: data.cart } });
            }
        } catch (error) {
            console.error(error);
        }
    };
    // Determining the cart values based on authentication

    useEffect(() => {}, [cart, currentUser]);

    useEffect(() => {
        fetchCart();
    }, []);

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
