import { useParams } from 'react-router';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './wishlistItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const ReadlistItem = ({ item: { _id, name, cover_image, price } }) => {
    const { theme } = useTheme();
    const urlParams = useParams();
    const [_, dataDispatch] = useDataLayer();

    console.log(urlParams);

    const removeFromWishlist = (id) =>
        dataDispatch({
            type: 'REMOVEFROMREADLIST',
            payload: { wishlistId: urlParams.id, productId: _id },
        });

    return (
        <div className='wishlistItem' style={{ color: theme.color }}>
            <img src={cover_image?.url} alt={name} />
            <p className='wishlistItem_name'>{maxWords(name, 30)}</p>
            <p className='wishlistItem_price'>₹ {price.value}</p>
            <AddToCart
                style={{ margin: '0 2rem 0 0' }}
                item={{ _id, name, cover_image: cover_image, price }}
            />
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
