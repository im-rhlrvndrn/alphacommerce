import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
// import { withModalState } from '../../hoc/withModalState';

// styles
import './modal.scss';

export const Modal = ({ setIsModalActive, children }) => {
    const { theme } = useTheme();

    return (
        <>
            <div
                className='modal-underlay'
                onClick={() =>
                    setIsModalActive((prevState) => ({
                        ...prevState,
                        isActive: !prevState.isActive,
                    }))
                }
            ></div>
            <div
                className='modal'
                style={{ backgroundColor: theme.dark_background, color: theme.color }}
            >
                {children}
            </div>
        </>
    );
};

// const EnhancedModal = withModalState(Modal);
// export { EnhancedModal };
