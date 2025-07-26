import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redcuers';

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
});

export default store;
