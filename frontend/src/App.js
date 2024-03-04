import React from 'react';
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
//Pages
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
import Cart from './pages/cart.js'
import PurchaseHistory from './pages/purchase_history.js';
import Privacy from './pages/privacy.js';
import Terms from './pages/terms.js';
import CheckoutFalse from './pages/checkout_f.js';
import CheckoutTrue from './pages/checkout_t.js';
//Component 
import Footer from './components/Footer.js';
import Navbar from './components/Nav.js';
import Loading_art from './components/Loading_art.js';
import SVG_Star from './components/SVG_Star.js';
import SVG_Star_Full from './components/SVG_Star_Full.js';
import SVG_Pastries from './components/SVG_Pastries.js';
import SVG_Bagel from './components/SVG_Bagel.js';
import SVG_Cake from './components/SVG_Cake.js';
import Loader from './components/loading.js';
import SVG_Github from './components/SVG_Github.js';
import QuantityInput from './components/IncDec.js'
import MessageExampleCompact from './components/Prompt.js';
import  MessageFixedRight from './components/PromptLine.js';
import MessageFixedTest  from './components/PromptProduct.js';

function App() {

  return (
    <div className='bg-[#fcce9d] overflow-x-hidden' >


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
            <Route path='/items' element={<Product />} />
            <Route path='/' element={<Home />} />
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
          <Route path="*" element={<Navigate to="/" replace />}/> 
        </Route>
      </Routes>
      <Footer/>
            
        


    </div >

  );

};

export default App;