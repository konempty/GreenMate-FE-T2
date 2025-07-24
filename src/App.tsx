import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Post_View from "./pages/Post_View";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post" element={<Post_View />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
