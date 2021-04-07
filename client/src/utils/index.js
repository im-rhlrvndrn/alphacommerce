export const slugify = (inputValue) => inputValue.toString().split(' ').join('-');
export const deSlugify = (inputValue) => inputValue.toString().split('-').join(' ');
export const generateSearchParams = (input) =>
    input
        .split('')
        .slice(1)
        .join('')
        .split('&')
        .reduce((acc, cur, index, sourceArray) => {
            let temp = cur.split('=');
            acc[temp[0]] = temp[1];
            return { ...acc };
        }, {});

export { alreadyExists } from './array_helpers';
export { getFilteredData, getSortedData } from './filter';
