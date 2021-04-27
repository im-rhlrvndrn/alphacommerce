export const alreadyExists = (inputArray, value) =>
    inputArray.filter((item) => item === value).length;

export const findIndex = (arraySet = [], propertyName = '_id', equalizer = true) =>
    arraySet.findIndex((item) => item[propertyName] === equalizer);
