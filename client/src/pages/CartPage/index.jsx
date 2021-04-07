import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// styles
import './cartpage.scss';

// React components
import { Modal } from '../../components/Modal';
import { CartItemsContainer } from './CartItemsContainer';
import { ReadlistModal } from '../../components/ReadlistModal';
import { CartCheckout } from './CartCheckout';

export const CartPage = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const [{ users, currentUser }] = useAuth();
    const [{ cart, read_list }, dataDispatch] = useDataLayer();
    const [readlistModal, setReadlistModal] = useState({ isActive: false });
    const [userCart, setUserCart] = useState([]);

    // Determining the cart values based on authentication

    useEffect(() => {
        const userIndex = cart.findIndex((cartItem) => cartItem.userId === currentUser);
        setUserCart((prevState) => [...cart[userIndex].data]);
        if (cart[userIndex].data.length === 0) history.replace('/');
    }, [cart, currentUser]);

    // useEffect(() => {
    //     console.log('Re-render because of change in currentUser (CartPageComp)', currentUser);
    // }, [currentUser]);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <CartItemsContainer cart={userCart} />
                <CartCheckout cart={userCart} setReadlistModal={setReadlistModal} />
            </div>
            {readlistModal.isActive && (
                <Modal setIsModalActive={setReadlistModal}>
                    <ReadlistModal
                        setIsModalActive={setReadlistModal}
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
