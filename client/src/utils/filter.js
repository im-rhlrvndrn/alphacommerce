export const getFilteredData = (inputArray, filters) => {
    let filteredData = [...inputArray];
    console.log('getFilteredData => ', { inputArray, filteredData });
    filters?.forEach((filter) => {
        if (filter?.data === true || filter?.data?.length > 0) {
            filteredData = filteredData?.filter(
                (item) => item[filter?.type].filter((data) => filter.data.includes(data)).length > 0
            );
        }
    });

    return Array.from(new Set(filteredData));
};

export const getSortedData = (inputArray, filter) => {
    let sortedData = [...inputArray];
    switch (filter) {
        case 'low-to-high':
            sortedData = sortedData.sort((a, b) => a.variants[0].price - b.variants[0].price);
            break;

        case 'high-to-low':
            sortedData = sortedData.sort((a, b) => b.variants[0].price - a.variants[0].price);
            break;

        default:
            sortedData = sortedData;
            break;
    }
    console.log('Sorted data => ', { inputArray, sortedData });
    return sortedData;
};
