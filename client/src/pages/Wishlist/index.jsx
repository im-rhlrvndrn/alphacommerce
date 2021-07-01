import axios from '../../axios';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataLayer } from '../../context/DataProvider';

// React Components
import { WishlistItem } from '../../components/WishlistItem';

export const Wishlist = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const urlParams = useParams();
    const [{ currentUser }] = useAuth();
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const wishlistIndex = wishlists?.findIndex((item) => item?._id === urlParams?.id);

    const renderWishListItems = () =>
        wishlists[wishlistIndex]?.data?.length
            ? wishlists[wishlistIndex]?.data?.map((wishListItem) => (
                  <WishlistItem item={wishListItem?.book} />
              ))
            : 'No items in wishlist';

    const fetchWishlistItems = async () => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/wishlists/${urlParams.id}`, {
                type: 'FETCH_DETAILS',
            });
            if (success) {
                dataDispatch({
                    type: 'UPDATE_WISHLIST',
                    payload: { wishlist: data.wishlist },
                });
                // console.log(`---Fetched wishlist---`, data.wishlist);
                // setWishList((prevState) => data.wishlist);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {}, [wishlists.data, currentUser]);

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    console.log('Wishlist FrontEnd data => ', wishlists);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <div className='cart'>
                    <div className='text-md uppercase font-semibold' style={{ color: theme.color }}>
                        {wishlists[wishlistIndex]?.name?.name}
                    </div>
                    <div className='cart-items' style={{ color: theme.color }}>
                        {renderWishListItems()}
                    </div>
                    <button
                        className='continue-shopping mr-8'
                        style={{ backgroundColor: theme.light_background, color: theme.color }}
                        onClick={() => navigate('/')}>
                        Add more to wishlist
                    </button>
                </div>
                <div
                    className='cart-checkout p-8 h-max'
                    style={{ backgroundColor: theme.light_background, color: theme.color }}>
                    <h2>Summary</h2>
                    <div
                        className='checkout-group mb-4'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}>
                        <div className='checkout-group-row flex justify-between mb-4'>
                            <div className='heading'>sub-total</div>
                            <div className='price'>₹ </div>
                        </div>
                        <div className='checkout-group-row flex justify-between mb-4'>
                            <div className='heading'>gst</div>
                            <div className='price'>₹</div>
                        </div>
                    </div>
                    <div
                        className='checkout-group mb-4'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}>
                        <div className='checkout-group-row flex justify-between mb-4'>
                            <div className='heading'>total</div>
                            <div className='price'>
                                ₹ {wishlists[wishlistIndex]?.estimated_price}
                            </div>
                        </div>
                    </div>
                    <button
                        className='w-full font-semibold text-align-center'
                        style={{
                            backgroundColor: theme.constants.primary,
                            color: theme.constants.dark,
                        }}>
                        Proceed to Checkout
                    </button>
                    <button
                        className='w-full text-align-center bg-transparent'
                        style={{ color: theme.color }}>
                        Add all items to cart
                    </button>
                </div>
            </div>
        </>
    );
};
