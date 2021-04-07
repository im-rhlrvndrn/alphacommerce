import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHistory, useParams } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import { ReadlistItem } from '../../components/ReadlistItem';
import { useDataLayer } from '../../context/DataLayerContext';

export const Readlist = () => {
    const { theme } = useTheme();
    const history = useHistory();
    let userIndex, readListIndex;
    const urlParams = useParams();
    const [{ currentUser }] = useAuth();
    const [{ read_lists, products }] = useDataLayer();
    const [readList, setReadList] = useState({});

    const renderReadListItems = () => {
        return products?.map((productItem) =>
            readList?.products?.map(
                (readListItem) =>
                    readListItem.id === productItem.id && <ReadlistItem item={productItem} />
            )
        );
    };

    useEffect(() => {
        userIndex = read_lists.findIndex((item) => item.userId === currentUser);
        readListIndex = read_lists[userIndex].data.findIndex((item) => item.id === urlParams.id);

        setReadList((prevState) => read_lists[userIndex].data[readListIndex]);
        console.log('The readlist: ', read_lists[userIndex].data[readListIndex]);
        if (readListIndex < 0 || read_lists[userIndex].data[readListIndex].products.length === 0)
            history.goBack();
    }, [read_lists, currentUser]);

    // useEffect(() => {
    //     userIndex = read_lists.findIndex((item) => item.userId === currentUser);
    //     readListIndex = read_lists[userIndex].data.findIndex((item) => item.id === urlParams.id);

    //     console.log('The readlist: ', read_lists[userIndex].data[readListIndex]);
    //     if (readListIndex < 0 || read_lists[userIndex].data[readListIndex].products.length === 0)
    //         history.goBack();
    // }, []);

    return (
        <>
            <div className='cart-wrapper' style={{ backgroundColor: theme.dark_background }}>
                <div className='cart'>
                    <h1 style={{ color: theme.color }}>{readList?.name?.text}</h1>
                    <div className='cart-items' style={{ color: theme.color }}>
                        {renderReadListItems()}
                    </div>
                    <button
                        className='continue-shopping mr-2'
                        style={{ backgroundColor: theme.light_background, color: theme.color }}
                        onClick={() => history.push('/')}
                    >
                        Add more to readlist
                    </button>
                </div>
                <div
                    className='cart-checkout p-2 h-max'
                    style={{ backgroundColor: theme.light_background, color: theme.color }}
                >
                    <h2>Summary</h2>
                    <div
                        className='checkout-group mb-1'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}
                    >
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>sub-total</div>
                            <div className='price'>₹ </div>
                        </div>
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>gst</div>
                            <div className='price'>₹</div>
                        </div>
                    </div>
                    <div
                        className='checkout-group mb-1'
                        style={{ borderBottom: `2px solid ${theme.dark_background}` }}
                    >
                        <div className='checkout-group-row flex flex-justify-sb mb-1'>
                            <div className='heading'>total</div>
                            <div className='price'>₹ {readList?.estimated_price?.value}</div>
                        </div>
                    </div>
                    <button
                        className='w-100p text-align-center'
                        style={{
                            backgroundColor: theme.constants.dark,
                            color: theme.constants.light,
                        }}
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        className='w-100p text-align-center'
                        style={{ backgroundColor: 'transparent', color: theme.color }}
                    >
                        Create a bibliography
                    </button>
                </div>
            </div>
        </>
    );
};
