import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useDataLayer } from '../../context/DataLayerContext';

// styles
import './readlistpage.scss';

export const ReadlistPage = () => {
    const { theme } = useTheme();
    const history = useHistory();
    const [{ currentUser }] = useAuth();
    const [{ read_lists }, dataDispatch] = useDataLayer();
    const [readlists, setReadlists] = useState([]);

    console.log(readlists);

    useEffect(() => {
        setReadlists(
            (prevState) =>
                read_lists.filter((readlistItem) => readlistItem.userId === currentUser)[0]
        );
    }, [read_lists, currentUser]);

    return (
        <div
            className='readlist'
            style={{ backgroundColor: theme.dark_background, color: theme.color }}
        >
            <input
                type='text'
                name='readlist-search'
                aria-label='readlist search input'
                id='readlist-search'
                placeholder='Search for readlist by name'
            />
            <h1>My readlist</h1>
            <div className='readlist-wrapper'>
                {readlists?.data?.map(({ id, name, image }) => (
                    <Link to={`/readlist/${id}`} key={id} className='readlist-item'>
                        <img src={image?.url} alt={name.text} />
                        <div
                            className='content'
                            style={{ backgroundColor: theme.light_background }}
                        >
                            <div className='name' style={{ color: theme.color }}>
                                {name.text}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
