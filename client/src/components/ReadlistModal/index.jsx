import { v4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import { maxWords } from '../../utils/math_helpers';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './wishlistmodal.scss';

export const ReadlistModal = ({ setIsModalActive, productIds }) => {
    const { theme } = useTheme();
    const wishlistRef = useRef(null);
    // const [{ currentUser }] = useAuth();
    const [filter, setFilter] = useState('');
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const [newWishlistRef, setNewWishlistRef] = useState(false);

    const addNewWishlist = () => setNewWishlistRef((prevState) => !prevState);

    const renderWishlistNames = (filter = '') => {
        // const userIndex = wishlists.findIndex((item) => item.userId === currentUser);
        const filteredWishlist =
            filter !== ''
                ? wishlists.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
                : wishlists;

        if (filteredWishlist.length === 0)
            return <p style={{ color: theme.color, padding: '1rem' }}>No readlist</p>;

        return filteredWishlist.map((wishlistItem) => (
            <div
                className='readlist-item'
                style={{ backgroundColor: theme.light_background }}
                onClick={() => {
                    setIsModalActive((prevState) => !prevState);
                    dataDispatch({
                        type: 'ADDTOWISHLIST',
                        payload: {
                            ...wishlistItem,
                            data: [...wishlistItem.data, ...productIds],
                        },
                    });
                }}
            >
                {maxWords(wishlistItem.name, 30)}
            </div>
        ));
    };

    const createWishlist = (event) => {
        setNewWishlistRef((prevState) => !prevState);
        if (event.target.textContent)
            dataDispatch({
                type: 'CREATEWISHLIST',
                payload: {
                    _id: v4(),
                    user: 'guestUser',
                    name: event.target.textContent,
                    cover_image: {
                        url:
                            'https://images.pexels.com/photos/2685319/pexels-photo-2685319.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                    },
                    estimated_price: 0,
                    data: [],
                },
            });
    };

    useEffect(() => {
        if (newWishlistRef) wishlistRef.current.focus();
    }, [newWishlistRef]);

    return (
        <div className='wishlist-modal'>
            <div className='heading'>Add to wishlist</div>
            <div className='cta'>
                <input
                    type='text'
                    value={filter}
                    autoComplete='off'
                    id='wishlist-modal-input'
                    name='wishlist-modal-input'
                    placeholder='Search for wishlist...'
                    onChange={(event) => setFilter((prevState) => event.target.value)}
                    style={{ backgroundColor: theme.light_background, color: theme.color }}
                />
                <div
                    className='createNew'
                    onClick={addNewWishlist}
                    style={{ backgroundColor: theme.dark_background, color: theme.color }}
                >
                    + Create wishlist
                </div>
            </div>
            <div className='wishlist-modal-wrapper'>
                {newWishlistRef && (
                    <div
                        className='new-wishlist'
                        contentEditable
                        ref={wishlistRef}
                        onBlur={createWishlist}
                    ></div>
                )}
                {renderWishlistNames(filter)}
            </div>
        </div>
    );
};
