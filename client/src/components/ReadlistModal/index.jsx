import { v4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import { maxWords } from '../../utils/math_helpers';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// styles
import './readlistmodal.scss';

export const ReadlistModal = ({ setIsModalActive, productIds }) => {
    const { theme } = useTheme();
    const readlistRef = useRef(null);
    const [{ currentUser }] = useAuth();
    const [filter, setFilter] = useState('');
    const [{ read_lists }, dataDispatch] = useDataLayer();
    const [newReadlistRef, setNewReadlistRef] = useState(false);

    const addNewReadlist = () => setNewReadlistRef((prevState) => !prevState);

    const renderReadlistNames = (filter = '') => {
        const userIndex = read_lists.findIndex((item) => item.userId === currentUser);
        const filteredReadlist =
            filter !== ''
                ? read_lists[userIndex].data.filter((item) =>
                      item.name.text.toLowerCase().includes(filter.toLowerCase())
                  )
                : read_lists[userIndex].data;

        if (filteredReadlist.length === 0)
            return <p style={{ color: theme.color, padding: '1rem' }}>No readlist</p>;

        return filteredReadlist.map((readlistItem) => (
            <div
                className='readlist-item'
                style={{ backgroundColor: theme.light_background }}
                onClick={() => {
                    setIsModalActive((prevState) => !prevState);
                    dataDispatch({
                        type: 'ADDTOREADLIST',
                        payload: {
                            ...readlistItem,
                            products: [...readlistItem.products, ...productIds],
                        },
                    });
                }}
            >
                {maxWords(readlistItem.name.text, 30)}
            </div>
        ));
    };

    const createReadlist = (event) => {
        setNewReadlistRef((prevState) => !prevState);
        if (event.target.textContent)
            dataDispatch({
                type: 'CREATEREADLIST',
                payload: {
                    id: v4(),
                    name: { text: event.target.textContent },
                    image: {
                        url:
                            'https://images.pexels.com/photos/2685319/pexels-photo-2685319.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                    },
                    estimated_price: {
                        value: 0,
                    },
                    products: [],
                },
            });
    };

    useEffect(() => {
        if (newReadlistRef) readlistRef.current.focus();
    }, [newReadlistRef]);

    return (
        <div className='readlist-modal'>
            <div className='heading'>Add to readlist</div>
            <div className='cta'>
                <input
                    type='text'
                    value={filter}
                    autoComplete='off'
                    id='readlist-modal-input'
                    name='readlist-modal-input'
                    placeholder='Search for readlist...'
                    onChange={(event) => setFilter((prevState) => event.target.value)}
                    style={{ backgroundColor: theme.light_background, color: theme.color }}
                />
                <div
                    className='createNew'
                    onClick={addNewReadlist}
                    style={{ backgroundColor: theme.dark_background, color: theme.color }}
                >
                    + Create readlist
                </div>
            </div>
            <div className='readlist-modal-wrapper'>
                {newReadlistRef && (
                    <div
                        className='new-readlist'
                        contentEditable
                        ref={readlistRef}
                        onBlur={createReadlist}
                    ></div>
                )}
                {renderReadlistNames(filter)}
            </div>
        </div>
    );
};
