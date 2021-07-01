import { v4 } from 'uuid';
import axios from '../axios';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthProvider';
import { useModal } from '../context/ModalProvider';
import { useDataLayer } from '../context/DataProvider';

export const useWishlist = () => {
    const { setToast } = useToast();
    const [{ wishlist }, modalDispatch] = useModal();
    const [_, dataDispatch] = useDataLayer();
    const [{ currentUser }] = useAuth();

    const addToWishlist = async (wishlistId, setDisabled) => {
        try {
            const {
                data: { success, data, toast, statusCode, message, status },
            } = await axios.post(`/wishlists/${wishlistId}`, {
                wishlistItem: wishlist.state[0],
                type: 'ADD_TO_WISHLIST',
            });

            console.log('API add to wishlist => ', data);

            if (success) {
                setToast({ ...toast, _id: v4() });
                dataDispatch({
                    type: 'ADD_TO_WISHLIST',
                    payload: {
                        wishlistId: wishlistId,
                        data: [{ book: data.wishlist }],
                        estimated_price: data.estimated_price,
                    },
                });
            } else if (statusCode === 209) {
                console.log('Already exists');
                setToast({ status, message, _id: v4() });
            }

            modalDispatch({ type: 'UPDATE_WISHLIST_MODAL' });
        } catch (error) {
            setToast({
                _id: v4(),
                status: 'failed',
                message: `Couldn't add to wishlist. Please try again`,
            });
            console.error(error);
        } finally {
            setDisabled(false);
        }
    };

    const createWishlist = async (event) => {
        try {
            if (!event.target.textContent || !event.target.innerText)
                return setToast({
                    _id: v4(),
                    status: 'failed',
                    message: `Wishlist name can't be empty`,
                });

            const {
                data: { success, data, toast },
            } = await axios.post(`/wishlists`, {
                type: 'CREATE_WISHLIST',
                wishlists: [
                    {
                        user: currentUser._id,
                        name: { name: event.target.textContent || event.target.innerText },
                        cover_image: {
                            url: 'https://images.pexels.com/photos/2685319/pexels-photo-2685319.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        },
                        estimated_price: 0,
                        data: [],
                    },
                ],
            });

            if (success) {
                setToast({ ...toast, _id: v4() });
                dataDispatch({
                    type: 'CREATE_WISHLIST',
                    payload: data.wishlists,
                });
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: 'failed',
                message: `Couldn't create new wishlist. Please try again`,
            });
            console.error(error);
        }
    };

    return { addToWishlist, createWishlist };
};
