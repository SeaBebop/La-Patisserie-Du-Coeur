import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Nav.js';
import Product from './pages/products.js';
import PrivateRoute from './utils/PrivateRoute.js';
import Login from './pages/login.js';
import SignUp from './pages/sign-in.js';
import Layout from './components/Layout.js';
import './App.css';
import Unauthorized from './pages/unauthorized.js';
import User_list from './pages/User_List.js';
import PersistLogin from './components/PersistLogin.js'
import Home from './pages/home.js';
import Verify from './pages/email_verification.js';
import Resend from './pages/email_resend.js';
import PasswordReset from './pages/password_reset.js';
import PasswordResetConfirm from './pages/password_reset_confirm.js';
import Item from './pages/item.js';
function App() {

  return (
    <div >

      <Navbar />

      <Routes>
        {/*Logged in Route*/}
        <Route path='/' element={<Layout />} >

          <Route element={<PersistLogin />}>

                <Route element={<PrivateRoute allowedRoles={[1]} />}>
                  <Route path='/User_list' element={<User_list />} />
                </Route>

                <Route path='/' element={<Home />} />
                <Route path='products/:productID/' element={<Item />} />
                <Route path='/login' element={<Login />} />
          </Route>
          <Route path='/products' element={<Product />} />
          {/*Public Routes*/}
          {/*Since I learned about useParams I can make a email_resend/ID instead of 
          making the user copy the message ID*/}
          <Route path='/email_verification' element={<Verify />} />
          <Route path='/email_verification/:verifyID/' element={<Verify />} />
          <Route path='products/:productID/' element={<Item />} />
          <Route path='/email_resend' element={<Resend />} />
          <Route path='/unauthorized' element={<Unauthorized />} />
          <Route path='/password_reset' element={<PasswordReset />} />
          <Route path='/password_reset_confirm' element={<PasswordResetConfirm />} />
          {/*Catch All*/}
          <Route path='/sign-in' element={<SignUp />} />
        </Route>
      </Routes>



    </div >

  );

};

export default App;