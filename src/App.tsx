import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Post from "./pages/Post";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Education from "./pages/Education";
import Community from "./components/Community";
import CommunityDetail from "./components/CommunityDetail";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recycling-education" element={<Education />} />
        <Route path="/community">
          <Route index element={<Community />} />
          <Route path=":id" element={<CommunityDetail />} />
        </Route>
        <Route path="/post/create" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
