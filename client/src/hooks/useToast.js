import { useDataLayer } from '../context/DataProvider';

export const useToast = () => {
    const [{ toasts }, dataDispatch] = useDataLayer();
    const setToast = (data) => {
        dataDispatch({
            type: 'SET_TOAST',
            payload: {
                data,
            },
        });
    };

    return { setToast };
};
