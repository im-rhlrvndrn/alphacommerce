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
    const [{ currentUser }, authDispatch] = useAuth();
    const [{ cart, wishlists }, dataDispatch] = useDataLayer();
    const [authState, setAuthState] = useState(auth);
    const [authData, setAuthData] = useState({});

    const updateAuthData = (event) =>
        setAuthData((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));

    const authActionHandler = async (event, { action }) => {
        try {
            event.preventDefault();
            if (action === 'login') {
                const {
                    data: {
                        success,
                        data: { token, user },
                    },
                } = await axios.post('/auth/login', {
                    email: authData.auth_email,
                    password: authData.auth_password,
                });

                console.log('Login Response: ', { token, user });
                if (success) {
                    authDispatch({
                        type: 'LOGIN',
                        payload: { ...user },
                    });
                    // ! Make another API call to update the cart details
                    const {
                        data: { success, data, toast },
                    } = await axios.post(`carts/${user.cart._id}`, {
                        multi: true,
                        data: [...cart.data],
                        type: 'ADD_TO_CART',
                        cart: null,
                    });
                    if (success) {
                        const {
                            data: { success, data, toast },
                        } = await axios.get(`carts/${user.cart._id}`);
                        if (success)
                            dataDispatch({
                                type: 'SET_CART',
                                payload: {
                                    cart: {
                                        ...data.cart,
                                    },
                                },
                            });
                    }
                }
            } else if (action === 'signup') {
                const {
                    data: {
                        success,
                        data: { token, user },
                        toast,
                    },
                } = await axios.post('/auth/signup', {
                    full_name: authData.auth_fullname,
                    email: authData.auth_email,
                    password: authData.auth_password,
                    avatar: {},
                });

                console.log('Signup data: ', { success, data: { token, user }, toast });
                if (success) {
                    authDispatch({
                        type: 'SIGNUP',
                        payload: { ...user },
                    });
                    const {
                        data: { success, data, toast },
                    } = await axios.post(`carts/${user.cart}`, {
                        multi: true,
                        data: [...cart.data],
                        type: 'ADD_TO_CART',
                        cart: null,
                    });
                    if (success) {
                        const {
                            data: { success, data, toast },
                        } = await axios.get(`carts/${user.cart}`);
                        if (success)
                            dataDispatch({
                                type: 'SET_CART',
                                payload: {
                                    cart: {
                                        ...data.cart,
                                    },
                                },
                            });
                    }
                }
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
