import { v4 } from 'uuid';
// import data from '../data.json';
import { alreadyExists } from '../utils';
import { productData as data } from '../data.js';
import { decrement, increment } from '../utils/math_helpers';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../hooks/useLocalStorage';
import { calculateSubTotal, calculateTax, calculateTotal, fixedTo } from '../utils/cart_helpers';

const productData = data?.map((item) => ({ ...item, _id: v4() }));
const productsFromLocalStorage = getDataFromLocalStorage('products') || productData;
if (!getDataFromLocalStorage('products')) saveDataToLocalStorage('products', productData);

// ! Shift the entire codebase to adopt the new cart and read_list values from authContext
export const initialState = {
    genres: [],
    authors: [],
    priceFilter: '',
    genreFilters: [],
    authorFilters: [],
    products: productsFromLocalStorage || [],
    cart: getDataFromLocalStorage('cart') || {
        _id: 'guestCart',
        user: 'userId',
        data: [],
    },
    wishlists: getDataFromLocalStorage('wishlists') || [],
};

export const reducer = (state, { type, payload }) => {
    let currentUser = getDataFromLocalStorage('currentUser') || 'guest';
    console.log('action: ', { type, payload });
    let updatedCart = [],
        updatedWishlist = [],
        tempState = {};

    const eliminateDuplicates = (arraySet) =>
        arraySet.reduce((acc, curVal) => {
            tempState[curVal._id] ? (tempState[curVal._id] += 1) : (tempState[curVal._id] = 1);
            if (tempState[curVal._id] <= 1) return [...acc, curVal];
            return [...acc];
        }, []);

    switch (type) {
        case 'SET_GENRES':
            return { ...state, genres: [...state.genres, ...payload] };
        case 'SET_AUTHORS':
            return { ...state, authors: [...state.authors, ...payload] };

        case 'UPDATEPRODUCTS':
            saveDataToLocalStorage('products', payload);
            return { ...state, products: [...state.products, ...payload] };

        case 'SETUP_NEW_USER':
            return {
                ...state,
                cart: {
                    _id: payload._id,
                    user: payload.user,
                    data: eliminateDuplicates(payload.data),
                },
                // ! In wishlists, the wishlists in Guest Account will be created on the DB and added to the user's wishlist array
                wishlists: payload.wishlists,
            };

        case 'FILTER_BY_GENRE':
            console.log('alreadyExists: ', alreadyExists(state.genreFilters, [...payload]));
            return {
                ...state,
                genreFilters: alreadyExists(state.genreFilters, payload)
                    ? [...state.genreFilters.filter((item) => item !== payload)]
                    : [...state.genreFilters, payload],
            };

        case 'SORT_BY_PRICE':
            console.log('price filter: ', payload);
            return { ...state, priceFilter: payload === state.priceFilter ? '' : payload };

        case 'FILTER_BY_AUTHOR':
            console.log('alreadyExists: ', alreadyExists(state.authorFilters, payload));
            return {
                ...state,
                authorFilters: alreadyExists(state.authorFilters, payload)
                    ? [...state.authorFilters.filter((item) => item !== payload)]
                    : [...state.authorFilters, payload],
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
        //                       data: eliminateDuplicates(cartItem.data.concat(guestUserData.cart)),
        //                   }
        //                 : cartItem.userId === 'guest'
        //                 ? { ...cartItem, data: [] }
        //                 : cartItem
        //         ),
        //         wishlists: state.wishlists.map((wishlistItem) =>
        //             wishlistItem.userId === payload.currentUser
        //                 ? {
        //                       ...wishlistItem,
        //                       data: eliminateDuplicates(
        //                           wishlistItem.data.concat(guestUserData.wishlists)
        //                       ),
        //                   }
        //                 : wishlistItem.userId === 'guest'
        //                 ? { ...wishlistItem, data: [] }
        //                 : wishlistItem
        //         ),
        //     };

        case 'ADDTOCART':
            updatedCart = {
                ...state.cart,
                data:
                    state.cart.data.findIndex((dataItem) => dataItem._id === payload._id) === -1
                        ? [...state.cart.data, payload]
                        : state.cart.data,
            };

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: { ...updatedCart },
            };

        case 'UPDATECARTITEM':
            updatedCart = {
                ...state.cart,
                data: state.cart.data.map((data) =>
                    data._id === payload._id
                        ? {
                              ...data,
                              quantity: payload.inc
                                  ? increment(data.quantity)
                                  : decrement(data.quantity),
                              totalPrice:
                                  data.price *
                                  (payload.inc
                                      ? increment(data.quantity)
                                      : decrement(data.quantity)),
                          }
                        : data
                ),
            };

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: { ...updatedCart },
            };

        case 'REMOVEFROMCART':
            updatedCart = {
                ...state.cart,
                data: state.cart.data.filter((data) => data._id !== payload),
            };

            saveDataToLocalStorage('cart', updatedCart);
            return { ...state, cart: { ...updatedCart } };

        case 'CREATEWISHLIST':
            updatedWishlist =
                state.wishlists.findIndex(
                    (wishlist) => wishlist._id === payload._id || wishlist.name === payload.name
                ) === -1
                    ? [...state.wishlists, payload]
                    : state.wishlists;

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return { ...state, wishlists: updatedWishlist };

        case 'DELETEWISHLIST':
            updatedWishlist = state.wishlists.map((wishlistItem) =>
                wishlistItem.userId === currentUser
                    ? {
                          ...wishlistItem,
                          data: wishlistItem.data.filter((data) => data.id !== payload.id),
                      }
                    : wishlistItem
            );

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };

        case 'ADDTOWISHLIST':
            let tempState = {};
            // let readList = state.read_list.find((item) => item.id === payload.readlist.id);
            const noDuplicateProducts = payload.data.reduce((acc, curVal) => {
                tempState[curVal._id] ? (tempState[curVal._id] += 1) : (tempState[curVal._id] = 1);
                if (tempState[curVal._id] <= 1) return [...acc, curVal];
                return [...acc];
            }, []);

            updatedWishlist = state.wishlists.map((wishlist) =>
                wishlist._id === payload._id
                    ? {
                          ...wishlist,
                          data: noDuplicateProducts,
                          estimated_price: fixedTo(
                              calculateTotal(
                                  calculateSubTotal(noDuplicateProducts),
                                  calculateTax(calculateSubTotal(noDuplicateProducts))
                              ),
                              2
                          ),
                      }
                    : wishlist
            );

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };

        case 'REMOVEFROMWISHLIST':
            updatedWishlist = state.wishlists.map((wishlistItem) =>
                wishlistItem.userId === currentUser
                    ? {
                          ...wishlistItem,
                          data: wishlistItem.data.map((data) =>
                              data.id === payload.readlistId
                                  ? {
                                        ...data,
                                        products: data.products.filter(
                                            (item) => item.id !== payload.productId
                                        ),
                                    }
                                  : data
                          ),
                      }
                    : wishlistItem
            );

            saveDataToLocalStorage('wishlists', updatedWishlist);
            return {
                ...state,
                wishlists: updatedWishlist,
            };

        default:
            return state;
    }
};
