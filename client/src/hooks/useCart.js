import { v4 } from 'uuid';
import axios from '../axios';
import { useDataLayer } from '../context/DataProvider';
import { useToast } from './useToast';

export const useCart = () => {
    const [{ cart }, dataDispatch] = useDataLayer();
    const { setToast } = useToast();

    const addToCart = async ({ items = [], multi = false }) => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`/carts/${cart._id}`, {
                multi,
                data: [...items],
                type: 'ADD_TO_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dispatchNewCartItem(data);
                setToast({ ...toast, _id: v4() });
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || `Couldn't add to cart`,
            });
            console.error(error);
        }
    };

    const dispatchNewCartItem = async (data) => {
        dataDispatch({ type: 'ADD_TO_CART', payload: { ...data } });
    };

    const dispatchRemovedCartItem = (data) => {
        dataDispatch({
            type: 'REMOVE_FROM_CART',
            payload: data,
        });
    };

    const removeFromCart = async ({ id, variant }) => {
        try {
            const {
                data: {
                    success,
                    data: { _id, variant: variantResponse, checkout },
                    toast,
                },
            } = await axios.post(`/carts/${cart._id}`, {
                variant: variant,
                _id: id,
                type: 'REMOVE_FROM_CART',
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dispatchRemovedCartItem({
                    _id,
                    variant: variantResponse,
                    checkout,
                });
                setToast({ ...toast, _id: v4() });
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || `Couldn't remove from cart`,
            });
            console.error(error);
        }
    };

    const dispatchCartItem = (data) => {
        dataDispatch({
            type: 'UPDATE_CART_ITEM',
            payload: data,
        });
    };

    const updateCart = async ({ id, variant, inc = false }) => {
        try {
            const {
                data: {
                    success,
                    data: { _id, updatedItem, checkout },
                    toast,
                },
            } = await axios.post(`/carts/${cart._id}`, {
                _id: id,
                variant,
                inc,
                cart: cart._id === 'guest' ? cart : null,
                type: 'UPDATE_QUANTITY',
            });

            if (success) {
                dispatchCartItem({
                    _id,
                    updatedItem,
                    checkout,
                });
                setToast({ ...toast, _id: v4() });
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || `Couldn't update cart item`,
            });
        }
    };

    const fetchCart = async ({ populate = '', select = [] }) => {
        try {
            if (cart._id !== 'guest') {
                const {
                    data: { success, data, toast },
                } = await axios.post(`/carts/${cart._id}`, {
                    type: 'FETCH_DETAILS',
                    populate,
                    select,
                });
                if (success) {
                    dataDispatch({ type: 'SET_CART', payload: { cart: data.cart } });
                }
            } else {
                dataDispatch({ type: 'SET_CART', payload: { cart } });
            }
        } catch (error) {
            setToast({
                _id: v4(),
                status: error?.response?.data?.status || 'failed',
                message: error?.response?.data?.message || `Couldn't fetch cart details`,
            });
            console.error(error);
        }
    };

    return {
        addToCart,
        fetchCart,
        updateCart,
        removeFromCart,
        dispatchCartItem,
        dispatchNewCartItem,
        dispatchRemovedCartItem,
    };
};
