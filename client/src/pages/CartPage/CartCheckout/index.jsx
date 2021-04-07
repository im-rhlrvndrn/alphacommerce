import { useTheme } from '../../../context/ThemeContext';
import {
    calculateSubTotal,
    calculateTax,
    calculateTotal,
    fixedTo,
} from '../../../utils/cart_helpers';

export const CartCheckout = ({ setReadlistModal, cart }) => {
    const { theme } = useTheme();

    return (
        <div
            className='cart-checkout p-2 h-max'
            style={{ backgroundColor: theme.light_background, color: theme.color }}
        >
            <h2 className='font-lg margin-res'>Order summary</h2>
            <div
                className='checkout-group pt-1 pb-1'
                style={{ borderBottom: `2px solid ${theme.dark_background}` }}
            >
                <div className='checkout-group-row flex flex-justify-sb mb-1'>
                    <div className='heading'>sub-total</div>
                    <div className='price'>₹ {fixedTo(calculateSubTotal(cart), 2)}</div>
                </div>
                <div className='checkout-group-row flex flex-justify-sb mb-1'>
                    <div className='heading'>gst</div>
                    <div className='price'>
                        ₹ {fixedTo(calculateTax(calculateSubTotal(cart)), 2)}
                    </div>
                </div>
            </div>
            <div
                className='checkout-group pt-1 pb-1'
                style={{ borderBottom: `2px solid ${theme.dark_background}` }}
            >
                <div className='checkout-group-row flex flex-justify-sb mb-1'>
                    <div className='heading'>total</div>
                    <div className='price'>
                        ₹{' '}
                        {fixedTo(
                            calculateTotal(
                                calculateSubTotal(cart),
                                calculateTax(calculateSubTotal(cart))
                            ),
                            2
                        )}
                    </div>
                </div>
            </div>
            <button
                className='w-100p text-align-center'
                style={{
                    backgroundColor: theme.constants.primary,
                    color: theme.constants.dark,
                    fontWeight: '600',
                }}
            >
                Proceed to Checkout
            </button>
            <button
                className='w-100p text-align-center'
                style={{ backgroundColor: 'transparent', color: theme.color }}
                onClick={() =>
                    setReadlistModal((prevState) => ({
                        ...prevState,
                        isActive: !prevState.isActive,
                    }))
                }
            >
                Add to read list
            </button>
        </div>
    );
};
