import { v4 } from 'uuid';
// import data from '../data.json';
import { productData as data } from '../data.js';
import { decrement, increment } from '../utils/math_helpers';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../hooks/useLocalStorage';
import { calculateSubTotal, calculateTax, calculateTotal, fixedTo } from '../utils/cart_helpers';
import { alreadyExists } from '../utils';

const productData = data?.map((item) => ({ ...item, id: v4() }));
const productsFromLocalStorage = getDataFromLocalStorage('products') || productData;
if (!getDataFromLocalStorage('products')) saveDataToLocalStorage('products', productData);

// ! Shift the entire codebase to adopt the new cart and read_list values from authContext
export const initialState = {
    genres: [],
    authors: [],
    products: [],
    priceFilter: '',
    genreFilters: [],
    authorFilters: [],
    cart: getDataFromLocalStorage('cart') || [
        {
            userId: 'guest',
            data: [],
        },
    ],
    read_lists: getDataFromLocalStorage('read_lists') || [
        {
            userId: 'guest',
            data: [
                {
                    id: v4(),
                    name: { text: 'Self-help Books' },
                    image: {
                        url:
                            'https://images.pexels.com/photos/3060324/pexels-photo-3060324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                    },
                    estimated_price: {
                        value: 0,
                    },
                    products: [],
                },
            ],
        },
    ],
};

export const reducer = (state, { type, payload }) => {
    let currentUser = getDataFromLocalStorage('currentUser') || 'guest';
    console.log('action: ', { type, payload });
    let updatedCart = [],
        updatedReadlist = [],
        tempState = {};

    const eliminateDuplicates = (arraySet) =>
        arraySet.reduce((acc, curVal) => {
            tempState[curVal.id] ? (tempState[curVal.id] += 1) : (tempState[curVal.id] = 1);
            if (tempState[curVal.id] <= 1) return [...acc, curVal];
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
                cart: [...state.cart, { userId: payload.id, data: [] }],
                read_lists: [...state.read_lists, { userId: payload.id, data: [] }],
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

        case 'TRANSFER_GUEST_DATA_TO_USER':
            const guestUserData = {
                cart: state.cart[state.cart.findIndex((item) => item.userId === 'guest')].data,
                read_lists:
                    state.read_lists[state.read_lists.findIndex((item) => item.userId === 'guest')]
                        .data,
            };
            return {
                ...state,
                cart: state.cart.map((cartItem) =>
                    cartItem.userId === payload.currentUser
                        ? {
                              ...cartItem,
                              data: eliminateDuplicates(cartItem.data.concat(guestUserData.cart)),
                          }
                        : cartItem.userId === 'guest'
                        ? { ...cartItem, data: [] }
                        : cartItem
                ),
                read_lists: state.read_lists.map((readlistItem) =>
                    readlistItem.userId === payload.currentUser
                        ? {
                              ...readlistItem,
                              data: eliminateDuplicates(
                                  readlistItem.data.concat(guestUserData.read_lists)
                              ),
                          }
                        : readlistItem.userId === 'guest'
                        ? { ...readlistItem, data: [] }
                        : readlistItem
                ),
            };

        case 'ADDTOCART':
            updatedCart = state.cart.map((cartItem) =>
                cartItem.userId === currentUser
                    ? {
                          ...cartItem,
                          data:
                              cartItem.data.findIndex((dataItem) => dataItem.id === payload.id) ===
                              -1
                                  ? [...cartItem.data, payload]
                                  : cartItem.data.filter((dataItem) => dataItem.id !== payload.id),
                      }
                    : cartItem
            );

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: updatedCart,
            };

        case 'UPDATECARTITEM':
            updatedCart = state.cart.map((cartItem) =>
                cartItem.userId === currentUser
                    ? {
                          ...cartItem,
                          data: cartItem.data.map((data) =>
                              data.id === payload.id
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
                      }
                    : cartItem
            );

            saveDataToLocalStorage('cart', updatedCart);
            return {
                ...state,
                cart: updatedCart,
            };

        case 'REMOVEFROMCART':
            updatedCart = state.cart.map((cartItem) =>
                cartItem.userId === currentUser
                    ? { ...cartItem, data: cartItem.data.filter((data) => data.id !== payload) }
                    : cartItem
            );

            saveDataToLocalStorage('cart', updatedCart);
            return { ...state, cart: updatedCart };

        case 'CREATEREADLIST':
            updatedReadlist = state.read_lists.map((readlistItem) =>
                readlistItem.userId === currentUser
                    ? { ...readlistItem, data: [...readlistItem.data, payload] }
                    : readlistItem
            );

            saveDataToLocalStorage('read_lists', updatedReadlist);
            return { ...state, read_lists: updatedReadlist };

        case 'DELETEREADLIST':
            updatedReadlist = state.read_lists.map((readlistItem) =>
                readlistItem.userId === currentUser
                    ? {
                          ...readlistItem,
                          data: readlistItem.data.filter((data) => data.id !== payload.id),
                      }
                    : readlistItem
            );

            saveDataToLocalStorage('read_lists', updatedReadlist);
            return {
                ...state,
                read_lists: updatedReadlist,
            };

        case 'ADDTOREADLIST':
            let tempState = {};
            // let readList = state.read_list.find((item) => item.id === payload.readlist.id);
            const noDuplicateProducts = payload.products.reduce((acc, curVal) => {
                tempState[curVal.id] ? (tempState[curVal.id] += 1) : (tempState[curVal.id] = 1);
                if (tempState[curVal.id] <= 1) return [...acc, curVal];
                return [...acc];
            }, []);

            updatedReadlist = state.read_lists.map((readlistItem) =>
                readlistItem.userId === currentUser
                    ? {
                          ...readlistItem,
                          data: readlistItem.data.map((data) =>
                              data.id === payload.id
                                  ? {
                                        ...data,
                                        products: noDuplicateProducts,
                                        estimated_price: {
                                            value: fixedTo(
                                                calculateTotal(
                                                    calculateSubTotal(noDuplicateProducts),
                                                    calculateTax(
                                                        calculateSubTotal(noDuplicateProducts)
                                                    )
                                                ),
                                                2
                                            ),
                                        },
                                    }
                                  : data
                          ),
                      }
                    : readlistItem
            );

            saveDataToLocalStorage('read_lists', updatedReadlist);
            return {
                ...state,
                read_lists: updatedReadlist,
            };

        case 'REMOVEFROMREADLIST':
            updatedReadlist = state.read_lists.map((readlistItem) =>
                readlistItem.userId === currentUser
                    ? {
                          ...readlistItem,
                          data: readlistItem.data.map((data) =>
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
                    : readlistItem
            );

            saveDataToLocalStorage('read_lists', updatedReadlist);
            return {
                ...state,
                read_lists: updatedReadlist,
            };

        default:
            return state;
    }
};
