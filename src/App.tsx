import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Signup from "./pages/Signup"; TODO : 회원가입 페이지 제작시 주석 해제

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO : 추후 본문 페이지 완성 시 path="/login"으로 변경 */}
        <Route path="/" element={<Login />} />
        {/* TODO : <Route path="/signup" element={<Signup />} /> 회원가입 페이지 제작시 주석 해제*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
