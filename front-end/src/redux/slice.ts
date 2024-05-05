import {createSlice} from "@reduxjs/toolkit";
import {getAllFilesThunk} from "./thunks";

export type FileItem = {
    type: 'file' | 'folder',
    name: string,
    downloadURL: string,
    driveId: string,
    itemId: string
}

export type ReduxState = {
    default?: ReduxState,
    files: Array<FileItem>
}

const INIT_STATE: ReduxState = {
    files: []
}


// Slice for Assignment 1
const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: INIT_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllFilesThunk.fulfilled, (state, action) => {
            console.log(action.payload);
            state.files = action.payload.files;
        });
    }
});


export default mainSlice.reducer;
export const actions = {
    ...mainSlice.actions
}