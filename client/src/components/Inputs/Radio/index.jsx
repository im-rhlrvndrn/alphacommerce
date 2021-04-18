import { useState } from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import { useDataLayer } from '../../../context/DataProvider';

export const Radio = ({ data, dispatchType }) => {
    const { theme } = useTheme();
    const [_, dataDispatch] = useDataLayer();
    const [radioButtons, setRadioButtons] = useState(data);

    const handleChange = (id, name) => {
        setRadioButtons((prevState) =>
            prevState.map((item) =>
                item.id === id
                    ? { ...item, isChecked: !item.isChecked }
                    : { ...item, isChecked: false }
            )
        );
        dataDispatch({ type: 'SORT_BY_PRICE', payload: name });
    };

    return (
        <>
            {radioButtons.map(({ id, name, isChecked }) => (
                <div
                    key={id}
                    className='input-radio'
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}
                >
                    <span
                        tabIndex='0'
                        aria-label={`${name}`}
                        className='dup-radio'
                        style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            marginRight: '1rem',
                            borderRadius: '50%',
                            backgroundColor: isChecked ? theme.constants.primary : theme.color,
                        }}
                        onKeyPress={() => handleChange(id, name)}
                        onClick={() => handleChange(id, name)}
                    ></span>
                    <label
                        onClick={() => handleChange(id, name)}
                        style={{
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                        }}
                    >
                        {name}
                    </label>
                </div>
            ))}
        </>
    );
};

// ```
// data = [{
//     id: "1",
//     isChecked: false,
//     name: 'price-sort',
// }]
// ```;
