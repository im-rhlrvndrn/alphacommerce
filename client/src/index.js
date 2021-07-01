import React from 'react';
import ReactDOM from 'react-dom';
import { DataProvider } from './context/DataProvider';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';

// React components
import { App } from './App';
import { ModalProvider } from './context/ModalProvider';

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <DataProvider>
                <ModalProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </ModalProvider>
            </DataProvider>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
