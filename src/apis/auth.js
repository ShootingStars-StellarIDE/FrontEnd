import api from "./api";

//인증 메일 전송(사용)
export const authEmailCode = (email) =>
  api.post(`/api/verification/send-email`, { email });

//메일 인증 코드 확인(사용)
export const emailCodeCheck = (email, code) =>
  api.post(`/api/verification/email`, { email, code });

//이메일 중복 확인(사용)
export const emailCheck = (email) =>
  api.post(`/api/check-duplicate/email`, { email });

//닉네임 중복 확인(사용)
export const nickNameCheck = (nickname) =>
  api.post(`/api/check-duplicate/nickname`, { nickname });

//Access Token 재발급(사용)
export const authRefresh = () => {
  const token = localStorage.getItem("Authorization");
  return api.post(`/api/auth/refresh`, null, {
    headers: { Authorization: token },
  });
};

//회원가입(사용)
export const signup = (email, nickname, password) =>
  api.post("/api/auth/signup", { email, nickname, password });

//회원탈퇴(사용)
export const deleteUser = () => {
  const token = localStorage.getItem("Authorization");
  return api.delete(`/api/auth/delete/user`, {
    headers: { Authorization: token },
  });
};

//로그인
// export const login = (email, password) => api.post(`/api/auth/login`);

//로그아웃(사용)
export const logout = () => {
  const token = localStorage.getItem("Authorization");
  return api.delete(`/api/auth/logout`, { headers: { Authorization: token } });
};

//회원정보 조회
export const profile = () => {
  const token = localStorage.getItem("Authorization");
  return api.get(`/api/user/profile`, { headers: { Authorization: token } });
};

//비밀번호 변경(사용)
export const ChangePassword = (password, newPassword) => {
  const token = localStorage.getItem("Authorization");
  return api.patch(
    `/api/auth/changePassword`,
    { password, newPassword },
    { headers: { Authorization: token } }
  );
};

//프로필 사진 변경
export const ChangePic = () => api.patch(`/api/user/changeProfileImage`);

//회원정보 수정시 비밀번호 확인(사용)
export const checkPassword = (password) => {
  const token = localStorage.getItem("Authorization");
  return api.post(
    `./api/auth/checkPassword`,
    { password },
    { headers: { Authorization: token } }
  );
};

//컨테이너 리스트 조회
export const containerSearch = () => {
  const token = localStorage.getItem("Authorization");
  return api.get(`/api/container/search`, {
    headers: { Authorization: token },
  });
};

//컨테이너 생성
export const containerCreate = (
  containerType,
  containerName,
  containerDescription
) => {
  console.log(containerType);
  const token = localStorage.getItem("Authorization");
  return api.post(
    `/api/container/create`,
    { containerType, containerName, containerDescription },
    { headers: { Authorization: token } }
  );
};
//컨테이너 삭제
export const containerDelete = (containerId) => {
  const token = localStorage.getItem("Authorization");
  return api.delete(
    `/api/container/delete/${containerId}`,

    { headers: { Authorization: token } }
  );
};
//컨테이너 공유
export const containerShare = (containerId, userNickname) => {
  const token = localStorage.getItem("Authorization");
  return api.post(
    `/api/container/share`,
    { containerId, userNickname },
    {
      headers: { Authorization: token },
    }
  );
};
//컨테이너 수정
export const containerEdit = (containerId, containerDescription) => {
  const token = localStorage.getItem("Authorization");
  return api.patch(
    `/api/container/edit`,
    {
      containerId,
      containerDescription,
    },
    {
      headers: { Authorization: token },
    }
  );
};
