import Cookies from 'js-cookie';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../../hooks/useLocalStorage';
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
    currentUser: getDataFromLocalStorage('currentUser') || {
        _id: 'guest',
        email: null,
        password: null,
        full_name: 'Guest User',
        avatar: { url: '' },
    },
};

export const reducer = (state, { type, payload }) => {
    console.log('auth dispatch:', { type, payload });

    switch (type) {
        case 'SIGNUP':
            // * Setting up the new user
            saveDataToLocalStorage('currentUser', {
                ...payload,
            });

            return {
                ...state,
                currentUser: {
                    ...payload,
                },
            };

        case 'LOGIN':
            // * const cookie = Cookies.get('userId');
            // saveDataToLocalStorage(
            //     'currentUser',
            //     validUser.length === 0 ? 'guest' : validUser[0]._id
            // );
            saveDataToLocalStorage('currentUser', {
                ...payload,
            });
            // * saveDataToLocalStorage('currentUser', cookie ? cookie : 'guest');
            // saveDataToLocalStorage('cart', [getDataFromLocalStorage('cart')]);
            // ! Make a transferData function to transfer all the Guest account data into a verified
            // ! user account
            // The function call goes here
            // console.log(validUser);
            return {
                ...state,
                currentUser: {
                    ...payload,
                },
            };

        // * return {
        // *    ...state,
        // *    currentUser: cookie ? cookie : 'guest',
        // * };

        case 'LOGOUT':
            saveDataToLocalStorage('currentUser', {
                _id: 'guest',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            });
            return {
                ...state,
                currentUser: {
                    _id: 'guest',
                    email: null,
                    password: null,
                    full_name: 'Guest User',
                    avatar: { url: '' },
                },
            };

        default:
            return state;
    }
};
