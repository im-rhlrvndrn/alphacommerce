import axios from '../../axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useHistory, useParams } from 'react-router';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';
import { WishlistItem } from '../../components/WishlistItem';

export const Wishlist = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const urlParams = useParams();
    const [{ currentUser }] = useAuth();
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const [wishList, setWishList] = useState({});

    const renderWishListItems = () =>
        wishList?.data?.length
            ? wishList?.data?.map((wishListItem) => <WishlistItem item={wishListItem.book} />)
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
                console.log(`---Fetched wishlist---`, data.wishlist);
                setWishList((prevState) => data.wishlist);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {}, [wishlists, currentUser]);

    useEffect(() => {
        fetchWishlistItems();
    }, []);

    console.log('Wishlist FrontEnd data => ', wishList);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <div className='cart'>
                    <div
                        className='font-md uppercase font-weight-md'
                        style={{ color: theme.color }}
                    >
                        {wishList?.name?.name}
                    </div>
                    <div className='cart-items' style={{ color: theme.color }}>
                        {renderWishListItems()}
                    </div>
                    <button
                        className='continue-shopping mr-2'
                        style={{ backgroundColor: theme.light_background, color: theme.color }}
                        onClick={() => history.push('/')}
                    >
                        Add more to wishlist
                    </button>
                </div>
                <div
                    className='cart-checkout p-2 h-max'
                    style={{ backgroundColor: theme.light_background, color: theme.color }}
                >
                    <h2>Summary</h2>
                    <div
                        className='checkout-group mb-1'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}
                    >
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>sub-total</div>
                            <div className='price'>₹ </div>
                        </div>
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>gst</div>
                            <div className='price'>₹</div>
                        </div>
                    </div>
                    <div
                        className='checkout-group mb-1'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}
                    >
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>total</div>
                            <div className='price'>₹ {wishList?.estimated_price}</div>
                        </div>
                    </div>
                    <button
                        className='w-100p font-weight-md text-align-center'
                        style={{
                            backgroundColor: theme.constants.primary,
                            color: theme.constants.dark,
                        }}
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        className='w-100p text-align-center'
                        style={{ backgroundColor: 'transparent', color: theme.color }}
                    >
                        Add all items to cart
                    </button>
                </div>
            </div>
        </>
    );
};
