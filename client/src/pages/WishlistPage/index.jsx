import axios from '../../axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './wishlistpage.scss';

export const WishlistPage = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    // const cookies = Cookies();
    const [{ currentUser }, authDispatch] = useAuth();
    const [{ wishlists }, dataDispatch] = useDataLayer();
    const [wish_lists, setWishlists] = useState([]);

    // console.log(wish_lists);

    const fetchWishlists = async () => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/wishlists`, {
                type: 'FETCH_DETAILS',
                select: ['name', 'cover_image'],
            });
            if (success) {
                // dataDispatch({ type: 'SET_WISHLISTS', payload: { wishlists: data.wishlists } });
                console.log(`---Fetched wishlists---`, data.wishlists);
                setWishlists((prevState) => data.wishlists);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {}, [wishlists, currentUser]);

    useEffect(() => {
        if (Cookies.get('userId') !== 'loggedout') fetchWishlists();
        else {
            navigate('/');
            // authDispatch({
            //     type: 'UPDATE_AUTH_MODAL',
            //     payload: {
            //         authModal: {
            //             isActive: true,
            //             from: '/wishlists',
            //             state: 'login',
            //         },
            //     },
            // });
        }
    }, []);

    return (
        <div
            className='wishlist'
            style={{ backgroundColor: theme.dark_background, color: theme.color }}>
            <input
                type='text'
                name='wishlist-search'
                aria-label='wishlist search input'
                id='wishlist-search'
                placeholder='Search for wishlist by name'
            />
            <div className='text-lg font-semibold'>My wishlists</div>
            <div className='wishlist-wrapper'>
                {wish_lists?.map(({ _id, name, cover_image }) => (
                    <Link to={`/wishlists/${_id}`} key={_id} className='wishlist-item'>
                        <img src={cover_image?.url} alt={name} />
                        <div
                            className='content'
                            style={{ backgroundColor: theme.light_background }}>
                            <div className='name' style={{ color: theme.color }}>
                                {name.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
