import axios from '../../axios';
import { useParams } from 'react-router-dom';
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
    const paperbackVariant = variants?.find((item) => item.type === 'paperback');

    console.log(urlParams);
    console.log('wishlist item => ', item);

    const removeFromWishlist = async (id) => {
        const {
            data: { success, data, toast },
        } = await axios.post(`/wishlists/${urlParams.id}`, {
            type: 'REMOVE_FROM_WISHLIST',
            wishlistItem: item,
        });
        console.log('Removed wishlist item from backend => ', data);
        if (success) {
            dataDispatch({
                type: 'REMOVE_FROM_WISHLIST',
                payload: {
                    wishlistId: urlParams.id,
                    wishlistItem: data.wishlistItem,
                    estimated_price: data.estimated_price,
                },
            });
        }
    };

    return (
        <div className='wishlistItem_wrapper' style={{ color: theme.color }}>
            <div className='wishlistItem_container'>
                <div className='wishlistItem_details'>
                    <p className='name'>{maxWords(name, 30)}</p>
                    {/* <p className='total_price font-lg'>₹ {total}</p> */}
                    {/* <p className='price'>
                        ₹ {getSelectedVariantPrice(item.book.variants, variant.type)}
                    </p> */}
                    <div className='quantity_container'>
                        <AddToCart item={item} variant={paperbackVariant} />
                    </div>
                </div>
                <img src={cover_image?.url} alt={name} />
            </div>
            <div className='wishlistItem_cta'>
                <button
                    className='remove_item'
                    onClick={() => removeFromWishlist(_id)}
                    style={{ color: theme.color }}>
                    Remove
                </button>
            </div>
        </div>
    );
};
