// import React from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContainerModal from "./ContainerModal";
import edteIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import shareIcon from "../../assets/share.svg";

function ContainerList() {
  const navigate = useNavigate();

  // 모달
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 컨테이너
  const cards = [
    { name: "컨테이너 1", lang: "Java", content: "container description..." },
    { name: "컨테이너 2", lang: "Python", content: "container description..." },
    { name: "컨테이너 3", lang: "Java", content: "container description..." },
    { name: "컨테이너 4", lang: "Python", content: "container description..." },
  ];

  // 정렬, 검색
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState(cards);

  // 검색과 정렬을 실행하는 함수
  const searchAndSortCards = () => {
    const filtered = cards
      .filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    setFilteredCards(filtered);
  };

  // 검색어 입력 시 엔터 키를 감지하여 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchAndSortCards();
    }
  };

  // 정렬 순서 변경 시 자동으로 적용
  useEffect(() => {
    searchAndSortCards();
  }, [sortOrder]);

  return (
    <div className="contents">
      <div className="contents-header">
        {/* 회원이름/컨테이너 분류 표시 */}
        <div className="usercon-display">
          <p>별똥별</p>
          <p> 님 / 모든 컨테이너</p>
        </div>

        {/* 컨테이너 분류 표시 */}
        <div className="con-display">
          <p>모든 컨테이너</p>
        </div>

        {/* 검색창/정렬 */}
        <div className="searchbar-line">
          <div className="search">
            <input
              type="text"
              placeholder="검색어 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              // autoComplete={"off"}
              // spellCheck={"false"}
            />
            <img
              src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
              alt="돋보기"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="ascending">이름 오름차순</option>
            <option value="descending">이름 내림차순</option>
          </select>
        </div>
      </div>

      {/* 컨테이너 목록 */}
      <div className="container-cards">
        {/* 컨테이너 추가 */}
        <div onClick={openModal}>+</div>

        {filteredCards.map((item, card) => (
          <div className="concards" key={card}>
            <div className="conname-line">
              <div className="conname">{item.name}</div>
              <div className="esd-icons">
                <img src={edteIcon} alt="edit"/>
                <img src={shareIcon} alt="share"/>
                <img src={deleteIcon} alt="delete"/>
              </div>
            </div>
            <div className="idelang">{item.lang}</div>
            <div className="condesc">{item.content}</div>
            <div className="idestart">시작하기</div>
            <ContainerModal isOpen={isOpen} close={closeModal} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContainerList;
