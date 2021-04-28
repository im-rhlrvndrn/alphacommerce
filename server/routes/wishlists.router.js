const router = require('express').Router();
const authMiddleware = require('../middlewares');
const Users = require('../models/users.model');
const Wishlists = require('../models/wishlists.model');
const { mongooseSave, createWishlists } = require('../utils');
const {
    CustomError,
    errorResponse,
    summation,
    successResponse,
} = require('../utils/errorHandlers');

// router.authMiddleware();
/*
router
    .route('/')
    .get(authMiddleware, async (req, res) => {
        try {
            // ! req.user.id will be injected by the auth middleware
            console.log('Request user: ', req.user);
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedWishlists = await Wishlists.find({ user: req.user.id });
            res.status(200).json({ message: 'Your wishlists', result: returnedWishlists });
        } catch (error) {
            console.log('Error => ', error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const newItem = req.body.id;
        try {
            if (!req.user.id) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            const returnedReadlist = Wishlists.findOne({ user: req.user.id }).populate('data');
            const itemAlreadyExists = returnedReadlist.data.find((item) => item._id === id);
            if (itemAlreadyExists)
                throw new CustomError(
                    '409',
                    'warning',
                    `Item already exists in ${returnedReadlist.name}`
                );

            returnedReadlist.data.push(newItem);

            await returnedReadlist.save();
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });
    */

