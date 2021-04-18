import { useTheme } from '../../context/ThemeProvider';

// Styles
import './accordion.scss';

export const Accordion = ({ options, updateAccordion, children }) => {
    const { theme } = useTheme();
    const { heading, isActive, id, multi = false } = options;

    return (
        <div
            className='accordion'
            style={{
                backgroundColor: theme.light_background,
                color: theme.color,
                padding: isActive ? '1.5rem 2rem' : '1rem 1.5rem',
            }}
        >
            <div
                className='accordion-heading'
                style={{ marginBottom: isActive ? '1rem' : '' }}
                onClick={() => updateAccordion(id, multi)}
            >
                {heading} <span>{isActive ? '-' : '+'}</span>
            </div>
            <div
                className='accordion-content'
                style={{
                    overflowY: 'hidden',
                    height: isActive ? 'max-content' : '0',
                    opacity: isActive ? '1' : '0',
                    transition: '.4s all ease-in-out',
                }}
            >
                {children}
            </div>
        </div>
    );
};
