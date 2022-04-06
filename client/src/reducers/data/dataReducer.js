import { alreadyExists } from '../../utils';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../../hooks/useLocalStorage';

// const productData = data?.map((item) => ({ ...item, _id: v4() }));
const booksFromLocalStorage = getDataFromLocalStorage('books');
// if (!getDataFromLocalStorage('books')) saveDataToLocalStorage('books', productData);

// ! Shift the entire codebase to adopt the new cart and read_list values from authContext
export const initialState = {
    genres: [],
    authors: [],
    priceFilter: '',
    genreFilters: [],
    authorFilters: [],
    toasts: [],
    books: booksFromLocalStorage || [],
    cart: getDataFromLocalStorage('cart') || {
        _id: 'guest',
        user: 'guest',
        data: [],
        checkout: { subtotal: 0, total: 0 },
    },
    wishlists: getDataFromLocalStorage('wishlists') || [],
};

export const reducer = (state, { type, payload }) => {
    console.log('Data dispatch => ', { type, payload });
    let currentUser = getDataFromLocalStorage('currentUser') || 'guest';
    // console.log('action: ', { type, payload });
    let updatedCart = [],
        updatedWishlist = [],
        tempState = {};

    const eliminateDuplicatesById = (arraySet) =>
        arraySet.reduce((acc, curVal) => {
            tempState[curVal._id] ? (tempState[curVal._id] += 1) : (tempState[curVal._id] = 1);
            if (tempState[curVal._id] <= 1) return [...acc, curVal];
            return [...acc];
        }, []);

    const eliminateDuplicates = (arraySet) =>
        arraySet.reduce((acc, curVal) => {
            tempState[curVal] ? (tempState[curVal] += 1) : (tempState[curVal] = 1);
            if (tempState[curVal] <= 1) return [...acc, curVal];
            return [...acc];
        }, []);

    switch (type) {
        case 'SET_TOAST': {
            const { data } = payload;
            // const _id = v4();

            return {
                ...state,
                toasts: [...state.toasts, data],
            };
        }

        case 'UNSET_TOAST': {
            const {
                data: { toastId },
            } = payload;

            return {
                ...state,
                toasts: state.toasts.filter((toast) => toast._id !== toastId),
            };
        }

        case 'SET_GENRES': {
            return { ...state, genres: eliminateDuplicates([...state.genres, ...payload]) };
        }

        case 'SET_AUTHORS': {
            return { ...state, authors: eliminateDuplicates([...state.authors, ...payload]) };
        }

        case 'STOREBOOKS': {
            saveDataToLocalStorage('books', payload);
            return { ...state, books: [...state.books, ...payload] };
        }

        case 'SETUP_NEW_USER': {
            return {
                ...state,
                cart: {
                    _id: payload._id,
                    user: payload.user,
                    data: eliminateDuplicatesById(payload.data),
                    checkout: payload.checkout,
                },
                // ! In wishlists, the wishlists in Guest Account will be created on the DB and added to the user's wishlist array
                wishlists: payload.wishlists,
            };
        }

        case 'FILTER_BY_GENRE': {
            return {
                ...state,
                genreFilters: [...payload],
            };
        }

        case 'SORT_BY_PRICE': {
            return { ...state, priceFilter: payload === state.priceFilter ? '' : payload };
        }

        case 'FILTER_BY_AUTHOR': {
            return {
                ...state,
                authorFilters: [...payload],
            };
        }

        case 'SET_CART': {
            const { cart } = payload;
            updatedCart = {
                _id: cart._id,
                user: cart.user,
                data: cart.data,
                checkout: cart.checkout,
            };

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: updatedCart,
            };
        }

        case 'ADD_TO_CART': {
            updatedCart = {
                ...state.cart,
                data: [...state.cart.data, ...payload.data],
                checkout: payload.checkout,
            };

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: { ...updatedCart },
            };
        }

        case 'UPDATE_CART_ITEM': {
            updatedCart = {
                ...state.cart,
                data: state.cart.data.map((item) =>
                    (item.book._id === payload._id &&
                        item.variant.type === payload.updatedItem.variant.type) ||
                    item._id === payload.updatedItem._id
                        ? payload.updatedItem
                        : item
                ),
                checkout: payload.checkout,
            };

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: { ...updatedCart },
            };
        }

        case 'REMOVE_FROM_CART': {
            updatedCart = {
                ...state.cart,
                data: state.cart.data.filter(
                    (dataItem) =>
                        dataItem.book._id !== payload._id ||
                        (dataItem.book._id === payload._id &&
                            dataItem.variant.type !== payload.variant.type)
                ),
                checkout: payload.checkout,
            };

            saveDataToLocalStorage('cart', updatedCart);
            return { ...state, cart: { ...updatedCart } };
        }

        case 'SET_WISHLISTS': {
            const { wishlists } = payload;
            updatedWishlist = eliminateDuplicatesById([...wishlists]);

            // localStorage.removeItem('currentUser');
            // localStorage.removeItem('wishlists');
            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };
        }

        case 'UPDATE_WISHLIST': {
            const { wishlist: wishlistPayload } = payload;
            const wishlistExists =
                state.wishlists.findIndex((wishlist) => wishlist._id === wishlistPayload._id) !==
                -1;
            updatedWishlist = wishlistExists
                ? state.wishlists.map((wishlist) =>
                      wishlist._id === wishlistPayload._id ? wishlistPayload : wishlist
                  )
                : [...state.wishlists, wishlistPayload];

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };
        }

        case 'CREATE_WISHLIST': {
            updatedWishlist = [...state.wishlists, ...payload];

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return { ...state, wishlists: updatedWishlist };
        }

        case 'DELETE_WISHLIST': {
            updatedWishlist = state.wishlists.filter(
                (wishlistItem) => wishlistItem._id !== payload.wishlistId
            );

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };
        }

        case 'ADD_TO_WISHLIST': {
            updatedWishlist = state.wishlists.map((wishlist) =>
                wishlist._id === payload.wishlistId
                    ? {
                          ...wishlist,
                          data: [...wishlist.data, ...payload.data].reduce((acc, curVal) => {
                              tempState[curVal.book._id]
                                  ? (tempState[curVal.book._id] += 1)
                                  : (tempState[curVal.book._id] = 1);
                              if (tempState[curVal.book._id] <= 1) return [...acc, curVal];
                              return [...acc];
                          }, []),
                          estimated_price: payload.estimated_price,
                      }
                    : wishlist
            );

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };
        }

        // ! update the entire function
        case 'REMOVE_FROM_WISHLIST': {
            updatedWishlist = state.wishlists.map((wishlistItem) => {
                if (wishlistItem._id === payload.wishlistId) {
                    return {
                        ...wishlistItem,
                        data: wishlistItem.data.filter(
                            (wishlistProduct) =>
                                wishlistProduct.book._id !== payload.wishlistItem._id
                        ),
                        estimated_price: payload.estimated_price,
                    };
                }
                return wishlistItem;
            });

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: [...updatedWishlist],
            };
        }

        default:
            return state;
    }
};

// case 'TRANSFER_GUEST_DATA_TO_USER':
//     const guestUserData = {
//         cart: state.cart[state.cart.findIndex((item) => item.userId === 'guest')].data,
//         wishlists:
//             state.wishlists[state.wishlists.findIndex((item) => item.userId === 'guest')]
//                 .data,
//     };
//     return {
//         ...state,
//         cart: state.cart.map((cartItem) =>
//             cartItem.userId === payload.currentUser
//                 ? {
//                       ...cartItem,
//                       data: eliminateDuplicatesById(cartItem.data.concat(guestUserData.cart)),
//                   }
//                 : cartItem.userId === 'guest'
//                 ? { ...cartItem, data: [] }
//                 : cartItem
//         ),
//         wishlists: state.wishlists.map((wishlistItem) =>
//             wishlistItem.userId === payload.currentUser
//                 ? {
//                       ...wishlistItem,
//                       data: eliminateDuplicatesById(
//                           wishlistItem.data.concat(guestUserData.wishlists)
//                       ),
//                   }
//                 : wishlistItem.userId === 'guest'
//                 ? { ...wishlistItem, data: [] }
//                 : wishlistItem
//         ),
//     };
