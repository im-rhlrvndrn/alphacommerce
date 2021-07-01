import { useEffect } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';
import {
    calculateSubTotal,
    calculateTax,
    calculateTotal,
    fixedTo,
} from '../../../utils/cart_helpers';

export const CartCheckout = ({ setWishlistModal }) => {
    const { theme } = useTheme();
    const [{ cart }] = useDataLayer();

    useEffect(() => {}, [cart.checkout]);

    return (
        <div
            className='cart-checkout p-8 h-max'
            style={{ backgroundColor: theme.light_background, color: theme.color }}
        >
            <h2 className='text-lg m-0'>Price summary</h2>
            <div className='checkout-group pt-4 pb-4'>
                <div className='checkout-group-row flex justify-between mb-4'>
                    <div className='heading'>Sub-total</div>
                    <div className='price'>₹ {fixedTo(calculateSubTotal(cart.data), 2)}</div>
                </div>
                <div className='checkout-group-row flex justify-between mb-4'>
                    <div className='heading'>GST</div>
                    <div className='price'>
                        ₹ {fixedTo(calculateTax(calculateSubTotal(cart.data)), 2)}
                    </div>
                </div>
            </div>
            {/* <div className='checkout-group pt-1 pb-1'>
                <div className='checkout-group-row flex flex-justify-sb mb-1'>
                    <div className='heading'>total</div>
                    <div className='price'>
                        ₹{' '}
                        {fixedTo(
                            calculateTotal(
                                calculateSubTotal(cart.data),
                                calculateTax(calculateSubTotal(cart.data))
                            ),
                            2
                        )}
                    </div>
                </div>
            </div> */}
            <div className='cart-checkout-cta' style={{ backgroundColor: theme.light_background }}>
                <div className='total-amount'>
                    <div className='heading'>Total</div>
                    <div className='price'>
                        ₹{' '}
                        {fixedTo(
                            calculateTotal(
                                calculateSubTotal(cart.data),
                                calculateTax(calculateSubTotal(cart.data))
                            ),
                            2
                        )}
                    </div>
                </div>
                <button
                    className='w-full text-align-center font-semibold'
                    style={{
                        backgroundColor: theme.constants.primary,
                        color: theme.constants.dark,
                    }}
                >
                    Checkout
                </button>
                {/* <button
                    className='w-100p text-align-center'
                    style={{ backgroundColor: 'transparent', color: theme.color }}
                    onClick={() =>
                        setWishlistModal((prevState) => ({
                            ...prevState,
                            isActive: !prevState.isActive,
                        }))
                    }
                >
                    Add to wishlist
                </button> */}
            </div>
        </div>
    );
};
