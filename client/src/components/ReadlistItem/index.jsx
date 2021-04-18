import { useParams } from 'react-router';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './readlistItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const ReadlistItem = ({ item: { _id, name, cover_image, price } }) => {
    const { theme } = useTheme();
    const urlParams = useParams();
    const [_, dataDispatch] = useDataLayer();

    console.log(urlParams);

    const removeFromReadlist = (id) =>
        dataDispatch({
            type: 'REMOVEFROMREADLIST',
            payload: { readlistId: urlParams.id, productId: _id },
        });

    return (
        <div className='readlistItem' style={{ color: theme.color }}>
            <img src={cover_image?.url} alt={name} />
            <p className='readlistItem_name'>{maxWords(name, 30)}</p>
            <p className='readlistItem_price'>₹ {price.value}</p>
            <AddToCart
                style={{ margin: '0 2rem 0 0' }}
                item={{ _id, name, cover_image: cover_image, price }}
            />
            <button
                className='remove-item'
                onClick={() => removeFromReadlist(_id)}
                style={{ color: theme.color }}
            >
                X
            </button>
        </div>
    );
};
