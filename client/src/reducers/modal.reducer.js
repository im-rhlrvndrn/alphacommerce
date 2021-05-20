export const initialState = {
    wishlist: {
        isActive: false,
        state: {},
    },
    auth: {
        isActive: false,
        state: {},
    },
    variant: {
        isActive: false,
        state: {},
    },
};

export const reducer = (state, { type, payload = { state: {} } }) => {
    console.log('action => ', { type, payload });
    switch (type) {
        case 'UPDATE_WISHLIST_MODAL': {
            const { state: modalState } = payload;
            return {
                ...state,
                wishlist: {
                    ...state.wishlist,
                    isActive: !state.wishlist.isActive,
                    state: modalState ?? {},
                },
            };
        }

        case 'UPDATE_AUTH_MODAL': {
            const { state: modalState } = payload;
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isActive: !state.auth.isActive,
                    state: modalState ?? {},
                },
            };
        }

        case 'UPDATE_VARIANT_MODAL': {
            const { state: modalState } = payload;
            return {
                ...state,
                variant: {
                    ...state.variant,
                    isActive: !state.variant.isActive,
                    state: modalState ?? {},
                },
            };
        }

        default:
            return state;
    }
};
