export const increment = (value) => value + 1;
export const decrement = (value) => value - 1;
export const maxWords = (inputString, maxValue) =>
    `${inputString
        .split('')
        .slice(0, maxValue + 1)
        .join('')}${inputString.length > maxValue ? '...' : ''}`;
