import { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from '../reducers/dataReducer';

const DataContext = createContext();

export const useDataLayer = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    return (
        <DataContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </DataContext.Provider>
    );
};
