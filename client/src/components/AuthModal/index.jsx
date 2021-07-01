import { v4 } from 'uuid';
import axios from '../../axios';
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useModal } from '../../context/ModalProvider';
import { useDataLayer } from '../../context/DataProvider';
import { withModalOverlay } from '../../hoc/withModalOverlay';

// React components
import { InputGroup } from '../InputGroup';

// styles
import './authmodal.scss';

export const AuthModal = ({ auth = 'signup', modal, dispatchType }) => {
    const { theme } = useTheme();
    const { setToast } = useToast();
    const [_, modalDispatch] = useModal();
    const [{ currentUser }, authDispatch] = useAuth();
    const [{ cart }, dataDispatch] = useDataLayer();
    const [authState, setAuthState] = useState(auth);
    const [authData, setAuthData] = useState({});

    const updateAuthData = (event) =>
        setAuthData((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));

    const mergeGuestCartItems = async (cartId, cartItems) => {
        try {
            const {
                data: { success },
            } = await axios.post(`carts/${cartId}`, {
                multi: true,
                data: [...cartItems],
                type: 'ADD_TO_CART',
                cart: null,
            });

            if (success) {
                const {
                    data: { success, data },
                } = await axios.get(`carts/${cartId}`);
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
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || 'Data sync was not able to complete',
            });
        }
    };

    const authActionHandler = async (event, { action }) => {
        try {
            event.preventDefault();
            if (action === 'login') {
                const {
                    data: {
                        success,
                        data: { user },
                        toast,
                    },
                } = await axios.post('/auth/login', {
                    email: authData.auth_email,
                    password: authData.auth_password,
                });

                if (success) {
                    authDispatch({
                        type: 'LOGIN',
                        payload: { ...user },
                    });
                    dataDispatch({
                        type: 'SET_TOAST',
                        payload: {
                            data: {
                                ...toast,
                                _id: v4(),
                            },
                        },
                    });
                    // ! Make another API call to update the cart details
                    await mergeGuestCartItems(user.cart._id, cart.data);
                }
            } else if (action === 'signup') {
                const {
                    data: {
                        success,
                        data: { user },
                        toast,
                    },
                } = await axios.post('/auth/signup', {
                    full_name: authData.auth_fullname,
                    email: authData.auth_email,
                    password: authData.auth_password,
                    avatar: {},
                });

                if (success) {
                    setToast({
                        ...toast,
                        _id: v4(),
                    });
                    authDispatch({
                        type: 'SIGNUP',
                        payload: { ...user },
                    });
                    await mergeGuestCartItems(user.cart, cart.data);
                }
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || 'Data sync was not able to complete',
            });
        } finally {
            modalDispatch({ type: 'UPDATE_AUTH_MODAL' });
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
            <form
                style={{ color: theme.color }}
                onSubmit={(event) => authActionHandler(event, { action: authState })}>
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
                    }}>
                    {authState}
                </button>
                <div
                    className='form-toggle'
                    onClick={() =>
                        setAuthState((prevState) => (prevState === 'signup' ? 'login' : 'signup'))
                    }>
                    {authState === 'signup' ? 'Already a member? Login' : 'Create a new account?'}
                </div>
            </form>
        </div>
    );
};

const EnhancedAuthModal = withModalOverlay(AuthModal);
export { EnhancedAuthModal };
