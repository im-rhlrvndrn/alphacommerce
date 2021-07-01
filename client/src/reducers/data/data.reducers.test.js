import { reducer } from './dataReducer';

describe('Testing Data reducer => ', () => {
    it('should test SET_TOAST ( Adding new toast )', () => {
        let action = {
            type: 'SET_TOAST',
            payload: {
                data: {
                    _id: '123',
                    status: 'success',
                    message: 'Added to cart',
                },
            },
        };

        const initialState = {
            toasts: [],
        };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            toasts: [
                {
                    _id: '123',
                    status: 'success',
                    message: 'Added to cart',
                },
            ],
        });

        action = {
            type: 'SET_TOAST',
            payload: {
                data: {
                    _id: '1234',
                    status: 'success',
                    message: 'Removed from cart',
                },
            },
        };

        state = reducer(state, action);
        expect(state).toEqual({
            toasts: [
                {
                    _id: '123',
                    status: 'success',
                    message: 'Added to cart',
                },
                {
                    _id: '1234',
                    status: 'success',
                    message: 'Removed from cart',
                },
            ],
        });
    });

    it('should test UNSET_TOAST ( Removing a toast )', () => {
        let action = {
            type: 'UNSET_TOAST',
            payload: {
                data: {
                    toastId: '123',
                },
            },
        };

        let initialState = {
            toasts: [
                {
                    _id: '123',
                    status: 'success',
                    message: 'Added to cart',
                },
                {
                    _id: '1234',
                    status: 'success',
                    message: 'Removed from cart',
                },
            ],
        };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            toasts: [
                {
                    _id: '1234',
                    status: 'success',
                    message: 'Removed from cart',
                },
            ],
        });

        action = {
            type: 'UNSET_TOAST',
            payload: {
                data: { toastId: '1234' },
            },
        };
        state = reducer(state, action);
        expect(state).toEqual({
            toasts: [],
        });
    });

    it('shoud test SET_GENRES', () => {
        let action = {
            type: 'SET_GENRES',
            payload: ['web development', 'horror', 'web development', 'finance'],
        };

        const initialState = { genres: [] };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            genres: ['web development', 'horror', 'finance'],
        });

        action = { type: 'SET_GENRES', payload: ['horror', 'action'] };
        state = reducer(state, action);
        expect(state).toEqual({
            genres: ['web development', 'horror', 'finance', 'action'],
        });
    });

    it('shoud test SET_AUTHORS', () => {
        let action = {
            type: 'SET_AUTHORS',
            payload: ['Peter Thiel', 'Kyle Simpson', 'Peter Thiel', 'Morgan Housel'],
        };

        const initialState = { authors: [] };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            authors: ['Peter Thiel', 'Kyle Simpson', 'Morgan Housel'],
        });

        action = {
            type: 'SET_AUTHORS',
            payload: ['Peter Thiel', 'Stephen King'],
        };
        state = reducer(state, action);
        expect(state).toEqual({
            authors: ['Peter Thiel', 'Kyle Simpson', 'Morgan Housel', 'Stephen King'],
        });
    });

    it('should test STOREBOOKS', () => {
        const action = {
            type: 'STOREBOOKS',
            payload: [
                {
                    authors: ['Eric Jorgenson'],
                    cover_image: {
                        url: 'https://images-na.ssl-images-amazon.com/images/I/61VbL0FspqL.jpg',
                    },
                    createdAt: '2021-04-19T10:45:57.382Z',
                    entity: 'Book',
                    external_urls: {
                        amazon: 'https://www.amazon.in/Almanack-Naval-Ravikant-Wealth-Happiness/dp/1544514220',
                    },
                    genres: ['self-help'],
                    name: 'The Almanack of Naval Ravikant',
                    pages: 0,
                    payment: { currency: 'INR', coupon_codes: [], tax: [] },
                    ratings: {
                        weekly: { voter_count: 0, value: 0 },
                        average: 0,
                        reviews: [],
                        voter_count: 0,
                    },
                    summary: {},
                    updatedAt: '2021-04-19T10:45:57.382Z',
                    variants: [
                        {
                            price: 291,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'ebook',
                            isSelected: false,
                        },
                        {
                            price: 1291,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'paperback',
                            isSelected: true,
                        },
                        {
                            price: 1591,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'hardcover',
                            isSelected: false,
                        },
                    ],
                    __v: 0,
                    _id: '607d5f65dd3bb83af05d4d05',
                },
            ],
        };

        const initialState = {
            books: [],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            books: [
                {
                    authors: ['Eric Jorgenson'],
                    cover_image: {
                        url: 'https://images-na.ssl-images-amazon.com/images/I/61VbL0FspqL.jpg',
                    },
                    createdAt: '2021-04-19T10:45:57.382Z',
                    entity: 'Book',
                    external_urls: {
                        amazon: 'https://www.amazon.in/Almanack-Naval-Ravikant-Wealth-Happiness/dp/1544514220',
                    },
                    genres: ['self-help'],
                    name: 'The Almanack of Naval Ravikant',
                    pages: 0,
                    payment: { currency: 'INR', coupon_codes: [], tax: [] },
                    ratings: {
                        weekly: { voter_count: 0, value: 0 },
                        average: 0,
                        reviews: [],
                        voter_count: 0,
                    },
                    summary: {},
                    updatedAt: '2021-04-19T10:45:57.382Z',
                    variants: [
                        {
                            price: 291,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'ebook',
                            isSelected: false,
                        },
                        {
                            price: 1291,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'paperback',
                            isSelected: true,
                        },
                        {
                            price: 1591,
                            _id: '607d5f65dd3bb83af05d4d07',
                            type: 'hardcover',
                            isSelected: false,
                        },
                    ],
                    __v: 0,
                    _id: '607d5f65dd3bb83af05d4d05',
                },
            ],
        });
    });

    it('should test FILTER_BY_GENRE', () => {
        let action = {
            type: 'FILTER_BY_GENRE',
            payload: 'horror',
        };

        const initialState = { genreFilters: [] };
        let state = reducer(initialState, action);
        expect(state).toEqual({ genreFilters: ['horror'] });

        // Adding finance
        action = {
            type: 'FILTER_BY_GENRE',
            payload: 'finance',
        };
        state = reducer(state, action);
        expect(state).toEqual({ genreFilters: ['horror', 'finance'] });

        // Removing horror
        action = {
            type: 'FILTER_BY_GENRE',
            payload: 'horror',
        };
        state = reducer(state, action);
        expect(state).toEqual({ genreFilters: ['finance'] });
    });

    it('should test FILTER_BY_AUTHOR', () => {
        let action = {
            type: 'FILTER_BY_AUTHOR',
            payload: 'Kyle Simpson',
        };

        const initialState = { authorFilters: [] };
        let state = reducer(initialState, action);
        expect(state).toEqual({ authorFilters: ['Kyle Simpson'] });

        // Adding Morgan Housel
        action = {
            type: 'FILTER_BY_AUTHOR',
            payload: 'Morgan Housel',
        };
        state = reducer(state, action);
        expect(state).toEqual({ authorFilters: ['Kyle Simpson', 'Morgan Housel'] });

        // Removing Kyle Simpson
        action = {
            type: 'FILTER_BY_AUTHOR',
            payload: 'Kyle Simpson',
        };
        state = reducer(state, action);
        expect(state).toEqual({ authorFilters: ['Morgan Housel'] });
    });

    it('should test SORT_BY_PRICE', () => {
        let action = {
            type: 'SORT_BY_PRICE',
            payload: 'low-to-high',
        };

        const initialState = { priceFilter: '' };
        let state = reducer(initialState, action);
        expect(state).toEqual({ priceFilter: 'low-to-high' });

        action = {
            type: 'SORT_BY_PRICE',
            payload: 'high-to-low',
        };
        state = reducer(state, action);
        expect(state).toEqual({ priceFilter: 'high-to-low' });
    });

    it('should test SET_CART', () => {
        const action = {
            type: 'SET_CART',
            payload: {
                cart: {
                    _id: 'usersCartId',
                    user: 'usersUniqueId',
                    data: [],
                    checkout: {
                        subtotal: 0,
                        total: 0,
                    },
                },
            },
        };

        const initialState = {
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [],
                checkout: { subtotal: 0, total: 0 },
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            cart: {
                _id: 'usersCartId',
                user: 'usersUniqueId',
                data: [],
                checkout: {
                    subtotal: 0,
                    total: 0,
                },
            },
        });
    });

    it('should test ADD_TO_CART', () => {
        const action = {
            type: 'ADD_TO_CART',
            payload: {
                data: [
                    {
                        _id: '1',
                        name: 'Psychology of money',
                        price: 499,
                    },
                ],
                checkout: {
                    subtotal: 499,
                    total: 499,
                },
            },
        };

        const initialState = {
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [],
                checkout: { subtotal: 0, total: 0 },
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [
                    {
                        _id: '1',
                        name: 'Psychology of money',
                        price: 499,
                    },
                ],
                checkout: { subtotal: 499, total: 499 },
            },
        });
    });

    it('should test UPDATE_CART_ITEM', () => {
        const action = {
            type: 'UPDATE_CART_ITEM',
            payload: {
                _id: 'cartItemId',
                updatedItem: {
                    _id: 'cartItemId',
                    book: { _id: 'bookId' },
                    variant: {
                        _id: 'variant1Id',
                        type: 'paperback',
                        price: 998,
                    },
                    quantity: 2,
                },
                checkout: {
                    subtotal: 998,
                    total: 998,
                },
            },
        };

        const initialState = {
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [
                    {
                        _id: 'cartItemId',
                        book: { _id: 'bookId' },
                        variant: {
                            _id: 'variant1Id',
                            type: 'paperback',
                            price: 499,
                        },
                        quantity: 1,
                    },
                ],
                checkout: { subtotal: 499, total: 499 },
            },
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [
                    {
                        _id: 'cartItemId',
                        book: { _id: 'bookId' },
                        variant: {
                            _id: 'variant1Id',
                            type: 'paperback',
                            price: 998,
                        },
                        quantity: 2,
                    },
                ],
                checkout: { subtotal: 998, total: 998 },
            },
        });
    });

    it('should test REMOVE_FROM_CART', () => {
        let action = {
            type: 'REMOVE_FROM_CART',
            payload: {
                _id: 'book1Id',
                variant: {
                    type: 'paperback',
                    price: 499,
                    _id: 'variant1Id',
                },
                checkout: {
                    subtotal: 499,
                    total: 499,
                },
            },
        };

        const initialState = {
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [
                    {
                        _id: 'cartItem1Id',
                        book: { _id: 'book1Id' },
                        variant: {
                            _id: 'variant1Id',
                            type: 'paperback',
                            price: 499,
                        },
                        quantity: 2,
                    },
                    {
                        _id: 'cartItem2Id',
                        book: { _id: 'book2Id' },
                        variant: {
                            _id: 'variant2Id',
                            type: 'paperback',
                            price: 499,
                        },
                        quantity: 1,
                    },
                ],
                checkout: { subtotal: 1497, total: 1497 },
            },
        };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [
                    {
                        _id: 'cartItem2Id',
                        book: { _id: 'book2Id' },
                        variant: {
                            _id: 'variant2Id',
                            type: 'paperback',
                            price: 499,
                        },
                        quantity: 1,
                    },
                ],
                checkout: { subtotal: 499, total: 499 },
            },
        });

        action = {
            type: 'REMOVE_FROM_CART',
            payload: {
                _id: 'book2Id',
                variant: {
                    _id: 'variant2Id',
                    type: 'paperback',
                    price: 499,
                },
                checkout: {
                    subtotal: 0,
                    total: 0,
                },
            },
        };

        state = reducer(state, action);
        expect(state).toEqual({
            cart: {
                _id: 'guest',
                user: 'guest',
                data: [],
                checkout: { subtotal: 0, total: 0 },
            },
        });
    });
});

