import {getAllFilesThunk} from "./thunks";

import {configureStore, Tuple} from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";


import mainReducer from './slice';

export const store = configureStore({
    reducer: mainReducer,
    middleware: () => new Tuple(thunk)
});

export const initStore = () => store.dispatch(getAllFilesThunk());
export const dispatch = store.dispatch;