import { slugify } from '../../utils';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';

// Styles
import './categoryList.scss';

// React components
import { CategoryListItem } from './CategoryListitem';

export const CategoryList = ({ books, genre }) => {
    const { theme } = useTheme();
    console.log(`products before slice(${genre}): `, books);
    books = books.filter((item) => item.genres.includes(genre)).slice(0, 5);

    console.log(`products after slice(${genre}): `, books);

    // useEffect(() => {
    //     console.log('Re-render because of change in currentUser (CategoryListComp)', currentUser);
    // }, [currentUser]);

    return (
        <div className='category-section'>
            {genre && (
                <div className='heading flex flex-justify-sb' style={{ color: theme.color }}>
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
                        }}
                    >
                        Show all
                    </Link>
                </div>
            )}
            <div className='category-list'>
                {books?.map((productItem) => (
                    <CategoryListItem key={productItem._id} item={productItem} />
                ))}
            </div>
        </div>
    );
};
