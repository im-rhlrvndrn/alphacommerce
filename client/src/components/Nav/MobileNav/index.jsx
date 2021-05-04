import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeProvider';
import { HamburgerIcon } from '../../../react_icons/HamburgerIcon';

export const MobileNav = () => {
    const { theme } = useTheme();

    return (
        <nav style={{ backgroundColor: theme.dark_background, color: theme.color }}>
            <div className='nav pl-2 pr-2'>
                <NavHeader>
                    <HamburgerIcon fill={theme.color} />
                    <NavLogo theme={theme} />
                    <NavAvatar />
                </NavHeader>
                <NavList />
            </div>
        </nav>
    );
};

export const NavHeader = ({ children }) => {
    return <div className='nav-header w-100p flex flex-align-center'>{children}</div>;
};

export const NavLogo = ({ logo = 'AlphaReads', theme }) => {
    return (
        <h1 className='font-md logo margin-reset w-max flex-grow'>
            <Link
                to='/'
                style={{
                    color: theme.color,
                    display: 'inline-block',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                {logo}
            </Link>
        </h1>
    );
};

export const NavAvatar = ({
    altText = 'user avatar',
    imageURL = 'https://avatars.githubusercontent.com/u/43089715?s=400&u=576dc1103c15a7fb6de7278833d4d423a5868181&v=4',
}) => {
    return <img className='margin-reset icon-40 rounded' src={imageURL} alt={altText} />;
};

export const NavList = ({ listItems = ['Login', 'Signup'] }) => {
    /*
* structure for nav items
    const listItems = [
        {
            name: 'Auth',
            children: [ { name: 'Login' }, { name: 'Signup' } ]
        },
    ]
*/

    return (
        <div className='nav-menu'>
            <ul className='nav-list'>
                {listItems.map((item) => (
                    <li>{item}</li>
                ))}
            </ul>
        </div>
    );
};
