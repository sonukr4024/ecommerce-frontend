import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import CartPage from "./pages/CartPage";
import UserProfilePage from "./pages/UserProfilePage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        {isLoggedIn && (
          <>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/cart"
              element={
                <Layout>
                  <CartPage />
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminPage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <UserProfilePage />
                </Layout>
              }
            />
          </>
        )}
        {!isLoggedIn && (
          <Route
            path="*"
            element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
