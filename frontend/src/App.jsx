import React from "react";
import {Routes, Route} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Index from "./components/Index.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";

function App() {
  return (<Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Index />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
    </Route>
  </Routes>);
}

export default App
