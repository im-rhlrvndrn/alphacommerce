import { useState } from 'react';
import { maxWords } from '../../../utils/math_helpers';
import { useTheme } from '../../../context/ThemeProvider';

export const FilterBySearch = ({ style, options, filterCallback }) => {
    const { data, filterBy } = options;
    const { theme } = useTheme();

    /*
    filterBy = {
        type: 'object,
        filterCallback: (item) => item.name.text.toLowerCase().includes(filter.toLowerCase() && item)
        property: {
            name: 'name'
            sub-property: {
                name: 'text
            }
        }
    }
    */
    const [filter, setFilter] = useState('');

    const filterData = () => {
        const filteredReadlist = filter !== '' ? data.map((item) => filterCallback(item)) : data;

        if (filteredReadlist.length === 0)
            return <p style={{ color: theme.color, padding: '1rem' }}>No readlist</p>;

        return filteredReadlist.map((readlistItem) => (
            <div
                className='readlist-item'
                style={{ backgroundColor: theme.light_background }}
                // onClick={() => {
                // setIsModalActive((prevState) => !prevState);
                //     dataDispatch({
                //         type: 'ADDTOREADLIST',
                //         payload: {
                //             readlist: readlistItem,
                //             products: [{ id: productId }],
                //         },
                //     });
                // }}
            >
                {maxWords(readlistItem.name.text, 30)}
            </div>
        ));
    };

    return (
        <input
            type='text'
            name='readlist-modal-input'
            id='readlist-modal-input'
            value={filter}
            style={{ ...style, backgroundColor: theme.light_background, color: theme.color }}
            onChange={(event) => setFilter((prevState) => event.target.value)}
            placeholder='Search for readlist...'
        />
    );
};
