import { useState, useMemo } from "react";
import { PageNavigation } from "../components/PageNavigation";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import PostItem from "../components/PostItem";
import { Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

import "../styles/Post.css";

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  participants: number;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "제목1",
    description: "테스트",
    date: "2025-08-01 12:23",
    participants: 0,
  },
  {
    id: 2,
    title: "제목2",
    description:
      "테스트 내용이 얼마나 길어져도 되는지 확인하기 위한 테스트입니다.",
    date: "2025-08-01 12:23",
    participants: 4,
  },
  {
    id: 3,
    title: "제목3",
    description:
      "얼마나 길어질 수 있는지 확인하기 위한 테스트입니다. " +
      "이 내용은 실제로는 짧지만, 테스트를 위해 길게 작성되었습니다.",
    date: "2025-08-01 12:23",
    participants: 12,
  },
  {
    id: 4,
    title: "제목4",
    description:
      "더더욱 길어지는 내용입니다. 이 글은 테스트를 위해 작성된 것으로, " +
      "실제로는 이렇게 길지 않습니다. 하지만, 다양한 상황을 시뮬레이션하기 위해 길게 작성되었습니다.",
    date: "2025-08-01 12:23",
    participants: 314,
  },
  {
    id: 5,
    title: "제목도 길어지면 어떻게 될까? 궁금해서 작성해본 제목",
    description: "테스트",
    date: "2025-08-01 12:23",
    participants: 0,
  },
];

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredPosts = useMemo(() => {
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
    return MOCK_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.description.toLowerCase().includes(lowercasedSearchTerm),
    );
  }, [debouncedSearchTerm]);

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
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Post;
