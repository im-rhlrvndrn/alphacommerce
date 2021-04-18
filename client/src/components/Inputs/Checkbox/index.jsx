import { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './checkbox.scss';

export const Checkbox = ({ data, dispatchType }) => {
    const { name } = data;
    const { theme } = useTheme();
    const [{ genreFilters, authorFilters }, dataDispatch] = useDataLayer();
    const [isChecked, setIsChecked] = useState(
        genreFilters.includes(name) || authorFilters.includes(name) || false
    );

    const handleCheckboxChange = (event) => {
        if ((event.key = 'Enter')) {
            setIsChecked((prevState) => !prevState);
            dataDispatch({ type: dispatchType, payload: name });
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
