import axios from '../../axios';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDataLayer } from '../../context/DataProvider';

// React components
import { InputGroup } from '../InputGroup';

// styles
import './authmodal.scss';

export const AuthModal = ({ auth = 'signup', setAuthModal }) => {
    const { theme } = useTheme();
    const [_, authDispatch] = useAuth();
    const [{ cart, wishlists }, dataDispatch] = useDataLayer();
    const [authState, setAuthState] = useState(auth);
    const [authData, setAuthData] = useState({});

    const updateAuthData = (event) =>
        setAuthData((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));

    const authActionHandler = async (event, { action }) => {
        try {
            event.preventDefault();
            if (action === 'login') {
                const loginResponse = await axios.post('/auth/login', {
                    email: authData.auth_email,
                    password: authData.auth_password,
                });

                console.log('Login Response: ', loginResponse);
                authDispatch({
                    type: 'LOGIN',
                    payload: {
                        _id: loginResponse.data.data.user._id,
                        email: loginResponse.data.data.user.email,
                        password: loginResponse.data.data.user.password,
                        full_name: loginResponse.data.data.user.full_name,
                        avatar: loginResponse.data.data.user.avatar,
                    },
                });
            } else if (action === 'signup') {
                const response = await axios.post('/auth/signup', {
                    full_name: authData.auth_fullname,
                    email: authData.auth_email,
                    password: authData.auth_password,
                    avatar: {},
                });

                console.log('Signup data: ', response);
                authDispatch({
                    type: 'SIGNUP',
                    payload: {
                        id: response.data.data._id,
                        email: response.data.data.email,
                        full_name: response.data.data.full_name,
                        username: response.data.data.username,
                        password: response.data.data.password,
                    },
                });
                dataDispatch({
                    type: 'SETUP_NEW_USER',
                    payload: {
                        _id: response.data.data._id,
                        data: cart,
                        user: response.data.data.user,
                        wishlists: wishlists,
                    },
                });
            } else {
                return setAuthModal((prevState) => ({
                    ...prevState,
                    isActive: !prevState.isActive,
                }));
            }

            return setAuthModal((prevState) => ({ ...prevState, isActive: !prevState.isActive }));
        } catch (error) {
            console.log('Error => ', error.response);
        }
    };

    const inputs = [
        {
            condition: ['signup'],
            label: {
                style: { color: theme.color },
            },
            input: {
                name: 'auth_fullname',
                placeholder: 'Full name',
                style: { backgroundColor: theme.light_background, color: theme.color },
                type: 'text',
                value: authState.auth_fullname,
            },
        },
        {
            condition: ['signup'],
            label: {
                style: { color: theme.color },
            },
            input: {
                name: 'auth_username',
                placeholder: 'Username',
                style: { backgroundColor: theme.light_background, color: theme.color },
                type: 'text',
                value: authState.auth_username,
            },
        },
        {
            condition: ['signup', 'login'],
            label: {
                style: { color: theme.color },
            },
            input: {
                name: 'auth_email',
                placeholder: 'Email',
                style: { backgroundColor: theme.light_background, color: theme.color },
                type: 'email',
                value: authState.auth_email,
            },
        },
        {
            condition: ['signup', 'login'],
            label: {
                style: { color: theme.color },
            },
            input: {
                name: 'auth_password',
                placeholder: 'Password',
                style: { backgroundColor: theme.light_background, color: theme.color },
                type: 'password',
                value: authState.auth_password,
            },
        },
    ];

    return (
        <div className='auth-modal'>
            <form onSubmit={(event) => authActionHandler(event, { action: authState })}>
                {inputs?.map(
                    (input) =>
                        input.condition.includes(authState) && (
                            <InputGroup
                                onChange={updateAuthData}
                                data={{ label: input.label, input: input.input }}
                            />
                        )
                )}
                {authState === 'login' && (
                    <div className='form-cta' style={{ color: theme.color }}>
                        Forgot password?
                    </div>
                )}
                <button
                    type='submit'
                    style={{
                        backgroundColor: theme.constants.primary,
                        color: theme.constants.dark,
                    }}
                >
                    {authState}
                </button>
                <div
                    className='form-toggle'
                    onClick={() =>
                        setAuthState((prevState) => (prevState === 'signup' ? 'login' : 'signup'))
                    }
                >
                    {authState === 'signup' ? 'Already a member? Login' : 'Create a new account?'}
                </div>
            </form>
        </div>
    );
};
