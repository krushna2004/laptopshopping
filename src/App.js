import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Signup from "./components/Signup";
import About from "./components/About";
import MyCart from "./components/MyCart";
import AdminLogin from "./components/AdminLogin";
import Login from "./components/Login";
import React, { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loginStatus, setLoginStatus] = useState("Login");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      setLogin(true);
      setLoginStatus("Logout");
    }
  }, [setToken, setLogin, setLoginStatus]);

  return (
    <BrowserRouter>
      <Header
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
        setLogin={setLogin}
        setToken={setToken}
        token={token}
        setAdmin={setAdmin}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              login={login}
              setLogin={setLogin}
              admin={admin}
              setAdmin={setAdmin}
            />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            <Login
              setLogin={setLogin}
              setAdmin={setAdmin}
              setLoginStatus={setLoginStatus}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              setLogin={setLogin}
              setAdmin={setAdmin}
              setLoginStatus={setLoginStatus}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/mycart" element={<MyCart token={token} />} />
        <Route
          path="/adminlogin"
          element={<AdminLogin setLogin={setLogin} setAdmin={setAdmin} />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
