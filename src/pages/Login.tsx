import { useState } from "react";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";

import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    // TODO : 추후 API 연동 및 로그인 로직 구현
    e.preventDefault();
    alert("로그인");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-header">
          <Leaf size={48} className="login-leaf-icon" />
          <span className="login-title">GreenMate</span>
        </div>
        <p className="login-desc">
          환경 운동가들을 위한 커뮤니티에 오신 것을 환영합니다
        </p>
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label" htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="login-input"
            />
          </div>
          <div className="login-form-group">
            <label className="login-label" htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="login-input"
            />
          </div>
          <Button type="submit" className="login-button">
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
