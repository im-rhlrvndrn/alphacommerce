import { maxWords } from '../../utils/math_helpers';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// Styles
import './productList.scss';

// React components
import { AddToCart } from '../Buttons';
import { findIndex } from '../../utils/array_helpers';

export const ProductList = () => {
    const { theme } = useTheme();
    let [{ books }] = useDataLayer();
    books = books.slice(0, 3);

    return (
        <div className='productlist flex'>
            {books?.map((book) => {
                const { _id, name, summary, cover_image } = book;
                return (
                    <div className='productitem mr-8 flex' key={_id}>
                        <img className='m-0' src={cover_image?.url} alt={`Book: ${name}`} />
                        <div
                            className='productitem-content flex flex-col'
                            style={{ color: theme.color, backgroundColor: theme.dark_background }}
                        >
                            <h2>{maxWords(name, 20)}</h2>
                            <p>{maxWords(summary?.text, 50)}</p>
                            <AddToCart
                                item={book}
                                variant={book.variants[findIndex(book.variants, 'isSelected')]}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
