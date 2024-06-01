import React from 'react';
import Home from './components/home'
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/login';
import PrivateRoute from './utils/route/privateRoute';
import Register from './components/auth/register';
import EmailVerification from './components/auth/emailVerification';
import SuccessEmailVerification from './components/auth/successEmailVerification';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/personal-account" element={<Home/>}/>
        </Route>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/verify-email" element={<EmailVerification email='vanya.kurochkin.23@mail.ru'/>}/>
        <Route path="/verify-email-success" element={<SuccessEmailVerification />}/>

      </Routes>
    </>
  );
}

export default App;
