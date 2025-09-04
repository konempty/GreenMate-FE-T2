import { Input } from "../components/SignInput";
import { Label } from "../components/label";
import { Button } from "../components/SignButton";
import { Leaf, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { signUp, checkNickname } from "@/api/auth";
import { getErrorMessage } from "@/lib/http-error";
import "../styles/SignUp.css";

/** term 목록 .. 지금은 예시로 필수 2개만 하드코딩. */
const REQUIRED_TERMS = [
  { id: 1, label: "이용약관(필수)" },
  { id: 2, label: "개인정보 수집/이용(필수)" },
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nicknameRe = /^[\wㄱ-ㅎ가-힣]{2,10}$/; // 2~10자 한/영/숫자/_
const passwordRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,100}$/;

export default function SignUp() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selfIntro, setSelfIntro] = useState("");

  const [agreements, setAgreements] = useState<Record<number, boolean>>(
    Object.fromEntries(REQUIRED_TERMS.map((t) => [t.id, false])),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // 닉네임 중복 확인 관련 상태
  const [nickChecking, setNickChecking] = useState(false);
  const [nickAvailable, setNickAvailable] = useState<boolean | null>(null);
  const [nickCheckedNick, setNickCheckedNick] = useState("");
  const [nickMsg, setNickMsg] = useState<string | null>(null);

  // 닉네임이 바뀌면 이전 확인 결과 초기화
  useEffect(() => {
    setNickAvailable(null);
    setNickCheckedNick("");
    setNickMsg(null);
  }, [nickname]);

  const TERM_ID_SET = new Set(REQUIRED_TERMS.map((t) => t.id));

  const toggleAgreement = (id: number) => {
    setAgreements((prev) => {
      if (!TERM_ID_SET.has(id)) {
        console.warn("toggleAgreement: unknown term id:", id);
        return prev; // 잘못된 id는 무시하자.
      }
      return { ...prev, [id]: !prev[id] };
    });
  };

  const validate = () => {
    if (!emailRe.test(email)) return "이메일 형식이 올바르지 않습니다.";
    if (!nicknameRe.test(nickname))
      return "닉네임은 2~10자/한영숫자만 가능합니다.";
    if (nickAvailable === false && nickCheckedNick === nickname)
      return "이미 사용 중인 닉네임입니다.";
    if (nickAvailable !== true || nickCheckedNick !== nickname) {
      return "닉네임 중복 확인을 해주세요.";
    }
    if (!passwordRe.test(password))
      return "비밀번호는 영문+숫자를 포함하여 8자 이상이어야 합니다.";
    if (password !== passwordConfirm) return "비밀번호가 일치하지 않습니다.";
    for (const t of REQUIRED_TERMS) {
      if (!agreements[t.id]) return `${t.label}에 동의가 필요합니다.`;
    }
    if (selfIntro.length > 300) return "자기소개는 300자 이하여야 합니다.";
    return null;
  };

  // 닉네임 중복 확인 핸들러
  const onCheckNickname = async () => {
    const name = nickname.trim();
    if (!nicknameRe.test(name)) {
      setNickMsg("닉네임 형식이 올바르지 않습니다.");
      setNickAvailable(null);
      return;
    }
    setNickChecking(true);
    setNickMsg(null);
    try {
      const result = await checkNickname(name);
      setNickCheckedNick(name);
      if (result === "available") {
        setNickAvailable(true);
        setNickMsg("사용 가능한 닉네임입니다.");
      } else if (result === "duplicate") {
        setNickAvailable(false);
        setNickMsg("이미 사용 중인 닉네임입니다.");
      } else {
        setNickAvailable(null);
        setNickMsg("닉네임 확인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setNickAvailable(null);
      setNickMsg(getErrorMessage(err));
    } finally {
      setNickChecking(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setSubmitting(true);
    try {
      await signUp(
        {
          userInfo: {
            email,
            password,
            nickname,
            selfIntroduction: selfIntro || undefined,
            signUpTermAgreements: REQUIRED_TERMS.map((t) => ({
              termId: t.id,
              agreed: !!agreements[t.id],
            })),
          },
          profileImage: file ?? undefined,
        },
        controllerRef.current.signal,
      );

      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      void nav("/login", { replace: true, state: { email } });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void onSubmit(e);
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <div className="signup-logo">
          <Leaf className="signup-leaf-icon" />
          <h1 className="signup-title">GreenMate</h1>
        </div>

        <p className="signup-subtitle">
          환경 운동가들을 위한 커뮤니티에 가입하세요
        </p>

        {/* 닉네임 */}
        <div className="signup-field">
          <Label htmlFor="nickname" className="signup-label">
            닉네임
          </Label>
          <div className="signup-row">
            <Input
              id="nickname"
              placeholder="홍길동"
              className="signup-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              required
            />
            <Button
              type="button"
              className="signup-check-btn"
              onClick={() => {
                void onCheckNickname();
              }}
              disabled={nickChecking || !nickname.trim()}
            >
              중복 확인
            </Button>
          </div>
          {nickMsg && (
            <div
              style={{
                marginTop: 3,
                fontSize: 13,
                color: nickAvailable ? "#1b5e20" : "#c62828",
              }}
            >
              {nickMsg}
            </div>
          )}
        </div>

        {/* 이메일 */}
        <div className="signup-field">
          <Label htmlFor="email" className="signup-label">
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* 비밀번호 */}
        <div className="signup-field">
          <Label htmlFor="password" className="signup-label">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="signup-field">
          <Label htmlFor="passwordConfirm" className="signup-label">
            비밀번호 확인
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            className="signup-input"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* 자기소개 */}
        <div className="signup-field">
          <Label htmlFor="selfIntro" className="signup-label">
            자기소개(선택)
          </Label>
          <textarea
            id="selfIntro"
            className="signup-input"
            rows={3}
            value={selfIntro}
            onChange={(e) => setSelfIntro(e.target.value)}
            maxLength={300}
            placeholder="안녕하세요! 제가 바로 길거리 청소왕입니다."
          />
        </div>

        {/* 약관 동의 */}
        <div className="signup-field">
          <Label className="signup-label">약관 동의</Label>
          <div className="signup-terms">
            {REQUIRED_TERMS.map((t) => (
              <label key={t.id} className="term-row">
                <input
                  type="checkbox"
                  checked={!!agreements[t.id]}
                  onChange={() => toggleAgreement(t.id)}
                  required
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {/* 프로필 이미지 */}
        <div className="signup-field">
          <Label htmlFor="profileImage" className="signup-label">
            프로필 이미지
          </Label>
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
              style={{
                marginTop: "1rem",
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
        </div>

        {/* 에러 */}
        {error && (
          <div className="error" style={{ color: "#c62828" }}>
            에러: {error}
          </div>
        )}

        {/* 제출 */}
        <Button
          type="submit"
          className="signup-submit"
          disabled={
            submitting || nickAvailable !== true || nickCheckedNick !== nickname
          }
        >
          {submitting ? "가입 중…" : "회원가입"}
        </Button>

        <div className="signup-footer">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="signup-login-link">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
}
