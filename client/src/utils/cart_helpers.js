export const fixedTo = (input, fixValue) => +input.toFixed(fixValue);
export const calculateSubTotal = (cart) => cart.reduce((acc, curVal) => acc + curVal.totalPrice, 0);
export const calculateTax = (subTotal) => subTotal * (18 / 100); // 18% GST
export const calculateTotal = (...rest) => rest.reduce((acc, curVal) => acc + curVal, 0);
