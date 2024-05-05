import {createAsyncThunk} from "@reduxjs/toolkit";
import {apis} from "../api";

const URL = "http://localhost:3000"

export const getAllFilesThunk = createAsyncThunk(
    'getAllFiles',
    async () => {
        const resp = await fetch(URL + '/get_all_files');

        return resp.json();
    }
);
