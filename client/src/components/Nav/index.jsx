import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './nav.scss';

// React components
import { Modal } from '../Modal';
import { AuthModal } from '../AuthModal';
import { CartIcon } from '../../react_icons/CartIcon';
import { DarkModeIcon } from '../../react_icons/DarkModeIcon';
import { WishListIcon } from '../../react_icons/WishListIcon';
import { LightModeIcon } from '../../react_icons/LightModeIcon';

export const Nav = () => {
    const [_, dataDispatch] = useDataLayer();
    const { theme, isLightTheme, setTheme } = useTheme();
    const [{ currentUser }, authDispatch] = useAuth();
    const [authModal, setAuthModal] = useState({ isActive: false, authState: 'signup' });

    const toggleTheme = () => setTheme((prevState) => !prevState);

    useEffect(() => {
        // dataDispatch({ type: 'TRANSFER_GUEST_DATA_TO_USER', payload: { currentUser } });
        console.log('Re-render because of change in currentUser (NavComp)', currentUser);
    }, [currentUser]);

    return (
        <>
            <nav style={{ backgroundColor: theme.dark_background, color: theme.color }}>
                <div className='nav'>
                    <h1 className='font-lg logo margin-reset' style={{ marginRight: '2rem' }}>
                        <Link to='/' style={{ color: theme.color }}>
                            Bibliophile
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
                                {currentUser._id === 'guestUser' && (
                                    <>
                                        <li
                                            onClick={() =>
                                                setAuthModal((prevState) => ({
                                                    ...prevState,
                                                    isActive: true,
                                                    authState: 'login',
                                                }))
                                            }
                                            style={{
                                                borderBottom: `2px solid ${theme.light_background}`,
                                            }}
                                        >
                                            Login
                                        </li>
                                        <li
                                            onClick={() =>
                                                setAuthModal((prevState) => ({
                                                    ...prevState,
                                                    isActive: true,
                                                    authState: 'signup',
                                                }))
                                            }
                                            style={{
                                                borderBottom: `2px solid ${theme.light_background}`,
                                            }}
                                        >
                                            Signup
                                        </li>
                                    </>
                                )}
                                {currentUser._id !== 'guestUser' && (
                                    <li
                                        onClick={() => authDispatch({ type: 'LOGOUT' })}
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
                        <Link to='/cart'>
                            <CartIcon
                                fill={theme.constants.icon}
                                style={{ width: '24px', height: '24px' }}
                            />
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
            {authModal.isActive && (
                <Modal setIsModalActive={setAuthModal}>
                    <AuthModal auth={authModal.authState} setAuthModal={setAuthModal} />
                </Modal>
            )}
        </>
    );
};
