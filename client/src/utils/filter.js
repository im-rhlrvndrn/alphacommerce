export const getFilteredData = (inputArray, filters) => {
    let filteredData = [...inputArray];
    filters?.forEach((filter) => {
        if (filter?.data === true || filter?.data?.length > 0) {
            filteredData = filteredData?.filter(
                (item) => item[filter?.type].filter((data) => filter.data.includes(data)).length > 0
            );
        }
    });

    return filteredData;
};

export const getSortedData = (inputArray, filter) => {
    let sortedData = [...inputArray];
    switch (filter) {
        case 'low-to-high':
            sortedData = sortedData.sort((a, b) => a.price.value - b.price.value);
            break;

        case 'high-to-low':
            sortedData = sortedData.sort((a, b) => b.price.value - a.price.value);
            break;

        default:
            sortedData = sortedData;
            break;
    }
    return sortedData;
};
