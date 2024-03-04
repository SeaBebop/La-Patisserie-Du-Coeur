import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext.js'
import{ CartProvider } from './context/CartContext.js'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter basename='/'>
    <AuthProvider>
      <CartProvider>
    <Routes>

      <Route path='/*' element={<App/>}/>
    </Routes>
    </CartProvider>
    </AuthProvider>

    </BrowserRouter>
    
  

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
