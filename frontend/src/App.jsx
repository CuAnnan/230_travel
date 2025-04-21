import React from "react";
import {Routes, Route, Outlet, Navigate} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Index from "./components/Index.jsx";
import Register from "./components/User/Register.jsx";
import Login from "./components/User/Login.jsx";
import Account from './components/Account/Account.jsx';
import TravelLogs from "./components/TravelLogs/TravelLogs.jsx";
import JourneyPlans from './components/JourneyPlans/JourneyPlans.jsx';

import {client} from "./AxiosInterceptor.js";

const PrivateRoutes = () => {
  const user = client.user;
  return (
      user ? (<Outlet/>) : (<Navigate to='/login'/>)
  );
}

function App() {
  return (<Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Index />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
      <Route element={<PrivateRoutes/>}>
        <Route path="/account" element={<Account />}/>
        <Route path="/logs" element={<TravelLogs />}/>
        <Route path="/journeys" element={<JourneyPlans />}/>
      </Route>
    </Route>
  </Routes>);
}

export default App
