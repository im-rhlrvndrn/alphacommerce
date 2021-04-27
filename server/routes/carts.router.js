const router = require('express').Router();
const Carts = require('../models/carts.model');
const { getVariantPrice, errorResponse, CustomError, summation } = require('../utils');

router.param('cartId', async (req, res, next, cartId) => {
    try {
        const returnedCart = req.body.cart
            ? req.body.cart
            : await Carts.findById(cartId).populate({
                  path: 'data.book',
                  // select: ['name'],
              });
        // console.log('Cart => ', returnedCart);
        if (!returnedCart) throw new CustomError('404', 'failed', 'No cart found!');

        req.cart = returnedCart;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, { code: +error.code, message: error.message, toast: error.toastStatus });
    }
});

router
    .route('/:cartId')
    .get(async (req, res) => {
        /*
    
    req.body = {
            type; 'ADD_TO_CART,
            data: {
                cartItemId: null, // if the item doesn't exist in cart already
                bookId: 'kladsjfqer143_3skji9',
                variant:{
                    type: 'ebook,
                    price: 2343,
                }
            }
        }

    */
        try {
            return res
                .status(200)
                .json({ success: true, data: { cart: req.cart._doc } /*req.cart._doc*/ });
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                code: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        let {
            cart,
            body: { type }, // Destructuring for all the cases
        } = req;
        try {
            switch (type) {
                case 'ADD_TO_CART': {
                    const { data, multi } = req.body;

                    const newCartItems = data.map(({ book, quantity, variant, total }) => ({
                        book: book,
                        quantity: quantity || 1,
                        variant: variant,
                        total: total || getVariantPrice(book.variants, variant.type) * quantity,
                    }));

                    if (!multi) {
                        if (
                            cart.data.findIndex(
                                (item) =>
                                    item._id === newCartItems[0].book._id &&
                                    item.variant.type === newCartItems[0].variant.type
                            ) !== -1
                        )
                            return res.status(200).json({
                                success: true,
                                datat: null,
                                toast: {
                                    status: 'success',
                                    message: 'Already in cart',
                                },
                            });

                        cart.data = [...cart.data, newCartItems[0]];
                    } else {
                        // * @desc If guest cart contains the same cartItem in userCart data then it's updated w/ Guest Cart data
                        const updateGuestCartData = cart.data.map((item) => {
                            const index = newCartItems.findIndex(
                                (cartItem) =>
                                    cartItem.book._id === item.book._id &&
                                    cartItem.variant.type === item.variant.type
                            );
                            return index === -1 ? item : newCartItems[index];
                        });

                        // * @desc filtering guest cart items that doesn't exist in user cart
                        const newGuestCartItems = newCartItems.filter(
                            (item) =>
                                updateGuestCartData.findIndex(
                                    (cartItem) =>
                                        item.book._id === cartItem.book._id &&
                                        item.variant.type === cartItem.variant.type
                                ) === -1
                        );

                        cart.data = [...updateGuestCartData, ...newGuestCartItems];
                    }

                    cart.checkout = {
                        subtotal: summation(cart.data, 'total'),
                        total: summation(cart.data, 'total'),
                    };

                    const savedCart = cart._id === 'guest' ? cart : await cart.save();
                    return res.status(200).json({
                        success: true,
                        data: {
                            checkout: savedCart.checkout,
                            data: newCartItems,
                        },
                        toast: {
                            message: 'Added to cart',
                            status: 'success',
                        },
                    });
                }

                case 'REMOVE_FROM_CART': {
                    const { _id, variant } = req.body;

                    console.log('[REMOVE] before => ', { cartData: cart.data });
                    cart.data = cart.data.filter(
                        (item) =>
                            item.book._id.toString() !== _id ||
                            (item.book._id.toString() === _id && item.variant.type !== variant.type)
                    );
                    cart.checkout = {
                        subtotal: summation(cart.data, 'total'),
                        total: summation(cart.data, 'total'),
                    };

                    const updatedCart = cart._id === 'guest' ? cart : await cart.save();
                    console.log('[REMOVE] after => ', { cartData: cart.data });
                    return res.status(200).json({
                        success: true,
                        data: {
                            _id,
                            variant,
                            checkout: updatedCart.checkout,
                        },
                        toast: {
                            status: 'success',
                            message: 'Removed from cart',
                        },
                    });
                }

                case 'UPDATE_QUANTITY': {
                    const { _id, variant, inc } = req.body;
                    let updatedItem = {};

                    cart.data = cart.data.map((item) => {
                        if (
                            item.book._id.toString() === _id &&
                            item.variant.type === variant.type
                        ) {
                            updatedItem = {
                                ...(cart._id === 'guest' ? item : item._doc),
                                quantity: inc ? item.quantity + 1 : item.quantity - 1,
                                total:
                                    (inc ? item.quantity + 1 : item.quantity - 1) *
                                    item.book.variants[
                                        item.book.variants.findIndex(
                                            (item) => item.type === variant.type
                                        )
                                    ].price,
                            };
                            return updatedItem;
                        }
                        return item;
                    });
                    cart.checkout = {
                        subtotal: summation(cart.data, 'total'),
                        total: summation(cart.data, 'total'),
                    };

                    const updatedCart = cart._id === 'guest' ? cart : await cart.save();
                    if (!updatedCart)
                        throw new CustomError('500', 'failed', "Couldn't update the cart item");
                    return res.status(200).json({
                        success: true,
                        data: {
                            _id,
                            updatedItem,
                            checkout: updatedCart.checkout,
                        },
                        toast: {
                            status: 'success',
                            message: 'Updated cart item',
                        },
                    });
                }

                default:
                    return res.json({ success: true, data: { cart } });
            }
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                code: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

module.exports = router;
