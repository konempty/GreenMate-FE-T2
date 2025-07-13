import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Signup from "./pages/Signup"; 로그인 페이지 제작시 주석 해제

// import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}// <Route path="/signup" element={<Signup />} />

export default App;
