import "../styles/SignUp.css";
import SignupForm from "../components/Signup/SignupForm";
import * as auth from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Loading from "../components/Loading";

function SignUpPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  let isFirstLoading = useRef(true);

  //회원가입 요청
  const join = async (form) => {
    if (isFirstLoading.current) {
      setIsLoading(true); // 데이터 불러오기 시작
    }
    let response;

    response = await auth.signup(form.email, form.nickname, form.password);

    const status = response.status;

    try {
      if (status === 200) {
        if (isFirstLoading) {
          setIsLoading(false); // 데이터 불러오기 완료
          isFirstLoading.current = false;
        }
        navigate("/");
      }
    } catch (error) {
      // 잘못된 형식의 이메일입니다.
      if (error.response.data.code === 1001) {
        console.error(error.response.data.description);
      }
      //잘못된 형식의 인증코드입니다.
      else if (error.response.data.code === 1002) {
        console.error(error.response.data.description);
      }
      //잘못된 키 혹은 잘못(만료) 된 인증 코드입니다.
      else if (error.response.data.code === 1101) {
        console.error(error.response.data.description);
      }
    } finally {
      if (isFirstLoading) {
        setIsLoading(false); // 데이터 불러오기 완료
        isFirstLoading.current = false;
      }
    }
  };

  //----------------------------------------------------------------
  //이메일 중복 확인

  const emailCheck = async (email) => {
    let response;
    response = await auth.emailCheck(email);
    return response;
  };

  //이메일 인증
  const sendEmailAuthRequest = async (email) => {
    let response;
    response = await auth.authEmailCode(email);
    return response;
  };

  //----------------------------------------------------------------
  //코드 인증
  const CodeCheck = async (email, code) => {
    let response;
    response = await auth.emailCodeCheck(email, code);
    return response;
  };

  //----------------------------------------------------------------
  //닉네임 중복 검사 인증
  const nickNameCheck = async (nickname) => {
    let response;
    response = await auth.nickNameCheck(nickname);

    return response;
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <SignupForm
      join={join}
      sendEmailAuthRequest={sendEmailAuthRequest}
      emailCheck={emailCheck}
      CodeCheck={CodeCheck}
      nickNameCheck={nickNameCheck}
    />
  );
}

export default SignUpPage;
