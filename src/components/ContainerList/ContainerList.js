import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContainerModal from "./ContainerModal";
import edteIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import shareIcon from "../../assets/share.svg";
import * as auth from "../../apis/auth";
import ContainerEdit from "./ContainerEdit";
import ContainerShare from "./ContainerShare";
import ContainerDelete from "./ContainerDelete";

function ContainerList({ nickname }) {
  const navigate = useNavigate();

  // 모달
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const openShareModal = () => setIsShareOpen(true);
  const closeShareModal = () => setIsShareOpen(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEditModal = () => setIsEditOpen(true);

  const closeEditModal = () => setIsEditOpen(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openDeleteModal = () => setIsDeleteOpen(true);
  const closeDeleteModal = () => setIsDeleteOpen(false);

  // 컨테이너 목록
  const [owncards, setOwnCards] = useState([]);
  const [sharedcards, setSharedCards] = useState([]);

  // 정렬, 검색
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOwnCards, setFilteredOwnCards] = useState(owncards);
  const [filteredSharedCards, setFilteredSharedCards] = useState(sharedcards);

  console.log(filteredOwnCards);
  useEffect(() => {
    // 페이지 로드시 모든 컨테이너 정보 불러오기
    const containerSearchApi = async () => {
      try {
        let res = await auth.containerSearch();

        if (res.status == 200) {
          setOwnCards(res.data.ownContainers); // owncards에 소유 컨테이너 목록 배열 적용
          setSharedCards(res.data.shareContainers); // sharedcards에 공유 컨테이너 목록 배열 적용
          console.log(res.data.ownContainers);
          console.log(res.data.shareContainers);
        }
      } catch (error) {}
    };

    containerSearchApi();
  }, []);

  // 컨테이너 목록(cards)이 변경될 때마다 목록을 필터링
  useEffect(() => {
    searchAndSortCards();
  }, [owncards, sharedcards]);

  // 검색과 정렬을 실행(데이터 없으면 공백 출력)
  const searchAndSortCards = () => {
    // 소유 컨테이너
    const filtered = owncards
      ? owncards
          .filter((card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            switch (sortOrder) {
              case "ascending":
                return a.name.localeCompare(b.name);
              case "descending":
                return b.name.localeCompare(a.name);
              case "timeAscending":
                return new Date(a.createdTime) - new Date(b.createdTime);
              case "timeDescending":
                return new Date(b.createdTime) - new Date(a.createdTime);
              default:
                return 0;
            }
          })
      : [];
    setFilteredOwnCards(filtered);

    // 공유 컨테이너
    const filtered2 = sharedcards
      ? sharedcards
          .filter((card) =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            switch (sortOrder) {
              case "ascending":
                return a.name.localeCompare(b.name);
              case "descending":
                return b.name.localeCompare(a.name);
              case "timeAscending":
                return new Date(a.createdTime) - new Date(b.createdTime);
              case "timeDescending":
                return new Date(b.createdTime) - new Date(a.createdTime);
              default:
                return 0;
            }
          })
      : [];
    setFilteredSharedCards(filtered2);
  };

  // 정렬 순서 변경 시 자동으로 적용
  useEffect(() => {
    searchAndSortCards();
  }, [sortOrder]);

  // 검색어 입력 시 엔터 키를 감지하여 검색 실행
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchAndSortCards();
    }
  };

  // 컨테이너 제목, 내용이 길면 '...'남기고 잘라내기
  const cutString = (str, num) => {
    return str.length > num ? str.slice(0, num) + "..." : str;
  };

  const addOwner = (res) => {
    setOwnCards((prev) => [...prev, res]);
  };

  //----------------------------------------------------------------태균 작업
  const [selectedContainerId, setSelectedContainerId] = useState(null);

  const handleOpenDeleteModal = (owncards) => {
    setSelectedContainerId(owncards);
    console.log(selectedContainerId);
    openDeleteModal(); // 모달을 여는 함수
  };

  const handleOpenEditModal = (owncards) => {
    setSelectedContainerId(owncards);
    console.log(selectedContainerId);
    openEditModal(); // 모달을 여는 함수
  };

  const handleOpenShareModal = (owncards) => {
    setSelectedContainerId(owncards);
    console.log(selectedContainerId);
    openShareModal(); // 모달을 여는 함수
  };

  //----------------------------------------------------------------
  return (
    <div className="contents">
      <div className="contents-header">
        {/* 회원이름/컨테이너 분류 표시 */}
        <div className="usercon-display">
          <p className="userNickname">{nickname}</p>
          <p>님 / 컨테이너 리스트</p>
        </div>

        {/* 컨테이너 분류 표시 */}
        <div className="con-display">
          <p>컨테이너 리스트</p>
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
            />
            <img
              src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png"
              alt="돋보기"
            />
          </div>

          <div className="own-shared-containers">
            <div className="own-containers">
              <p>보유한 컨테이너</p>
            </div>
            <div className="shared-containers">
              <p>공유된 컨테이너</p>
            </div>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="ascending">이름 오름차순</option>
            <option value="descending">이름 내림차순</option>
            <option value="timeAscending">날짜 오름차순</option>
            <option value="timeDescending">날짜 내림차순</option>
          </select>
        </div>
      </div>

      <h1>내 컨테이너</h1>
      {/* 컨테이너 목록 */}
      <div className="container-cards">
        {/* 컨테이너 추가 버튼 */}
        <div onClick={openModal}>+</div>

        {filteredOwnCards.map(
          (item, owncards) => (
            console.log(item, owncards),
            (
              <div className="concards" key={owncards}>
                <div className="conname-line">
                  <div className="conname">
                    {item && item.name && cutString(item.name, 20)}
                  </div>
                  <div className="esd-icons">
                    <img
                      src={edteIcon}
                      alt="edit"
                      onClick={() => handleOpenEditModal(item)}
                    />
                    <img
                      src={shareIcon}
                      alt="share"
                      onClick={() => handleOpenShareModal(item)}
                    />
                    <img
                      src={deleteIcon}
                      alt="delete"
                      onClick={() => handleOpenDeleteModal(item)}
                    />
                  </div>
                </div>
                <div className="typeline">
                  <div className="idelang">{item && item.type}</div>
                  <div className="createdTime">
                    생성:{" "}
                    {item && item.createdTime && item.createdTime.split("T")[0]}
                  </div>
                </div>
                <div className="nicknameline">
                  <div className="editUserUuid">
                    {item && item.editUserNickname}
                  </div>
                  <div className="lastModifiedTime">
                    수정:{" "}
                    {item &&
                      item.lastModifiedTime &&
                      item.lastModifiedTime.split("T")[0]}
                  </div>
                </div>
                <div className="condesc">
                  {item && item.description && cutString(item.description, 80)}
                </div>
                <div className="idestart">시작하기</div>
              </div>
            )
          )
        )}
      </div>

      <h1>공유된 컨테이너</h1>

      <div className="container-cards-2">
        {filteredSharedCards.map((item, sharedcards) => (
          <div className="concards" key={sharedcards}>
            <div className="conname-line">
              <div className="conname">
                {item && item.name && cutString(item.name, 20)}
              </div>
              <div className="esd-icons">
                <img src={edteIcon} alt="edit" />
              </div>
            </div>
            <div className="typeline">
              <div className="idelang">{item && item.type && item.type}</div>
              <div className="createdTime">
                생성:{" "}
                {item && item.createdTime && item.createdTime.split("T")[0]}
              </div>
            </div>
            <div className="nicknameline">
              <div className="editUserUuid">
                {item && item.editUserNickname && item.editUserNickname}
              </div>
              <div className="lastModifiedTime">
                수정:{" "}
                {item &&
                  item.lastModifiedTime &&
                  item.lastModifiedTime.split("T")[0]}
              </div>
            </div>
            <div className="condesc">
              {item && item.description && cutString(item.description, 80)}
            </div>
            <div className="idestart">시작하기</div>
          </div>
        ))}
      </div>

      <ContainerModal addOwner={addOwner} isOpen={isOpen} close={closeModal} />
      <ContainerEdit
        selectedContainerId={selectedContainerId}
        isOpen={isEditOpen}
        close={closeEditModal}
      />
      <ContainerShare
        selectedContainerId={selectedContainerId}
        isOpen={isShareOpen}
        close={closeShareModal}
      />
      <ContainerDelete
        selectedContainerId={selectedContainerId}
        isOpen={isDeleteOpen}
        close={closeDeleteModal}
      />
    </div>
  );
}

export default ContainerList;
