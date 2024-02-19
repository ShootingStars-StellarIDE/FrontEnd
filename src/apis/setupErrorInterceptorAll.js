import axios from "axios";

export const setupErrorInterceptorAll = () => {
  const errorCodes = [
    "0100",
    "0101",
    "0102",
    "0104",
    "0105",
    "0106",
    "0107",
    "0108",
    "0109",
  ];

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && errorCodes.includes(error.response.data.code)) {
        if (error.response.data.code == "0101") {
          // 잘못된 접근입니다.
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //인증에 실패하였습니다.
        else if (error.response.data.code == "0100") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //잘못된 Access Token 입니다.
        else if (error.response.data.code == "0102") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        // 지원하지 않는 Access Token 입니다.
        else if (error.response.data.code == "0104") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //Claim이 빈 Access Token 입니다.
        else if (error.response.data.code == "0105") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //잘못된 Refresh Token 입니다.
        else if (error.response.data.code == "0106") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //만료된 Refresh Token 입니다.
        else if (error.response.data.code == "0107") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //지원하지 않는 Refresh Token 입니다.
        else if (error.response.data.code == "0108") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }

        //Claim이 빈 RefreshToken 입니다.
        else if (error.response.data.code == "0109") {
          console.error(error.response.data.description);
          window.location = "/";
          localStorage.removeItem("Authorization");
        }
      }
      return Promise.reject(error);
    }
  );
};

setupErrorInterceptorAll();
