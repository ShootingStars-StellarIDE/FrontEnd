// import axios from "axios";
// import store from "../../ Store/store";
// import { setAccessToken } from "../../ Store/UserSlice"; // setAccessToken 액션 추가

// export function setupAxiosInterceptors() {
//   axios.interceptors.request.use(
//     (config) => {
//       const token = store.getState().user.accessToken;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   // 응답 인터셉터를 추가하여 401 응답(토큰 만료)을 처리합니다.
//   axios.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true; // 재시도 플래그를 설정하여 무한 루프 방지
//         try {
//           // `/api/auth/refresh` 엔드포인트로 POST 요청을 보내 새 accessToken을 받습니다.
//           const response = await axios.post(`/api/auth/refresh`);
//           const { accessToken } = response.data;

//           // 새로 받은 accessToken을 스토어에 저장합니다.
//           store.dispatch(setAccessToken(accessToken));

//           // 새로 받은 accessToken을 이 요청의 헤더에 설정합니다.
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//           // 수정된 요청을 다시 보냅니다.
//           return axios(originalRequest);
//         } catch (refreshError) {
//           return Promise.reject(refreshError);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );
// }
