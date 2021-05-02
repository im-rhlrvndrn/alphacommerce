import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './home.scss';

// React components
import { ProductList } from '../../components/ProductList';
import { CategoryList } from '../../components/CategoryList';

export const HomePage = () => {
    const { theme } = useTheme();
    const [{ books }] = useDataLayer();

    return (
        <>
            <div
                className='hero-section'
                style={{
                    backgroundColor: theme.dark_background,
                    color: theme.color,
                }}
            >
                <ProductList />
            </div>
            <section
                className='categories'
                style={{
                    backgroundColor: theme.light_background,
                    color: theme.color,
                }}
            >
                <CategoryList genre='web development' books={books} />
                <CategoryList genre='horror' books={books} />
                <CategoryList genre='business' books={books} />
            </section>
        </>
    );
};
