import axios from '../../axios';
import { useParams } from 'react-router';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './wishlistItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const WishlistItem = ({ item }) => {
    const { theme } = useTheme();
    const urlParams = useParams();
    const [_, dataDispatch] = useDataLayer();
    const { _id, name, cover_image, variants } = item;

    console.log(urlParams);
    console.log('wishlist item => ', item);

    const removeFromWishlist = async (id) => {
        const {
            data: { success, data, toast },
        } = await axios.post(`/wishlists/${urlParams.id}`, {
            type: 'REMOVE_FROM_WISHLIST',
            wishlistItem: item,
        });
        // if (success)
        //     dataDispatch({
        //         type: 'REMOVE_FROM_WISHLIST',
        //         payload: { wishlistId: urlParams.id, wishlist: data.wishlist },
        //     });
    };

    return (
        <div className='wishlistItem' style={{ color: theme.color }}>
            <img src={cover_image?.url} alt={name} />
            <p className='wishlistItem_name'>{maxWords(name, 30)}</p>
            <p className='wishlistItem_price'>
                ₹ {variants.filter((item) => item.type === 'paperback')[0].price}
            </p>
            <div onClick={removeFromWishlist}>
                <AddToCart
                    style={{ margin: '0 2rem 0 0' }}
                    item={item}
                    variant={variants.filter((item) => item.type === 'paperback')[0]}
                />
            </div>
            <button
                className='remove-item'
                onClick={() => removeFromWishlist(_id)}
                style={{ color: theme.color }}
            >
                X
            </button>
        </div>
    );
};
