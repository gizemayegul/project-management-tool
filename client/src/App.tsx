import "./App.css";
import "./index.css";
import Signup from "./Pages/Signup/Signup";
import { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";

const API_URL = import.meta.env.VITE_SERVER_URL;
console.log(API_URL);

function App() {
  return (
    <>
      {/* <div className="text-3xl font-bold underline">{data}</div> */}
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
