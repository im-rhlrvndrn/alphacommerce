export const useLocalStorage = () => {
    const saveDataToLocalStorage = (propertyName, data) =>
        data === null
            ? localStorage.setItem(propertyName, null)
            : localStorage.setItem(propertyName, JSON.stringify(data));

    const getDataFromLocalStorage = (propertyName) =>
        JSON.parse(localStorage.getItem(propertyName));

    return [saveDataToLocalStorage, getDataFromLocalStorage];
};

export const saveDataToLocalStorage = (propertyName, data) =>
    data === null
        ? localStorage.setItem(propertyName, null)
        : localStorage.setItem(propertyName, JSON.stringify(data));

export const getDataFromLocalStorage = (propertyName) =>
    JSON.parse(localStorage.getItem(propertyName));
