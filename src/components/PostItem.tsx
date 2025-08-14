import { Calendar, Users } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";

// Post 타입 정의
interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  participants: number;
}

const PostItem = ({ post }: { post: Post }) => {
  return (
    <div className="post-item">
      <div className="post-item-title">
        <h2 className="post-item-title-text">{post.title}</h2>
      </div>
      <div className="post-item-content">
        <p className="post-item-description">{post.description}</p>
        <p className="post-item-meta">
          <Calendar size={16} /> {post.date} {post.time}
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
  );
};

export default PostItem;
