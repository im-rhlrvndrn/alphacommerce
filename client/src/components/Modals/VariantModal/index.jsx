import { useEffect } from 'react';
import axios from '../../../axios';
import { useModal } from '../../../context/ModalProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';
import { withModalOverlay } from '../../../hoc/withModalOverlay';

// styles
import './variantmodal.scss';

export const VariantModal = ({ modal, dispatchType }) => {
    const {
        state: {
            variants,
            selectedVariant: { cartItemId, bookId, variant },
        },
    } = modal;
    const { theme } = useTheme();
    const [_, modalDispatch] = useModal();
    const [{ cart }, dataDispatch] = useDataLayer();

    const updateVariant = async (variant) => {
        try {
            const {
                data: { success, data, toast },
            } = await axios.post(`carts/${cart._id}`, {
                type: 'UPDATE_VARIANT',
                variant,
                bookId,
                cartItemId,
                cart: cart._id === 'guest' ? cart : null,
            });
            if (success) {
                dataDispatch({
                    type: 'UPDATE_CART_ITEM',
                    payload: {
                        _id: bookId,
                        updatedItem: data.updatedItem,
                        checkout: data.checkout,
                    },
                });
                dataDispatch({ type: 'SET_TOAST', payload: { data: toast } });
            }
            modalDispatch({ type: dispatchType });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {}, [cart]);

    return (
        <div className='variant-modal' style={{ color: theme.color }}>
            <h1 className='font-lg'>Select a variant</h1>
            {variants.map((item) => (
                <div
                    className='variant-option'
                    key={item._id}
                    style={{
                        backgroundColor:
                            variant.type === item.type ? theme.light_background : 'transparent',
                    }}
                    onClick={() => updateVariant(item)}
                >
                    {item.type}
                </div>
            ))}
        </div>
    );
};

const EnhancedVariantModal = withModalOverlay(VariantModal);
export { EnhancedVariantModal };
