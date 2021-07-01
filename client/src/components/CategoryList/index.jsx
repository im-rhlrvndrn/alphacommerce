import axios from '../../axios';
import { slugify } from '../../utils';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';

// Styles
import './categoryList.scss';

// React components
import { CategoryListItem } from './CategoryListitem';

export const CategoryList = ({ genre }) => {
    const { theme } = useTheme();
    const [books, setBooks] = useState([]);

    const fetchBooks = async (limit = 5) => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/books`, {
                type: 'FETCH_DETAILS',
                limit,
                genre,
            });
            if (success)
                setBooks(
                    (prevState) => data.books /*.filter((item) => item.genres.includes(genre))*/
                );
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchBooks(6);
    }, []);

    return (
        <div className='category-section'>
            {genre && (
                <div className='heading flex justify-between' style={{ color: theme.color }}>
                    {genre}
                    <span style={{ color: theme.color }} className='floating-genre'>
                        {genre}
                    </span>
                    <Link
                        style={{ color: theme.color }}
                        to={{
                            pathname: `/p`,
                            search: `?genre=${slugify(genre)}`,
                            state: { hello: 'everyone' },
                        }}>
                        Show all
                    </Link>
                </div>
            )}
            <div className='category-list flex'>
                {books?.map((productItem) => (
                    <CategoryListItem key={productItem._id} item={productItem} />
                ))}
            </div>
        </div>
    );
};
