import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/login`, userCredentials);
      // API 응답에서 데이터 추출
      const data = response.data;

      console.log(response);
      // 응답 헤더에서 accessToken을 추출하고, 'Bearer ' 접두어를 제거합니다.
      const authHeader =
        response.headers["Authorization"] || response.headers["authorization"];
      console.log(response.headers);
      if (authHeader && authHeader.startsWith("Bearer")) {
        // 'Bearer ' 접두어를 제거하고 accessToken만 추출합니다.
        const accessToken = authHeader.split(" ")[1];
        // 로컬 스토리지에 accessToken 저장
        localStorage.setItem("Authorization", accessToken);
        console.log(authHeader);
        // Redux 스토어에는 accessToken만 저장됩니다.
        return { accessToken };
      }
      // 'Bearer' 접두어가 없으면 오류 처리를 할 수 있습니다.
      throw new Error("Authorization header format is incorrect");
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentState = getState();
      const refreshToken = currentState.user.refreshToken; // 현재 refreshToken 가져오기
      const response = await axios.post(`/api/auth/refresh`, { refreshToken });
      const data = response.data;
      return data.accessToken; // 새로운 accessToken 반환
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      // refreshToken 액션을 처리할 필요가 없으므로, 해당 부분은 제거합니다.
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.accessToken = action.payload.accessToken; // accessToken을 상태에 저장합니다.
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || "로그인 실패";
      });
  },
});

export const { setAccessToken } = userSlice.actions;

export default userSlice.reducer;
