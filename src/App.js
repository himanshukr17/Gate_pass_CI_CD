import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Router, useLocation, useNavigate, useScrollRestoration } from "react-router-dom";
import Routes from './Routes';
import ScrollToTop from './Components/ScrollToTop';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/redux/store';
import { Provider } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  return (

    <BrowserRouter>
    
      <Provider store={store}>
      <Toaster
      // position='top-right'
      />

        <PersistGate loading={null} persistor={persistor}>
          <ScrollToTop />
          <Routes />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
