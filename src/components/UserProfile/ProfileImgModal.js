import React, { useState, useEffect } from "react";
import "../../styles/ProfileImgModal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfileImgModal({ isOpen, close, profileimgurl }) {
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(profileimgurl);
  const [previewUserImg, setPreviewUserImg] = useState(null);
  const [newFile, setNewFile] = useState(null);

  // 파일 크기 제한 (예: 5MB)
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const baseurl = process.env.REACT_APP_API_PROXY;
  const token = localStorage.getItem("Authorization");

  useEffect(() => {
    if (profileimgurl) {
      setProfileImg(profileimgurl);
      setPreviewUserImg(null);
    }
  }, [profileimgurl]);

  if (!isOpen) return null;

  // 이미지 제출요청
  const changeUserImgApi = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    // const file = e.target.files[0]; // 선택된 파일 접근
    if (!newFile) return; // 파일이 없으면 함수 종료

    const formData = new FormData();
    formData.append("profileImgFile", newFile); // 'image'는 서버에서 요구하는 필드명과 일치해야 함
    try {
      const response = await axios.patch(
        baseurl + "api/user/changeProfileImage",
        formData,
        {
          headers: { Authorization: token },
        }
      );
      if (response.status == 200) {
        close();
        navigate("/dashboard/profile");
      }
      return response;
    } catch (error) {
      alert(error.response.data.description);
      if (error.response.data.code === "0100") {
        // 인증에 실패하였습니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0101") {
        // 잘못된 접근입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0102") {
        // 잘못된 Access Token 입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0103") {
        // 만료된 Access Token 입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0104") {
        // 지원하지 않는 Access Token 입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0105") {
        // Claim이 빈 Access Token 입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "1201") {
        // 존재하지 않는 사용자입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "1202") {
        // 빈 프로필 이미지 파일입니다.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "1305") {
        // 지원하지 않는 이미지 타입입니다. PNG 파일을 사용해주세요.
        console.error(error.response.data.description);
      } else if (error.response.data.code === "0003") {
        // 저장소 연결에 실패하였습니다.
        console.error(error.response.data.description);
      }
    }
  };

  // 이미지 미리보기
  const setPreviewImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // 파일 크기 검사
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("5MB보다 작은 이미지만 업로드할 수 있습니다.");
        setFile(null); // 현재 선택된 파일 상태 초기화
      } else {
        setError("");
        setFile(selectedFile);

        var reader = new FileReader();

        reader.onload = function (event) {
          setPreviewUserImg(event.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
        setNewFile(event.target.files[0]);
      }
    }
  };

  return (
    <form
      className="profileImg-Form"
      onSubmit={(e) => changeUserImgApi(e)}
      // 엔터 키를 눌렀을 때 폼의 자동 제출 방지
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <div className="modal-backdrop">
        <div className="modal">
          <h3>프로필 사진 변경</h3>
          <div className="profile-image-placeholder">
            {(profileImg || previewUserImg) && (
              <img
                className="userimg"
                alt="userimg"
                src={
                  previewUserImg
                    ? previewUserImg
                    : profileImg + "?cache=" + Math.random()
                }
              />
            )}
          </div>

          {/* 이미지 업로드 */}
          <input
            type="file"
            id="image"
            accept="image/png"
            className="imgsubmit"
            onChange={setPreviewImg}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="buttons">
            <button type="submit" disabled={!file}>
              프로필 사진 변경
            </button>
            <button onClick={close}>닫기</button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default ProfileImgModal;
