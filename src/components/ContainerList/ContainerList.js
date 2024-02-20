import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContainerModal from "./ContainerModal";
import edteIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import shareIcon from "../../assets/share.svg";
import * as auth from "../../apis/auth";

function ContainerList() {
  const navigate = useNavigate();

  // 모달
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 유저 정보
  const [userNickname, setUserNickname] = useState("");
  
  // 컨테이너 정보
  const [ConId, setConId] = useState("");
  const [ConType, setConType] = useState("");
  const [ConName, setConName] = useState("");
  const [ConDescription, setConDescription] = useState("");
  const [ConeditUserUuid, setConeditUserUuid] = useState("");
  const [ConcreatedTime, setConcreatedTime] = useState("");
  const [ConlastModifiedTime, setConlastModifiedTime] = useState("");

  // const [cards, setCards] = useState("");
  
  // 페이지 로드시 닉네임 정보 불러오기
  useEffect(() => {
    // API 요청 함수
    const userInfoApi = async () => {
      try {
        let response = await auth.profile();
        if (response.status == 200) {
          setUserNickname(response.data.nickname);
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.code === 100) {
          // 인증에 실패하였습니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 101) {
          // 잘못된 접근입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 102) {
          // 잘못된 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 103) {
          // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 104) {
          // 지원하지 않는 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 105) {
          // Claim이 빈 Access Token 입니다.
          console.error(error.response.data.description);
        }
        else if (error.response.data.code === 1203) {
          // 존재하지 않는 사용자입니다.
          console.error(error.response.data.description);
        }
      }
    };
    userInfoApi();
  }, []);

  

  // 페이지 로드시 컨테이너 정보 불러오기
  useEffect(() => {
    // API 요청 함수
    const containerSearchApi = async () => {
      try {
        let res = await auth.containerSearch();
        console.log(res);

        cards = res.data.ownContainers;
        console.log(cards);

        if (res.status == 200) {

          for (let i = 0; i < cards.length; i++) {
            let createdTimeString = cards[i].createdTime;
            let createdTime = createdTimeString.split('T')[i];
            console.log(createdTime);

            let lastModifiedTimeString = cards[i].lastModifiedTime;
            let lastModifiedTime = lastModifiedTimeString.split('T')[i];
            console.log(lastModifiedTime);

            setConId(cards[i].containerId);
            setConType(cards[i].type);
            setConName(cards[i].name);
            setConDescription(cards[i].description);
            setConeditUserUuid(cards[i].editUserUuid);
            setConcreatedTime(createdTime);
            setConlastModifiedTime(lastModifiedTime);
            console.log(cards[i].name);
          }
          
        }
      } catch (error) {
        // console.log(error);
        // if (error.response.data.code === 100) {
        //   // 인증에 실패하였습니다.
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 101) {
        //   // 잘못된 접근입니다.
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 102) {
        //   // 잘못된 Access Token 입니다.
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 103) {
        //   // 만료된 Access Token 입니다.(해당 에러 발생시 Refresh 요청)
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 104) {
        //   // 지원하지 않는 Access Token 입니다.
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 105) {
        //   // Claim이 빈 Access Token 입니다.
        //   console.error(error.response.data.description);
        // }
        // else if (error.response.data.code === 1203) {
        //   // 존재하지 않는 사용자입니다.
        //   console.error(error.response.data.description);
        // }
      }
    };
    containerSearchApi(); // 컴포넌트가 마운트될 때 API 요청 실행
  }, []);

  // let cards = [];
  // 컨테이너 더미 정보
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
          <p className="userNickname">{userNickname}</p>
          <p>님 / 모든 컨테이너</p>
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
              <div className="conname">{ConName}</div>
              <div className="esd-icons">
                <img src={edteIcon} alt="edit"/>
                <img src={shareIcon} alt="share"/>
                <img src={deleteIcon} alt="delete"/>
              </div>
            </div>
            <div className="typeline">
              <div className="idelang">{ConType}</div>
              <div className="createdTime">생성: {ConcreatedTime}</div>
            </div>
            <div className="nicknameline">
              <div className="editUserUuid">{ConeditUserUuid}</div>
              <div className="lastModifiedTime">수정: {ConlastModifiedTime}</div>
            </div>
            <div className="condesc">{ConDescription}</div>
            <div className="idestart">시작하기</div>
            <ContainerModal isOpen={isOpen} close={closeModal} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContainerList;
