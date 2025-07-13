import React, { useState } from "react";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import "../styles/Login.css"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("로그인");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-header">
          <Leaf size={48} color="#16a34a" />
          <span className="login-title">GreenMate</span>
        </div>
        <p className="login-desc">
          환경 운동가들을 위한 커뮤니티에 오신 것을 환영합니다
        </p>
        <form>
          <label className="login-label">이메일</label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
          <label className="login-label">비밀번호</label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="button" onClick={handleLogin}>
            로그인
          </Button>
        </form>
        <div className="login-footer">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="login-signup-link">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;