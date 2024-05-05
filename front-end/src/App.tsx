import React, {useEffect, useState} from 'react';
import './App.css';
import {Provider} from "react-redux";
import {FilesView} from "./components/FilesView";
import {dispatch, initStore, store} from "./redux/store";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {HomePage} from "./components/HomePage";
import {actions} from "./redux/slice";


function App() {
    // const [rc, setRc] = useState(0);

    useEffect(() => {
        initStore();

        const source = new EventSource(`http://localhost:3000/file_update_stream`);

        source.addEventListener('open', () => {
            console.log('SSE opened!');
        });

        source.addEventListener('message', (e) => {
            if (e.data) {
                console.log(e.data);
                dispatch(actions.updateFiles(JSON.parse(e.data)));
                // setRc(rc + 1);
            }
        });

        source.addEventListener('error', (e) => {
            console.error('Error: ', e);
        });

        return () => {
            source.close();
        };
    }, []); // Execute only once

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/files_view" element={<FilesView/>}/>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
