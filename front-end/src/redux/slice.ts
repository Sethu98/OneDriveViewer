import {createSlice, PayloadAction} from "@reduxjs/toolkit";
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
    loggedIn: boolean,
    files: { [key: string]: FileItem }
}

const INIT_STATE: ReduxState = {
    loggedIn: false,
    files: {}
}


// Slice for Assignment 1
const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: INIT_STATE,
    reducers: {
        updateFiles: (state, action: PayloadAction<ReduxState>) => {
            if (action.payload.files) {
                console.log("Updating state");
                state.files = action.payload.files;
                console.log("New state", state);
            }


            // for (let itemId in action.payload) {
            //     state.files[itemId] = action.payload[itemId];
            // }

            // return action.payload.files ? action.payload : state;
            // return action.payload.files;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllFilesThunk.fulfilled, (state, action) => {
            console.log(action.payload);

            // for (let itemId in action.payload.files) {
            //     state.files[itemId] = action.payload.files[itemId];
            // }

            state.files = action.payload.files;
        });
    }
});


export default mainSlice.reducer;
export const actions = {
    ...mainSlice.actions
}