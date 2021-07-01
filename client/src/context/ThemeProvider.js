import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightTheme = {
    light_background: '#f5f5f5',
    dark_background: '#eeeeee',
    color: '#222222',
    constants: {
        light: '#f5f5f5',
        dark: '#222222',
        icon: '#222222',
        primary: '#F8D410',
        red: '#e73a23',
    },
};

const darkTheme = {
    light_background: '#181818',
    dark_background: '#111111',
    color: '#f5f5f5',
    constants: {
        light: '#f5f5f5',
        dark: '#111111',
        icon: '#f5f5f5',
        primary: '#F8D410',
        red: '#e73a23',
    },
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isLightTheme, setIsLightTheme] = useState(false);

    return (
        <ThemeContext.Provider
            value={{
                isLightTheme,
                theme: isLightTheme ? lightTheme : darkTheme,
                setTheme: setIsLightTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
