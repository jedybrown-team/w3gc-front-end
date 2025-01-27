import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Privacy from "./components/Privacy/Privacy";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import AccountManagement from "./components/AccountManagement/AccountManagement";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account-management" element={<AccountManagement />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
