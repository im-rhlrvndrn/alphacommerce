import { findIndex } from './array_helpers';

export const slugify = (inputValue) => inputValue.toString().replace('-', '_').replace(' ', '-');
export const deSlugify = (inputValue) => inputValue.toString().replace('-', ' ').replace('_', '-');
export const generateSearchParams = (input) =>
    input
        .split('')
        .slice(1)
        .join('')
        .split('&')
        .reduce((acc, cur) => {
            let temp = cur.split('=');
            acc[temp[0]] = temp[1];
            return { ...acc };
        }, {});

export const getSelectedVariantPrice = (variantArray, variantType = 'paperback') =>
    variantArray[findIndex(variantArray, 'type', variantType)].price;

export const getVariantPrice = (arraySet, variantType = 'paperback') =>
    arraySet.find((item) => item.type === variantType).price;

export { getFilteredData, getSortedData } from './filter';
export { alreadyExists, findIndex } from './array_helpers';
export { increment, incrementBy, decrement, decrementBy, maxWords } from './math_helpers';
export { calculateSubTotal, calculateTax, calculateTotal, fixedTo } from './cart_helpers';
