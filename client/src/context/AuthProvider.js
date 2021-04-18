import { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from '../reducers/authReducer';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    return (
        <AuthContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </AuthContext.Provider>
    );
};
