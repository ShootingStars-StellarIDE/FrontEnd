import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/login`, userCredentials);

      if (response.status == 200) {
        // 응답 헤더에서 accessToken을 추출하고, 'Bearer ' 접두어를 제거합니다.
        const authHeader =
          response.headers["Authorization"] ||
          response.headers["authorization"];
        if (authHeader.startsWith("Bearer")) {
          // 'Bearer ' 접두어를 제거하고 accessToken만 추출합니다.
          
          // 로컬 스토리지에 accessToken 저장
          localStorage.setItem("Authorization", authHeader);
          return { authHeader };
        }
      }
    } catch (error) {
      if (error.response.data) {
        switch (error.response.data.code) {
          case 1001:
            console.error(error.response.data.description);
            break;
          case 1004:
            console.error(error.response.data.description);
            break;
          case 1103:
            console.error(error.response.data.description);
            break;
          default:
            console.error(error.response.data.description);
        }
      }
      // rejectWithValue를 사용하여 오류 처리
      return rejectWithValue(error.response.data.description);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: { accessToken: null },
    error: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.user.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.user.accessToken = action.payload; // accessToken을 상태에 저장합니다.
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { setAccessToken } = userSlice.actions;

export default userSlice.reducer;
