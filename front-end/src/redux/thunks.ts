import {createAsyncThunk} from "@reduxjs/toolkit";
import {apis} from "../api";
import {SERVER_URL} from "../constants";

export const getAllFilesThunk = createAsyncThunk(
    'getAllFiles',
    async () => {
        const resp = await fetch(SERVER_URL + '/get_all_files');

        return resp.json();
    }
);
