import { reducer } from './authReducer.js';

describe('Testing Auth reducers', () => {
    it('should test LOGOUT functionality', () => {
        const action = {
            type: 'LOGOUT',
        };

        const initialState = {
            currentUser: {
                _id: 'randomuserid',
                email: 'useremail@gmail.com',
                password: null,
                full_name: 'User name',
                avatar: { url: '' },
                cart: {
                    checkout: { subtotal: 499, total: 499 },
                    data: [],
                    user: 'randomuserid',
                    _id: 'userscartid',
                },
                wishlists: [],
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            currentUser: {
                _id: 'guest',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            },
        });
    });

    it('should test LOGIN functionality', () => {
        const action = {
            type: 'LOGIN',
            payload: {
                address_tags: [],
                addresses: [],
                avatar: { url: '' },
                cart: {
                    checkout: { subtotal: 4065, total: 4065 },
                    entity: 'Cart',
                    _id: '607d114209444037c40e3c48',
                    data: [],
                    entity: 'Cart',
                    updatedAt: '2021-06-22T07:51:57.264Z',
                    user: '607d114209444037c40e3c49',
                },
                createdAt: '2021-04-19T05:12:34.921Z',
                email: 'rahulr1116@gmail.com',
                entity: 'User',
                full_name: 'Rahul Ravindran',
                password: null,
                updatedAt: '2021-04-27T15:59:00.297Z',
                wishlists: [],
                __v: 1,
                _id: '607d114209444037c40e3c49',
            },
        };

        const initialState = {
            currentUser: {
                _id: 'guest',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            currentUser: {
                address_tags: [],
                addresses: [],
                avatar: { url: '' },
                cart: {
                    checkout: { subtotal: 4065, total: 4065 },
                    entity: 'Cart',
                    _id: '607d114209444037c40e3c48',
                    data: [],
                    entity: 'Cart',
                    updatedAt: '2021-06-22T07:51:57.264Z',
                    user: '607d114209444037c40e3c49',
                },
                createdAt: '2021-04-19T05:12:34.921Z',
                email: 'rahulr1116@gmail.com',
                entity: 'User',
                full_name: 'Rahul Ravindran',
                password: null,
                updatedAt: '2021-04-27T15:59:00.297Z',
                wishlists: [],
                __v: 1,
                _id: '607d114209444037c40e3c49',
            },
        });
    });

    it('should test SIGNUP functionality', () => {
        const action = {
            type: 'SIGNUP',
            payload: {
                address_tags: [],
                addresses: [],
                avatar: { url: '' },
                cart: {
                    checkout: { subtotal: 4065, total: 4065 },
                    entity: 'Cart',
                    _id: '607d114209444037c40e3c48',
                    data: [],
                    entity: 'Cart',
                    updatedAt: '2021-06-22T07:51:57.264Z',
                    user: '607d114209444037c40e3c49',
                },
                createdAt: '2021-04-19T05:12:34.921Z',
                email: 'rahulr1116@gmail.com',
                entity: 'User',
                full_name: 'Rahul Ravindran',
                password: null,
                updatedAt: '2021-04-27T15:59:00.297Z',
                wishlists: [],
                __v: 1,
                _id: '607d114209444037c40e3c49',
            },
        };

        const initialState = {
            currentUser: {
                _id: 'guest',
                email: null,
                password: null,
                full_name: 'Guest User',
                avatar: { url: '' },
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            currentUser: {
                address_tags: [],
                addresses: [],
                avatar: { url: '' },
                cart: {
                    checkout: { subtotal: 4065, total: 4065 },
                    entity: 'Cart',
                    _id: '607d114209444037c40e3c48',
                    data: [],
                    entity: 'Cart',
                    updatedAt: '2021-06-22T07:51:57.264Z',
                    user: '607d114209444037c40e3c49',
                },
                createdAt: '2021-04-19T05:12:34.921Z',
                email: 'rahulr1116@gmail.com',
                entity: 'User',
                full_name: 'Rahul Ravindran',
                password: null,
                updatedAt: '2021-04-27T15:59:00.297Z',
                wishlists: [],
                __v: 1,
                _id: '607d114209444037c40e3c49',
            },
        });
    });
});
