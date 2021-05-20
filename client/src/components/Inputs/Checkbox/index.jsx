import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

// styles
import './checkbox.scss';

export const Checkbox = ({ data, dispatchType }) => {
    const { name, type } = data;
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [{ genreFilters, authorFilters }, dataDispatch] = useDataLayer();
    const [isChecked, setIsChecked] = useState(
        genreFilters.includes(name) || authorFilters.includes(name) || false
    );

    const handleCheckboxChange = (event) => {
        if ((event.key = 'Enter')) {
            setIsChecked((prevState) => !prevState);
            dataDispatch({ type: dispatchType, payload: name });
        }
        // const Url = new URL(window?.location?.href);
        // // console.log('URL => ', Url);
        // console.log('Genre param => ', Url.searchParams.get('genre'));
        // // Url.searchParams.set('genre', `${Url.searchParams.get('genre')},${name}`);
        // console.log('Search params => ', Url.searchParams);
        // const searchParam = Url.searchParams.get(type);
        // navigate({
        //     pathname: '/p',
        //     search: `?${createSearchParams({
        //         // ...Url.searchParams.forEach((value, key) => ({ [key]: value })),
        //         [type]: `${searchParam ? `${searchParam},` : ''}${name}`,
        //     })}`,
        // });
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
