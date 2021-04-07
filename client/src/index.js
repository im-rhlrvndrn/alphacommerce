import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataLayerProvider } from './context/DataLayerContext';

// React components
import { App } from './App';
import { makeServer } from './api/mockServer';

if (process.env.NODE_ENV === 'development') {
    makeServer();
}

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <DataLayerProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </DataLayerProvider>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