router
    .route('/')
    .get(async (req, res) => {
        try {
            // ! req.auth will be injected by the auth middleware => authMiddleware
            // console.log('Request user: ', req.auth);
            // if (!req.auth) throw new CustomError('401', 'failed', 'Unauthorized: Access Denied');

            console.log('SELECT Request params', req.params);

            const returnedWishlists = await Wishlists.find({ user: req.cookies.userId }).select(
                req.params.select
            );
            return successResponse(res, {
                status: 200,
                success: true,
                data: { wishlists: returnedWishlists.map((item) => item._doc) },
                toast: {
                    status: 'success',
                    message: 'Successfully fetched user wishlists',
                },
            });
        } catch (error) {
            console.log('Error => ', error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const { wishlist, body, cookies } = req;
        try {
            const { type } = body;

            switch (type) {
                case 'FETCH_DETAILS': {
                    const { select, populate = '' } = body;
                    const returnedWishlists = await Wishlists.find({
                        user: cookies.userId,
                    })
                        .select(select || [])
                        .populate(populate);

                    return successResponse(res, {
                        status: 200,
                        success: true,
                        data: { wishlists: returnedWishlists },
                        toast: {
                            status: 'success',
                            message: 'Fetched user wishlists',
                        },
                    });
                }

                case 'CREATE_WISHLIST': {
                    let savedWishlists = [];
                    const { wishlists } = body;

                    const newWishlists = wishlists.map(
                        ({ name, cover_image, user, data, estimated_price }) => ({
                            name: name || `Wishlist ${wishlist.length + 1}`,
                            cover_image: cover_image || { url: '' },
                            user: user,
                            data: data,
                            estimated_price:
                                estimated_price ||
                                data.reduce((acc, curVal) => acc + curVal.variants[2].price, 0) ||
                                0, // paperback variant
                        })
                    );

                    // Check if a wishlist with the same name exists already
                    // If yes, then check how many copies of this wishlist exists

                    // /*

                    wishlists.forEach(async (item) => {
                        let newWishlist = null;

                        const returnedUser = await Users.findOne({ _id: item.user });
                        if (!returnedUser)
                            throw new CustomError(
                                '404',
                                'failed',
                                "Can't create playlist. Please login first"
                            );

                        const wishlistExists = await Wishlists.findOne({
                            user: item.user,
                            'name.name': item.name.name,
                        });
                        if (wishlistExists) {
                            wishlistExists.name.duplicate_count += 1;
                            const savedWishlist = await wishlistExists.save();
                            if (!savedWishlist)
                                throw new CustomError(
                                    '500',
                                    'failed',
                                    "Couldn't update the original wishlist"
                                );

                            newWishlist = new Wishlists({
                                ...item,
                                name: {
                                    name: `${item.name.name} (${wishlistExists.name.duplicate_count})`,
                                    duplicate_count: 0,
                                },
                            });
                        } else {
                            newWishlist = new Wishlists(item);
                        }

                        returnedUser.wishlists = [...returnedUser.wishlists, newWishlist];
                        // await mongooseSave(newWishlist); // This function will just save to DB. Since Mongoose.Model.save() can't be executed in a loop
                        await returnedUser.save();
                        await newWishlist.save();
                        savedWishlists = [...savedWishlists, newWishlist];
                    });
                    // savedWishlists = await createWishlists(newWishlists);

                    console.log('Collection of all savedWishlists => ', savedWishlists);

                    return setTimeout(() => {
                        successResponse(res, {
                            status: 200,
                            success: true,
                            data: {
                                wishlists: savedWishlists,
                            },
                            toast: {
                                status: 'success',
                                message: 'Created new wishlist',
                            },
                        });
                    }, 3000);
                }

                case 'DELETE_WISHLIST':
                    const { wishlists } = body;

                    const returnedWishlists = [];

                    wishlists.forEach(async (item) => {
                        const removedWishlist = await Wishlists.findByIdAndRemove({
                            _id: item,
                        });
                        returnedWishlists.push(removedWishlist);
                    });

                    console.log('deleted wishlists => ', returnedWishlists);
                    return setTimeout(() => {
                        successResponse(res, {
                            status: 200,
                            success: true,
                            data: returnedWishlists,
                            toast: {
                                status: 'success',
                                message: 'Deleted wishlist',
                            },
                        });
                    }, 3000);

                default:
                    throw new CustomError('500', 'failed', 'Invalid operation type');
            }
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

router.param('wishlistId', async (req, res, next, wishlistId) => {
    const { select, populate } = req.body;
    try {
        console.log('wishlist id from router.param() middleware', wishlistId);
        const returnedWishlist = await Wishlists.findOne({ _id: wishlistId })
            .select(select || [])
            .populate(
                populate || {
                    path: 'data.book',
                }
            );
        if (!returnedWishlist) throw new CustomError('404', 'failed', 'Wishlist not found!');
        console.log('wishlist from routerParam()', returnedWishlist._doc.data);

        req.wishlist = returnedWishlist;
        next();
    } catch (error) {
        console.error(error);
        errorResponse(res, {
            statusCode: +error.code,
            message: error.message,
            toast: error.toastStatus,
        });
    }
});

router
    .route('/:wishlistId')
    .get(async (req, res) => {
        try {
            res.status(200).json({ success: true, data: { wishlist: req.wishlist } });
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    })
    .post(async (req, res) => {
        const { wishlist, body } = req;
        try {
            const { type } = body;

            switch (type) {
                case 'FETCH_DETAILS': {
                    return successResponse(res, {
                        status: 200,
                        success: true,
                        data: { wishlist: req.wishlist },
                        toast: {
                            status: 'success',
                            message: 'Fetched teh wishlist',
                        },
                    });
                }

                case 'ADD_TO_WISHLIST': {
                    const { wishlistItem } = body;

                    if (
                        wishlist.data.findIndex(
                            (item) => item.book._id.toString() === wishlistItem._id
                        ) !== -1
                    )
                        throw new CustomError(
                            '209',
                            'warning',
                            `Already exists in (${wishlist.name.name}) wishlist`
                        );
                    else {
                        wishlist.data = [...wishlist.data, { book: wishlistItem }];
                    }

                    await wishlist.save();

                    // return setTimeout(() => {
                    return successResponse(res, {
                        status: 200,
                        success: true,
                        data: {
                            wishlist: wishlistItem,
                            estimated_price: wishlist.data.reduce(
                                (acc, cur) =>
                                    acc +
                                    cur.book.variants[
                                        cur.book.variants.findIndex(
                                            (item) => item.type === 'paperback'
                                        )
                                    ].price,
                                0
                            ),
                        },
                        toast: {
                            status: 'success',
                            message: `Added to ${wishlist.name.name}`,
                        },
                    });
                    // }, 3000);

                    break;
                }

                case 'REMOVE_FROM_WISHLIST': {
                    const { wishlistItem } = body;

                    if (
                        wishlist.data.findIndex(
                            (item) => item.book._id.toString() === wishlistItem._id
                        ) === -1
                    )
                        throw new CustomError(
                            '404',
                            'failed',
                            `Doesn't exist in (${wishlist.name.name})`
                        );
                    else {
                        wishlist.data = wishlist.data.filter(
                            (item) => item.book._id.toString() !== wishlistItem._id
                        );
                    }

                    await wishlist.save();

                    // return setTimeout(() => {
                    successResponse(res, {
                        status: 200,
                        success: true,
                        data: {
                            wishlist: wishlistItem,
                        },
                        toast: {
                            status: 'success',
                            message: `Removed from ${wishlist.name.name}`,
                        },
                    });
                }

                default:
                    throw new CustomError('500', 'failed', 'Invalid operation type');
            }
        } catch (error) {
            console.error(error);
            errorResponse(res, {
                statusCode: +error.code,
                message: error.message,
                toast: error.toastStatus,
            });
        }
    });

module.exports = router;
