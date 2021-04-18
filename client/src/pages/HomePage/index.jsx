import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// React components
import { ProductList } from '../../components/ProductList';
import { CategoryList } from '../../components/CategoryList';

export const HomePage = () => {
    const { theme } = useTheme();
    const [{ products }] = useDataLayer();

    return (
        <>
            <div
                style={{
                    backgroundColor: theme.dark_background,
                    color: theme.color,
                    padding: '4rem 2rem',
                    position: 'relative',
                    minHeight: '50vh',
                }}
            >
                <ProductList />
            </div>
            <section
                className='categories'
                style={{
                    padding: '16rem 4rem 4rem 4rem',
                    backgroundColor: theme.light_background,
                    color: theme.color,
                }}
            >
                <CategoryList genre='web development' products={products} />
                <CategoryList genre='horror' products={products} />
                <CategoryList genre='business' products={products} />
            </section>
        </>
    );
};
