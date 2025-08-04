import { useState } from "react";
import { PageNavigation } from "../components/PageNavigation";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { Label } from "../components/label";
import { Calendar, Users, Search } from "lucide-react";

import "../styles/Post.css";

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      title: "제목1",
      description: "테스트",
      date: "2025-08-01 12:23",
      participants: 0,
    },
    {
      title: "제목2",
      description: "테스트 내용이 얼마나 길어져도 되는지 확인하기 위한 테스트입니다.",
      date: "2025-08-01 12:23",
      participants: 4,
    },
    {
      title: "제목3",
      description: "얼마나 길어질 수 있는지 확인하기 위한 테스트입니다. 이 내용은 실제로는 짧지만, 테스트를 위해 길게 작성되었습니다.",
      date: "2025-08-01 12:23",
      participants: 12,
    },
    {
      title: "제목4",
      description: "더더욱 길어지는 내용입니다. 이 글은 테스트를 위해 작성된 것으로, 실제로는 이렇게 길지 않습니다. 하지만, 다양한 상황을 시뮬레이션하기 위해 길게 작성되었습니다.",
      date: "2025-08-01 12:23",
      participants: 314,
    },
    {
      title: "제목도 길어지면 어떻게 될까? 궁금해서 작성해본 제목",
      description: "테스트",
      date: "2025-08-01 12:23",
      participants: 0,
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="post-main">
        <div className="post-header">
          <h1 className="post-title">팀 모집</h1>
          <Button className="post-write-button">모집글 작성</Button>
        </div>
        <div className="post-search-box">
          <Search size={20} className="post-search-icon" />
          <Input
            type="text"
            placeholder="팀 또는 활동 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="post-search-input"
          />
        </div>
        <div className="post-list">
          {filteredPosts.map((post, index) => (
            <div key={index} className="post-item">
              <div className="post-item-title">
                <h2 className="post-item-title-text">{post.title}</h2>
              </div>
              <div className="post-item-content">
                <p className="post-item-description">{post.description}</p>
                <p className="post-item-meta">
                  <Calendar size={16} /> {post.date}
                </p>
                <p className="post-item-meta">
                  <Users size={16} /> {post.participants}명 참여
                </p>
                <div className="post-item-bottom">
                  <Label className="post-item-label">모집중</Label>
                  <Button className="post-item-button">상세보기</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Post;
