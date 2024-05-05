import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Provider} from "react-redux";
import {FilesView} from "./components/FilesView";
import {store} from "./redux/store";
import {BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
import {HomePage} from "./components/HomePage";

function App() {
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
