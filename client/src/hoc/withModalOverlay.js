import { useModal } from '../context/ModalProvider';
import { useTheme } from '../context/ThemeProvider';

export const withModalOverlay = (WrappedComponent) => {
    const WithModalOverlay = (props) => {
        const { theme } = useTheme();
        const [_, modalDispatch] = useModal();

        console.log('HOC props => ', props);

        return (
            <>
                {props.modal.isActive && (
                    <div
                        // className='overlay'
                        style={{
                            width: '100%',
                            height: '100vh',
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            // zIndex: '9',
                            // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        <div
                            className='overlay'
                            style={{
                                width: '100%',
                                height: '100vh',
                                zIndex: '9',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            }}
                            onClick={() => modalDispatch({ type: props.dispatchType })}
                        ></div>
                        <div
                            className='modal'
                            style={{
                                top: '50%',
                                left: '50%',
                                zIndex: '10',
                                height: 'auto',
                                width: '400px',
                                padding: '2rem',
                                position: 'fixed',
                                minHeight: '400px',
                                minWidth: '300px',
                                backgroundColor: theme.dark_background,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <WrappedComponent {...props} />
                        </div>
                    </div>
                )}
            </>
        );
    };

    return WithModalOverlay;
};
