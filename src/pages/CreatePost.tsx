import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { PageNavigation } from "../components/PageNavigation";
import Button from "../components/Button";
import Input from "../components/Input";
import { Label } from "../components/label";

import "../styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCancel = () => {
    void navigate("/post");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직
    console.log({ title, description });
    void navigate("/post");
  };

  return (
    <div className="create-post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="create-post-main">
        <h1 className="create-post-title">팀 모집글 작성</h1>
        <form className="create-post-form">
          <div className="create-post-form-group">
            <Label className="create-post-label">제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="제목을 작성해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="create-post-input"
            />
          </div>
          <div className="create-post-form-group">
            <Label className="create-post-label">내용</Label>
            <textarea
              id="description"
              placeholder="내용을 작성해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="create-post-textarea"
              rows={6}
            />
          </div>
          <div className="create-post-buttons">
            <Button className="create-post-cancel" onClick={handleCancel}>
              취소
            </Button>
            <Button className="create-post-submit" onClick={handleSubmit}>
              작성 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
