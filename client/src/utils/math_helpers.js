export const increment = (value) => value + 1;
export const incrementBy = (incrementBy = 1, value = 0) => value + incrementBy;
export const decrement = (value) => value - 1;
export const decrementBy = (incrementBy = 1, value = 0) => value - incrementBy;
export const maxWords = (inputString, maxValue) =>
    `${inputString
        .split('')
        .slice(0, maxValue + 1)
        .join('')}${inputString.length > maxValue ? '...' : ''}`;
