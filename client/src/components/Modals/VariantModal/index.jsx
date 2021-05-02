import axios from '../../../axios';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './variantmodal.scss';
import { useEffect } from 'react';

export const VariantModal = ({
    selectedVariant: { cartItemId, bookId, variant },
    variants,
    setVariantModal,
}) => {
    const { theme } = useTheme();
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
            console.log('Response => ', {
                success,
                data,
                toast,
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
            }
            setVariantModal((prevState) => ({ ...prevState, isActive: !prevState.isActive }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {}, [cart]);

    return (
        <div className='variant-modal'>
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
