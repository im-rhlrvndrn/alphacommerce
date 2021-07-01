import { useDataLayer } from '../../context/DataProvider';
import { useTheme } from '../../context/ThemeProvider';

// components
import { CloseIcon } from '../../react_icons/CloseIcon';

export const Toast = () => {
    const { theme } = useTheme();
    const [{ toasts }, dataDispatch] = useDataLayer();

    const renderToast = (toast) => {
        const timerId = setTimeout(() => {
            dataDispatch({
                type: 'UNSET_TOAST',
                payload: { data: { toastId: toast._id } },
            });
        }, 5000);

        const clearToast = (timerId) => {
            dataDispatch({
                type: 'UNSET_TOAST',
                payload: { data: { toastId: toast._id } },
            });
            clearTimeout(timerId);
        };

        return (
            <div
                className='p-4 mb-1 flex items-center justify-between'
                key={toast._id}
                style={{
                    backgroundColor: theme.color,
                    color: theme.light_background,
                    borderLeft: `5px solid ${
                        toast.status === 'success'
                            ? 'green'
                            : toast.status === 'warning'
                            ? 'yellow'
                            : toast.status === 'failed'
                            ? 'red'
                            : 'red'
                    }`,
                }}>
                <p>{toast?.message}</p>
                <button
                    style={{ backgroundColor: theme.light_background }}
                    onClick={() => clearToast(timerId)}
                    className='p-0 p-4 ml-4 flex items-center justify-center'>
                    <CloseIcon fill={theme.color} />
                </button>
            </div>
        );
    };

    return (
        <div
            className='toast_container'
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                width: '400px',
                maxWidth: '400px',
                maxHeight: '500px',
                overflowY: 'auto',
                height: 'auto',
            }}>
            {toasts?.map((toast) => {
                return renderToast(toast);
            })}
        </div>
    );
};
