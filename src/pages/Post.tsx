import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageNavigation } from "../components/PageNavigation";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import PostItem from "../components/PostItem";
import { Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { MOCK_POSTS } from "../mocks/posts";

import "../styles/Post.css";

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredPosts = useMemo(() => {
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
    return MOCK_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.description.toLowerCase().includes(lowercasedSearchTerm),
    );
  }, [debouncedSearchTerm]);

  const handleCreatePost = () => {
    void navigate("/post/create");
  };

  return (
    <div className="post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="post-main">
        <div className="post-header">
          <h1 className="post-title">팀 모집</h1>
          <Button className="post-write-button" onClick={handleCreatePost}>
            모집글 작성
          </Button>
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
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Post;
