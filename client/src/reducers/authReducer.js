import { getDataFromLocalStorage, saveDataToLocalStorage } from '../hooks/useLocalStorage';
/*
 user ={
    username: {
        text: 'im_rhlrvndrn',
    },
    id: 'kflj2p4u5hkj1kj45h4yi4h3i5h',
    full_name: {
        text: 'Rahul Ravindran',
    },
    email: {
        is_verified: false,
        text: 'rahulr1116@gmail.com',
    },
    password: {
        text: 'dsklfjkrbtkrjhtjkheb342kjj5345234', // Hashed value
    },
    cart: [],
    read_lists: [],
 }
*/

export const initialState = {
    users: getDataFromLocalStorage('users') || [
        {
            id: 'guest',
            username: { text: 'guest' },
            password: { text: 'guest123' },
            full_name: { text: 'Guest user' },
            email: { is_verified: false, text: null },
        },
    ],
    currentUser: getDataFromLocalStorage('currentUser') || 'guest',
};

export const reducer = (state, { type, payload }) => {
    console.log('auth dispatch:', { type, payload });

    switch (type) {
        case 'SIGNUP':
            saveDataToLocalStorage('users', [
                ...state.users,
                {
                    id: payload.id,
                    username: { text: payload.username },
                    full_name: { text: payload.full_name },
                    email: { is_verified: false, text: payload.email },
                    password: { text: payload.password },
                },
            ]);

            // * Setting up the new user
            saveDataToLocalStorage('currentUser', payload.id);
            saveDataToLocalStorage('cart', [
                ...getDataFromLocalStorage('cart'),
                { userId: payload.id, data: [] },
            ]);
            saveDataToLocalStorage('read_lists', [
                ...getDataFromLocalStorage('read_lists'),
                { userId: payload.id, data: [] },
            ]);
            return {
                ...state,
                currentUser: payload.id,
                users: [
                    ...state.users,
                    {
                        id: payload.id,
                        username: { text: payload.username },
                        full_name: { text: payload.full_name },
                        email: { is_verified: false, text: payload.email },
                        password: { text: payload.password },
                    },
                ],
            };

        case 'LOGIN':
            const validUser = state.users.filter(
                (user) =>
                    user.username.text === payload.username &&
                    user.password.text === payload.password
            );
            saveDataToLocalStorage(
                'currentUser',
                validUser.length === 0 ? 'guest' : validUser[0].id
            );
            // saveDataToLocalStorage('cart', [getDataFromLocalStorage('cart')])
            // ! Make a transferData function to transfer all the Guest account data into a verified
            // ! user account
            // The function call goes here
            console.log(validUser);
            return {
                ...state,
                currentUser: validUser.length > 0 ? validUser[0].id : 'guest',
            };

        case 'LOGOUT':
            saveDataToLocalStorage('currentUser', 'guest');
            return {
                ...state,
                currentUser: 'guest',
            };

        default:
            return state;
    }
};
