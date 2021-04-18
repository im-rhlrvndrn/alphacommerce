import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './wishlistpage.scss';

export const ReadlistPage = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const [{ currentUser }] = useAuth();
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const [wish_lists, setWishlists] = useState([]);

    console.log(wish_lists);

    useEffect(() => {
        setWishlists((prevState) => wishlists);
    }, [wishlists, currentUser]);

    return (
        <div
            className='wishlist'
            style={{ backgroundColor: theme.dark_background, color: theme.color }}
        >
            <input
                type='text'
                name='wishlist-search'
                aria-label='wishlist search input'
                id='wishlist-search'
                placeholder='Search for wishlist by name'
            />
            <h1>My wishlists</h1>
            <div className='wishlist-wrapper'>
                {wish_lists?.map(({ _id, name, cover_image }) => (
                    <Link to={`/wishlists/${_id}`} key={_id} className='wishlist-item'>
                        <img src={cover_image?.url} alt={name} />
                        <div
                            className='content'
                            style={{ backgroundColor: theme.light_background }}
                        >
                            <div className='name' style={{ color: theme.color }}>
                                {name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
