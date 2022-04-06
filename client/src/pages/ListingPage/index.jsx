import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    const [{ books, genreFilters, authorFilters, priceFilter }, dataDispatch] = useDataLayer();
    let sortedProducts = getSortedData(books, priceFilter);
    let filteredProducts = getFilteredData(sortedProducts, [
        { data: genreFilters, type: 'genres' },
        { data: authorFilters, type: 'authors' },
    ]);

    useEffect(() => {}, [genreFilters, authorFilters, priceFilter]);

    useEffect(() => {
        // ! Commented until the URL STATE method is tested
        // search = generateSearchParams(search);
        // if (search.genre && !genreFilters.includes(deSlugify(search.genre))) {
        //     dataDispatch({ type: 'FILTER_BY_GENRE', payload: deSlugify(search.genre) });
        // }

        if (state?.genre && !genreFilters.includes(state?.genre))
            dataDispatch({ type: 'FILTER_BY_GENRE', payload: [state?.genre] });
        else dataDispatch({ type: 'FILTER_BY_GENRE', payload: [] });

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, []);

    console.log('url state: ', {
        state,
        search: generateSearchParams(search),
        genreFilters,
    });

    return (
        <section
            className='category-page'
            style={{ backgroundColor: theme.dark_background, color: theme.color }}
        >
            {/* <div className='category-page-hero-section'>{deSlugify(urlParams.genre)}</div> */}
            <main style={{ color: theme.color }}>
                <div className='main-header' style={{ opacity: 0.6 }}>
                    <p>{filteredProducts.length} results found</p>
                    <div className='active-labels'>
                        <div className='filter-label'>{genreFilters[0]}</div>
                    </div>
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
