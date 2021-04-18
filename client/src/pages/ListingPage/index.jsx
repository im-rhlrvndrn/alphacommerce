import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';
import { deSlugify, generateSearchParams, getFilteredData, getSortedData } from '../../utils';

// styles
import './listingpage.scss';

// React components
import { Filter } from '../../components/Filter';
import { ListingProducts } from '../../components/Listing';

export const ListingPage = () => {
    const { theme } = useTheme();
    let { state, search } = useLocation();
    const [{ products, genreFilters, authorFilters, priceFilter }, dataDispatch] = useDataLayer();
    let sortedProducts = getSortedData(products, priceFilter);
    let filteredProducts = getFilteredData(sortedProducts, [
        { data: genreFilters, type: 'genre' },
        { data: authorFilters, type: 'authors' },
    ]);

    useEffect(() => {}, [genreFilters, authorFilters, priceFilter]);

    useEffect(() => {
        search = generateSearchParams(search);
        if (search.genre) {
            dataDispatch({ type: 'FILTER_BY_GENRE', payload: deSlugify(search.genre) });
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, []);

    // console.log('filteredProducts', filteredProducts);
    console.log('url state: ', {
        state,
        search: generateSearchParams(search),
    });

    return (
        <section
            className='category-page'
            style={{ backgroundColor: theme.dark_background, color: theme.color }}
        >
            {/* <div className='category-page-hero-section'>{deSlugify(urlParams.genre)}</div> */}
            <main style={{ color: theme.color }}>
                <div className='main-header' style={{ opacity: 0.6 }}>
                    {filteredProducts.length} results found
                </div>
                <div className='main-container'>
                    <Filter />
                    <div className='category-container'>
                        <ListingProducts products={filteredProducts} />
                    </div>
                </div>
            </main>
        </section>
    );
};
