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
import Footer from './components/Footer.js';
import Cart from './pages/cart.js'
import SVG_Star from './components/SVG_Star.js';
import SVG_Star_Full from './components/SVG_Star_Full.js';
import SVG_Pastries from './components/SVG_Pastries.js';
import SVG_Bagel from './components/SVG_Bagel.js';
import SVG_Cake from './components/SVG_Cake.js';
import PurchaseHistory from './pages/purchase_history.js';
import Privacy from './pages/privacy.js';
import Terms from './pages/terms.js';
import CheckoutFalse from './pages/checkout_f.js';
import CheckoutTrue from './pages/checkout_t.js';
import Loader from './components/loading.js';
function App() {

  return (
    <div className='bg-[#0349aa] ' >


      <Navbar />
      <Routes>
        {/*Logged in Route*/}

        <Route path='/' element={<Layout />} >

          <Route element={<PersistLogin />}>

            <Route path='/cart/checkout/true' element={<CheckoutTrue />} />
            <Route path='/cart/checkout/false' element={<CheckoutFalse />} />
            <Route element={<PrivateRoute allowedRoles={[1]} />}>
              <Route path='/User_list' element={<User_list />} />
            </Route>
            <Route path='/products' element={<Product />} />
            <Route path='/' element={<Home />} />
            <Route path='products/:productID/' element={<Item />} />
            <Route path='/login' element={<Login />} />
            <Route path='/email_resend' element={<Resend />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/email_verification' element={<Verify />} />
            <Route path='/sign-in' element={<SignUp />} />
            <Route path='/purchase-history' element={<PurchaseHistory />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/terms' element={<Terms />} />

          </Route>

          {/*Public Routes*/}
          {/*Since I learned about useParams I can make a email_resend/ID instead of 
          making the user copy the message ID*/}

          <Route path='/email_verification/:verifyID/' element={<Verify />} />
          <Route path='products/:productID/' element={<Item />} />
          <Route path='/unauthorized' element={<Unauthorized />} />

          <Route path='/password_reset' element={<PasswordReset />} />
          <Route path='/password_reset_confirm' element={<PasswordResetConfirm />} />
          {/*Catch All*/}

        </Route>
      </Routes>



    </div >

  );

};

export default App;