describe('Testing Wishlist reducers', () => {
    it(`should initialize user's wishlists`, () => {
        const action = {
            type: 'SET_WISHLISTS',
            payload: {
                wishlists: [
                    {
                        _id: 'wishlist1Id',
                        name: { name: 'Wishlist1', duplicate_count: 0 },
                        data: [
                            {
                                _id: 'wishlistItem1Id',
                                book: 'book1Id',
                            },
                        ],
                        user: 'user1Id',
                        estimated_price: 499,
                    },
                ],
            },
        };

        const initialState = {
            wishlists: [],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        });
    });

    it('should test update wishlist data', () => {
        let action = {
            type: 'UPDATE_WISHLIST',
            payload: {
                wishlist: {
                    _id: 'wishlist1Id',
                    name: { name: 'Updated wishlist name', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            },
        };

        const initialState = {
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        };

        let state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Updated wishlist name', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        });
    });

    it('should test create new wishlist, if already exists then make a copy', () => {
        let action = {
            type: 'CREATE_WISHLIST',
            payload: [
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: 'book2Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        };

        const initialState = {
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: 'book2Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        });
    });

    it('should test delete a wishlist', () => {
        const action = {
            type: 'DELETE_WISHLIST',
            payload: { wishlistId: 'wishlist2Id' },
        };

        const initialState = {
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: 'book2Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: 'book1Id',
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        });
    });

    it('should add a product in the wishlist', () => {
        const action = {
            type: 'ADD_TO_WISHLIST',
            payload: {
                wishlistId: 'wishlist1Id',
                data: [
                    {
                        _id: 'wishlistItem2Id',
                        book: {
                            _id: 'book11Id',
                            variants: [{ type: 'paperback', price: 499 }],
                        },
                    },
                ],
                estimated_price: 998,
            },
        };

        const initialState = {
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: { _id: 'book2Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: {
                                _id: 'book11Id',
                                variants: [{ type: 'paperback', price: 499 }],
                            },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: { _id: 'book2Id', variants: [{ type: 'paperback', price: 499 }] },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        });
    });

    it('should remove a product from the wishlist', () => {
        const action = {
            type: 'REMOVE_FROM_WISHLIST',
            payload: {
                wishlistId: 'wishlist2Id',
                wishlistItem: { _id: 'book1Id' },
                estimated_price: 499,
            },
        };

        const initialState = {
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id' },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id' },
                        },
                        {
                            _id: 'wishlistItem2Id',
                            book: { _id: 'book2Id' },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 998,
                },
            ],
        };

        const state = reducer(initialState, action);
        expect(state).toEqual({
            wishlists: [
                {
                    _id: 'wishlist1Id',
                    name: { name: 'Wishlist1', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem1Id',
                            book: { _id: 'book1Id' },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
                {
                    _id: 'wishlist2Id',
                    name: { name: 'New wishlist 2', duplicate_count: 0 },
                    data: [
                        {
                            _id: 'wishlistItem2Id',
                            book: { _id: 'book2Id' },
                        },
                    ],
                    user: 'user1Id',
                    estimated_price: 499,
                },
            ],
        });
    });
});
