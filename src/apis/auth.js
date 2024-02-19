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

//Access Token 재발급
export const authRefresh = () => {
  const token = localStorage.getItem("Authorization");
  return api.post(`/api/auth/refresh`, null, {
    headers: { Authorization: token },
  });
};

//회원가입(사용)
export const signup = (email, nickname, password) =>
  api.post("/api/auth/signup", { email, nickname, password });

//회원탈퇴
export const deleteUser = () => api.delete(`/api/auth/delete/user`);

//로그인
export const login = (email, password) => api.post(`/api/auth/login`);

//로그아웃
export const logout = () => api.post(`/api/auth/logout`);

//회원정보 조회
export const profile = () => api.get(`/api/user/profile`);

//비밀번호 변경
export const ChangePassword = (password, newPassword) => {
  const token = localStorage.getItem("Authorization");
  return api.patch(`/api/auth/changePassword`, {password, newPassword}, {headers: {Authorization: token}});
}

//프로필 사진 변경
export const ChangePic = () =>
  api.put(`/api/user/change-profile-image`);

//회원정보 수정시 비밀번호 확인
export const checkPassword = ( password ) => {
  const token = localStorage.getItem("Authorization");
  return api.post(`./api/auth/checkPassword`, {password}, {headers: {Authorization: token}});
}