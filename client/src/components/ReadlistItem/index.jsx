import { useParams } from 'react-router';
import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// styles
import './readlistItem.scss';

// React components
import { AddToCart } from '../Buttons';

export const ReadlistItem = ({ item: { id, name, coverImage, price } }) => {
    const { theme } = useTheme();
    const urlParams = useParams();
    const [_, dataDispatch] = useDataLayer();

    console.log(urlParams);

    const removeFromReadlist = (id) =>
        dataDispatch({
            type: 'REMOVEFROMREADLIST',
            payload: { readlistId: urlParams.id, productId: id },
        });

    return (
        <div className='readlistItem' style={{ color: theme.color }}>
            <img src={coverImage?.url} alt={name} />
            <p className='readlistItem_name'>{maxWords(name, 30)}</p>
            <p className='readlistItem_price'>₹ {price.value}</p>
            <AddToCart
                style={{ margin: '0 2rem 0 0' }}
                item={{ id, name, cover_image: coverImage, price }}
            />
            <button
                className='remove-item'
                onClick={() => removeFromReadlist(id)}
                style={{ color: theme.color }}
            >
                X
            </button>
        </div>
    );
};
