import React from "react";
import NavBar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "64px" }}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
