import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Provider} from "react-redux";
import {MainPage} from "./components/MainPage";
import {store} from "./redux/store";

function App() {
  return (
      <Provider store={store}>
        <MainPage/>
      </Provider>
  );
}

export default App;
