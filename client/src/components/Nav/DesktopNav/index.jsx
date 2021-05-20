import axios from '../../../axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthProvider';
import useWindowSize from '../../../hooks/useWindowSize';
import { useModal } from '../../../context/ModalProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// React components
import { CartIcon } from '../../../react_icons/CartIcon';
import { DarkModeIcon } from '../../../react_icons/DarkModeIcon';
import { WishListIcon } from '../../../react_icons/WishListIcon';
import { LightModeIcon } from '../../../react_icons/LightModeIcon';

export const DesktopNav = ({ setAuthModal }) => {
    const _window = useWindowSize();
    const [_modal, modalDispatch] = useModal();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [{ currentUser }, authDispatch] = useAuth();
    const { theme, isLightTheme, setTheme } = useTheme();
    // const [authModal, setAuthModal] = useState({ isActive: false, authState: 'signup' });

    const toggleTheme = () => setTheme((prevState) => !prevState);

    const logout = async () => {
        try {
            const response = await axios.get('/auth/logout');
            if (response.data.success) {
                authDispatch({ type: 'LOGOUT' });
                dataDispatch({
                    type: 'SET_CART',
                    payload: {
                        cart: {
                            _id: 'guest',
                            user: 'guest',
                            data: [],
                            checkout: { subtotal: 0, total: 0 },
                        },
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav style={{ backgroundColor: theme.dark_background, color: theme.color }}>
            <div className='nav'>
                <h1 className='font-lg logo margin-reset' style={{ marginRight: '2rem' }}>
                    <Link to='/' style={{ color: theme.color }}>
                        AlphaReads
                    </Link>
                </h1>
                <input
                    className='searchbar'
                    type='text'
                    name='searchbar'
                    id='nav-searchbar'
                    placeholder='Search a book'
                />
                <Link to=''>
                    <span style={{ marginRight: '2rem', color: theme.color }}>
                        Hello, {currentUser?.full_name}
                        <ul
                            className='nav-dropdown'
                            style={{
                                backgroundColor: theme.dark_background,
                                color: theme.color,
                            }}
                        >
                            {currentUser._id === 'guest' && (
                                <>
                                    <li
                                        onClick={() =>
                                            modalDispatch({
                                                type: 'UPDATE_AUTH_MODAL',
                                                payload: { state: { authState: 'login' } },
                                            })
                                        }
                                        style={{
                                            borderBottom: `2px solid ${theme.light_background}`,
                                        }}
                                    >
                                        Login
                                    </li>
                                    <li
                                        onClick={() =>
                                            modalDispatch({
                                                type: 'UPDATE_AUTH_MODAL',
                                                payload: { state: { authState: 'signup' } },
                                            })
                                        }
                                        style={{
                                            borderBottom: `2px solid ${theme.light_background}`,
                                        }}
                                    >
                                        Signup
                                    </li>
                                </>
                            )}
                            {currentUser._id !== 'guest' && (
                                <li
                                    onClick={logout}
                                    style={{
                                        borderBottom: `2px solid ${theme.light_background}`,
                                    }}
                                >
                                    Logout
                                </li>
                            )}
                        </ul>
                    </span>
                </Link>
                <div className='cta-container'>
                    <Link to='/wishlists'>
                        <WishListIcon
                            fill={theme.constants.icon}
                            style={{ width: '24px', height: '24px' }}
                        />
                    </Link>
                    <Link to='/cart' state={{ cartState: 'cartState' }}>
                        <CartIcon
                            fill={theme.constants.icon}
                            style={{ width: '24px', height: '24px' }}
                        />
                        {cart?.data?.length > 0 && (
                            <div
                                className='badge-floating rounded'
                                style={{
                                    backgroundColor: theme.constants.primary,
                                    color: theme.constants.dark,
                                }}
                            >
                                {cart?.data?.length}
                            </div>
                        )}
                    </Link>
                    <button className='toggle-theme'>
                        {isLightTheme ? (
                            <DarkModeIcon fill={theme.constants.icon} onClick={toggleTheme} />
                        ) : (
                            <LightModeIcon fill={theme.constants.icon} onClick={toggleTheme} />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};
