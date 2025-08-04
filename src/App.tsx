import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Post from "./pages/Post";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Education from "./pages/Education";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recycling-education" element={<Education />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
