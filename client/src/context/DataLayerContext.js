import { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from '../reducers/dataReducer';

const DataLayerContext = createContext();

export const useDataLayer = () => useContext(DataLayerContext);

export const DataLayerProvider = ({ children }) => {
    return (
        <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </DataLayerContext.Provider>
    );
};
