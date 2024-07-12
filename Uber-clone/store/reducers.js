import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit';
import navReducer from "./slices/navSlice";
import { act } from 'react';

const initialState = {
    user: null,
    languege: 'en',
};

const useReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.user,

            };
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export const store = configureStore({
    reducer: {
        nav: navReducer,
    },
});

export default combineReducers({
    user: useReducer,
    nav: navReducer,
});