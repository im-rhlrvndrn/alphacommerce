import axios from '../../axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import useWindowSize from '../../hooks/useWindowSize';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './nav.scss';

// React components
import { Modal } from '../Modal';
import { MobileNav } from './MobileNav';
import { AuthModal } from '../AuthModal';
import { DesktopNav } from './DesktopNav';

export const Nav = () => {
    const _window = useWindowSize();
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
            {/* <MobileNav /> */}
            <DesktopNav />
        </>
    );
};
