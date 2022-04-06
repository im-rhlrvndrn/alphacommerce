import { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './checkbox.scss';
import { alreadyExists } from '../../../utils';

export const Checkbox = ({ data, dispatchType }) => {
    const { name, type } = data;
    const { theme } = useTheme();
    const [{ genreFilters, authorFilters }, dataDispatch] = useDataLayer();
    const [isChecked, setIsChecked] = useState(false);

    console.log('It is filter => ', { genreFilters, name, includes: genreFilters.includes(name) });

    useEffect(() => {
        if (genreFilters.includes(name) || authorFilters.includes(name))
            setIsChecked((prevState) => true);
        else setIsChecked((prevState) => false);
    }, [genreFilters, authorFilters]);

    const handleCheckboxChange = (event) => {
        if ((event.key = 'Enter')) {
            setIsChecked((prevState) => !prevState);
            const filter = dispatchType === 'FILTER_BY_GENRE' ? genreFilters : authorFilters;

            dataDispatch({
                type: dispatchType,
                payload: alreadyExists(filter, name)
                    ? [...filter.filter((item) => item !== name)]
                    : [...filter, name],
            });
        }
    };

    return (
        <div className='input-checkbox'>
            <span
                tabIndex='0'
                aria-label={`${name}`}
                className='dup-checkbox'
                style={{
                    backgroundColor: isChecked ? theme.constants.primary : theme.color,
                }}
                onKeyPress={handleCheckboxChange}
                onClick={handleCheckboxChange}
            ></span>
            <label onClick={handleCheckboxChange}>{name}</label>
        </div>
    );
};
