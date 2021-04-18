import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useHistory, useParams } from 'react-router';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';
import { ReadlistItem } from '../../components/ReadlistItem';

export const Readlist = () => {
    const { theme } = useTheme();
    const history = useHistory();
    let userIndex, wishListIndex;
    const urlParams = useParams();
    const [{ currentUser }] = useAuth();
    const [{ wishlists, products }] = useDataLayer();
    const [wishList, setWishList] = useState({});

    const renderReadListItems = () => {
        return products?.map((productItem) =>
            wishList?.data?.map(
                (wishListItem) =>
                    wishListItem._id === productItem._id && <ReadlistItem item={productItem} />
            )
        );
    };

    useEffect(() => {
        // userIndex = wishlists.findIndex((item) => item.userId === currentUser);
        wishListIndex = wishlists.findIndex((item) => item._id === urlParams.id);

        setWishList((prevState) => wishlists[wishListIndex]);
        // if (wishListIndex < 0 || wishlists.data[wishListIndex].products.length === 0)
        //     history.goBack();
    }, [wishlists, currentUser]);

    // useEffect(() => {
    //     userIndex = wishlists.findIndex((item) => item.userId === currentUser);
    //     wishListIndex = wishlists[userIndex].data.findIndex((item) => item.id === urlParams.id);

    //     console.log('The readlist: ', wishlists[userIndex].data[wishListIndex]);
    //     if (wishListIndex < 0 || wishlists[userIndex].data[wishListIndex].products.length === 0)
    //         history.goBack();
    // }, []);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <div className='cart'>
                    <h1 style={{ color: theme.color }}>{wishList?.name?.text}</h1>
                    <div className='cart-items' style={{ color: theme.color }}>
                        {renderReadListItems()}
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
                            <div className='price'>₹ {wishList?.estimated_price?.value}</div>
                        </div>
                    </div>
                    <button
                        className='w-100p text-align-center'
                        style={{
                            backgroundColor: theme.constants.dark,
                            color: theme.constants.light,
                        }}
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        className='w-100p text-align-center'
                        style={{ backgroundColor: 'transparent', color: theme.color }}
                    >
                        Create a bibliography
                    </button>
                </div>
            </div>
        </>
    );
};
