import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Leaf, LogOut, User } from "lucide-react";
import profileImage from "./images/profile.jpg";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user?: {
    nickname: string;
    email: string;
  };
}

const HeaderBox = styled.header`
  background-color: white;
  box-shadow: 0px 5px 7px -2px rgb(202, 202, 202);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 2rem;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
`;

const StyledLeaf = styled(Leaf)`
  color: #16a34a;
  width: 32px;
  height: 32px;
`;

const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 48px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 200px;
  padding: 0.75rem 1rem;
  z-index: 100;
`;

const Nickname = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Email = styled.div`
  font-size: 0.875rem;
  color: gray;
  margin-bottom: 12px;
`;

// const LogoutButton = styled.div`
//   display: flex;
//   align-items: center;
//   cursor: pointer;
//   padding: 0.25rem 0rem;
//   font-size: 0.875rem;

//   &:hover {
//     background-color: #f3f4f6;
//   }

//   svg {
//     margin-right: 8px;
//     color: #4b5563;
//     width: 18px;
//     height: 18px;
//   }
// `;
/* 공통 버튼 스타일 */
const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.4rem 0.2rem;
  font-size: 0.875rem;
  border-radius: 6px;

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    margin-right: 8px;
    color: #4b5563;
    width: 18px;
    height: 18px;
  }
`;

const Header = ({ user }: HeaderProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const defaultUser = {
    nickname: "konempty",
    email: "1117plus@gmail.com",
  };

  const currentUser = user || defaultUser;

  const handleToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <HeaderBox>
      <LogoWrapper>
        <StyledLeaf />
        <Title>GreenMate</Title>
      </LogoWrapper>
      <ProfileWrapper>
        <ProfileImage src={profileImage} alt="프로필" onClick={handleToggle} />
        {showDropdown && (
          <Dropdown>
            <Nickname>{currentUser.nickname}</Nickname>
            <Email>{currentUser.email}</Email>
            <DropdownButton onClick={() => void navigate("/profile/me")}>
              <User /> 마이페이지
            </DropdownButton>
            <DropdownButton onClick={handleLogout}>
              <LogOut /> 로그아웃
            </DropdownButton>
          </Dropdown>
        )}
      </ProfileWrapper>
    </HeaderBox>
  );
};

export default Header;
