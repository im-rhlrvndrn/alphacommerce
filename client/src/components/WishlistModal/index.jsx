import { useEffect, useRef, useState } from 'react';
import { maxWords } from '../../utils/math_helpers';
import { useWishlist } from '../../hooks/useWishlist';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';
import { withModalOverlay } from '../../hoc/withModalOverlay';

// styles
import './wishlistmodal.scss';

// * The items prop is an Array so that you can pass multiple items(books) for adding a whole list of items
// * For example => move an entire cart and create a wishlist out of it in one go
export const WishlistModal = ({ items }) => {
    const { theme } = useTheme();
    const wishlistRef = useRef(null);
    const { addToWishlist, createWishlist } = useWishlist();
    const [filter, setFilter] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const [newWishlistRef, setNewWishlistRef] = useState(false);

    const addNewWishlist = () => setNewWishlistRef((prevState) => !prevState);

    const renderWishlistNames = (filter = '') => {
        const filteredWishlist =
            filter !== ''
                ? wishlists.filter((item) =>
                      item.name.name.toLowerCase().includes(filter.toLowerCase())
                  )
                : wishlists;

        if (filteredWishlist.length === 0)
            return <p style={{ color: theme.color, padding: '1rem' }}>No wishlist</p>;

        return filteredWishlist.map((wishlistItem) => (
            <button
                disabled={disabled}
                className={`mb-1 px-4 w-full text-align-left text-sm ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{ backgroundColor: theme.light_background, color: theme.color }}
                onClick={() => {
                    setDisabled(true);
                    addToWishlist(wishlistItem._id, setDisabled);
                }}>
                {maxWords(wishlistItem.name.name, 30)}
            </button>
        ));
    };

    const createNewWishlist = (event) => {
        setNewWishlistRef((prevState) => !prevState);
        createWishlist(event);
    };

    useEffect(() => {
        if (newWishlistRef) wishlistRef.current.focus();
    }, [newWishlistRef]);

    return (
        <div className='wishlist-modal' style={{ color: theme.color }}>
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
                    style={{ backgroundColor: theme.dark_background, color: theme.color }}>
                    + Create wishlist
                </div>
            </div>
            <div className='wishlist-modal-wrapper'>
                {newWishlistRef && (
                    <div
                        className='new-wishlist'
                        contentEditable
                        ref={wishlistRef}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') createNewWishlist(event);
                        }}
                        onBlur={createNewWishlist}></div>
                )}
                {renderWishlistNames(filter)}
            </div>
        </div>
    );
};

const EnhancedWishlistModal = withModalOverlay(WishlistModal);
export { EnhancedWishlistModal };
