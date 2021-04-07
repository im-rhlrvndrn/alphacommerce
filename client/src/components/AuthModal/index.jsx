import { v4 } from 'uuid';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// React components
import { InputGroup } from '../InputGroup';

// styles
import './authmodal.scss';

export const AuthModal = ({ auth = 'signup', setAuthModal }) => {
    const { theme } = useTheme();
    const [_, authDispatch] = useAuth();
    const [dataLayer, dataDispatch] = useDataLayer();
    const [authState, setAuthState] = useState(auth);
    const [authData, setAuthData] = useState({});

    const updateAuthData = (event) =>
        setAuthData((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));

    const authActionHandler = (event, { action }) => {
        event.preventDefault();
        if (action === 'login') {
            authDispatch({
                type: 'LOGIN',
                payload: { username: authData.auth_username, password: authData.auth_password },
            });
        } else if (action === 'signup') {
            const newUserId = v4();
            authDispatch({
                type: 'SIGNUP',
                payload: {
                    id: newUserId,
                    email: authData.auth_email,
                    full_name: authData.auth_fullname,
                    username: authData.auth_username,
                    password: authData.auth_password,
                },
            });
            dataDispatch({ type: 'SETUP_NEW_USER', payload: { id: newUserId } });
        } else {
            return setAuthModal((prevState) => ({ ...prevState, isActive: !prevState.isActive }));
        }

        return setAuthModal((prevState) => ({ ...prevState, isActive: !prevState.isActive }));
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
            condition: ['signup', 'login'],
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
            condition: ['signup'],
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
