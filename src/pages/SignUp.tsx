import { Input } from "../components/SignInput";
import { Label } from "../components/label";
import { Button } from "../components/SignButton";
import { Leaf, Upload } from "lucide-react";
import { Link } from 'react-router-dom';
import { useRef, useState } from "react"; 

import "../styles/SignUp.css";

const SignUp = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file); 
      setPreviewUrl(url);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-logo">
          <Leaf className="signup-leaf-icon" />
          <h1 className="signup-title">GreenMate</h1>
        </div>

        <p className="signup-subtitle">
          환경 운동가들을 위한 커뮤니티에 가입하세요
        </p>

        <div className="signup-field">
          <Label htmlFor="nickname" className="signup-label">닉네임</Label>
          <div className="signup-row">
            <Input id="nickname" placeholder="홍길동" className="signup-input" />
            <Button type="button" className="signup-check-btn"> 중복 확인 </Button>
          </div>
        </div>

        <div className="signup-field">
          <Label htmlFor="email" className="signup-label">이메일</Label>
          <Input id="email" type="email" placeholder="your@email.com" className="signup-input" />
        </div>

        <div className="signup-field">
          <Label htmlFor="password" className="signup-label">비밀번호</Label>
          <Input id="password" type="password" className="signup-input" />
        </div>

        <div className="signup-field">
          <Label htmlFor="passwordConfirm" className="signup-label">비밀번호 확인</Label>
          <Input id="passwordConfirm" type="password" className="signup-input" />
        </div>

        <div className="signup-field">
          <Label htmlFor="profileImage" className="signup-label">프로필 이미지</Label>
          <input
            type="file"
            id="profileImage"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button
            type="button"
            className="signup-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload width="20px" height="20px" />
            이미지 업로드
          </Button>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="미리보기"
              style={{ marginTop: "1rem", width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
          )}
        </div>

        <Button className="signup-submit">회원가입</Button>

        <div className="signup-footer">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="signup-login-link">
            로그인
          </Link>
        </div>

        {/* <p className="signup-login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p> */}
      </div>
    </div>
  );
};

export default SignUp;
