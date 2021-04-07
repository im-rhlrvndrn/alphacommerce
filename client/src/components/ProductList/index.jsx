import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// Styles
import './productList.scss';

// React components
import { AddToCart } from '../Buttons';

export const ProductList = () => {
    const { theme } = useTheme();
    let [{ products }] = useDataLayer();
    products = products.slice(0, 3);

    return (
        <div className='productlist flex'>
            {products?.map(({ id, name, summary, coverImage, price }) => (
                <div className='productitem mr-2 flex' key={id}>
                    <img className='margin-reset' src={coverImage?.url} alt={`Book: ${name}`} />
                    <div
                        className='productitem-content flex flex-dir-cl'
                        style={{ color: theme.color, backgroundColor: theme.dark_background }}
                    >
                        <h2>{maxWords(name, 20)}</h2>
                        <p>{maxWords(summary?.text, 50)}</p>
                        <AddToCart item={{ id, name, coverImage, price }} />
                    </div>
                </div>
            ))}
        </div>
    );
};
