import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useDataLayer } from '../../context/DataProvider';

// styles
import './filter.scss';

// React components
import { Accordion } from '../Accordion';
import { Checkbox, Radio } from '../Inputs';

export const Filter = () => {
    const [{ genres, authors }, dataDispatch] = useDataLayer();
    const accordionList = [
        {
            id: v4(),
            isActive: false,
            heading: 'Price',
        },
        {
            id: v4(),
            isActive: false,
            heading: 'Genres',
        },
        {
            id: v4(),
            isActive: false,
            heading: 'Authors',
        },
    ];
    const [accordions, setAccordions] = useState(accordionList);

    const updateAccordion = (accordionId, multi) =>
        setAccordions((prevState) =>
            prevState.map((item) =>
                item.id === accordionId
                    ? { ...item, isActive: !item.isActive }
                    : multi
                    ? item
                    : { ...item, isActive: false }
            )
        );

    const renderFilterOptions = (key) => {
        switch (key) {
            case 'Authors':
                return authors?.map((author) => (
                    <Checkbox key={author.id} dispatchType='FILTER_BY_AUTHOR' data={author} />
                ));

            case 'Genres':
                return genres?.map((genre) => (
                    <Checkbox key={genre.id} dispatchType='FILTER_BY_GENRE' data={genre} />
                ));

            case 'Price':
                return (
                    <Radio
                        data={[
                            { id: v4(), name: 'low-to-high', isChecked: false },
                            { id: v4(), name: 'high-to-low', isChecked: false },
                        ]}
                        dispatchType='SORT_BY_PRICE'
                    />
                );

            default:
                return [];
        }
    };

    return (
        <div className='filter-container'>
            {accordions.map(({ heading, id, isActive }) => (
                <Accordion
                    key={id}
                    updateAccordion={updateAccordion}
                    options={{ heading, id, isActive }}
                >
                    {renderFilterOptions(heading)}
                </Accordion>
            ))}
        </div>
    );
};

export { FilterBySearch } from './FilterBySearch';
