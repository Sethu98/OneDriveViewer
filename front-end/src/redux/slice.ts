import {createSlice} from "@reduxjs/toolkit";
import {getAllFilesThunk} from "./thunks";

export type FileItem = {
    type: 'file' | 'folder',
    name: string,
    downloadURL: string,
    driveId: string,
    itemId: string,
    users: Array<string>
}

export type ReduxState = {
    default?: ReduxState,
    files: { [key: string]: FileItem }
}

const INIT_STATE: ReduxState = {
    files: {}
}


// Slice for Assignment 1
const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: INIT_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFilesThunk.fulfilled, (state, action) => {
            console.log(action.payload);

            for (let itemId in action.payload.files) {
                state.files[itemId] = action.payload.files[itemId];
            }

            // state.files = {...state.files, ...action.payload.files};
        });
    }
});


export default mainSlice.reducer;
export const actions = {
    ...mainSlice.actions
}