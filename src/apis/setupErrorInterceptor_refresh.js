import axios from "axios";
import * as auth from "./auth";

export const setupErrorInterceptor_refresh = () => {
  const errorCodes = ["0103"];

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && errorCodes.includes(error.response.data.code)) {
        try {
          const res = await auth.authRefresh();

          if (res.status === 200) {
            const authHeader =
              res.headers["Authorization"] || res.headers["authorization"];
            if (authHeader.startsWith("Bearer")) {
              const accessToken = authHeader;
              localStorage.setItem("Authorization", accessToken);
              error.config.headers["Authorization"] = accessToken;
              return axios(error.config);
            }
          }
        } catch (refreshError) {
          console.log(refreshError);
          {
            if (refreshError.response.data.code == "0101") {
              // 잘못된 접근입니다.
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //인증에 실패하였습니다.
            else if (refreshError.response.data.code == "0100") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //잘못된 Access Token 입니다.
            else if (refreshError.response.data.code == "0102") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            // 지원하지 않는 Access Token 입니다.
            else if (refreshError.response.data.code == "0104") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //Claim이 빈 Access Token 입니다.
            else if (refreshError.response.data.code == "0105") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //잘못된 Refresh Token 입니다.
            else if (refreshError.response.data.code == "0106") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //만료된 Refresh Token 입니다.
            else if (refreshError.response.data.code == "0107") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //지원하지 않는 Refresh Token 입니다.
            else if (refreshError.response.data.code == "0108") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }

            //Claim이 빈 RefreshToken 입니다.
            else if (refreshError.response.data.code == "0109") {
              console.error(refreshError.response.data.description);
              window.location = "/";
              localStorage.removeItem("Authorization");
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

setupErrorInterceptor_refresh();
