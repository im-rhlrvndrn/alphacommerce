import { useEffect } from 'react';
import { useDataLayer } from '../../context/DataProvider';
import { useTheme } from '../../context/ThemeProvider';

export const Toast = () => {
    const { theme } = useTheme();
    const [{ toasts }, dataDispatch] = useDataLayer();

    return (
        <div
            className='toast_container'
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                width: '400px',
                maxWidth: '400px',
                height: 'auto',
            }}
        >
            {toasts?.map((toast) => {
                setTimeout(() => {
                    dataDispatch({
                        type: 'UNSET_TOAST',
                        payload: { data: { toastId: toast._id } },
                    });
                }, 5000);
                return (
                    <div
                        className='toast'
                        key={toast._id}
                        style={{
                            backgroundColor: theme.color,
                            color: theme.light_background,
                            padding: '1rem',
                            marginBottom: '.5rem',
                            borderLeft: '5px solid rgba(255,192,0)',
                        }}
                    >
                        {toast?.message}
                    </div>
                );
            })}
        </div>
    );
};
