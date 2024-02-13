import "../styles/SignUp.css";
import SignupForm from "../components/Signup/SignupForm";
import * as auth from "../apis/auth";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();

  //회원가입 요청
  const join = async (form) => {
    console.log(form);
    let response;
    let data;

    try {
      console.log(data);
      console.log(response);
      console.log(form.email);
      response = await auth.signup(form.email, form.nickname, form.password);
    } catch (error) {
      console.log(`${error}`);
      console.log("회원가입 요청 중 에러가 발생하였습니다.");
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`회원가입 성공!`);
      navigate("/");
    } else {
      console.log(`회원 가입 실패!~`);
    }
  };
  //----------------------------------------------------------------
  //이메일 중복 확인
  const emailCheck = async (email) => {
    console.log(email);
    let response;
    let data;
    try {
      response = await auth.emailCheck(email);
    } catch (error) {
      console.log(`${error}`);
      console.log("이메일 인증 문제");
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`메일 인증 성공!`);
    } else {
      console.log(`메일 인증 실패!`);
    }

    return response;
  };

  //이메일 인증
  const sendEmailAuthRequest = async (email) => {
    console.log(email);
    let response;
    let data;
    try {
      response = await auth.authEmailCode(email);
    } catch (error) {
      console.log(`${error}`);
      console.log("유효하지 않은 이메일입니다.");
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`메일 보내기 성공!`);
    } else {
      console.log(`메일 보내기 실패!`);
    }
    return response;
  };

  //----------------------------------------------------------------

  //코드 인증
  const CodeCheck = async (email, code) => {
    console.log(email, code);
    let response;
    let data;
    try {
      response = await auth.emailCodeCheck(email, code);
    } catch (error) {
      console.log(`${error}`);
      console.log("유효하지 않은 코드입니다.");
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`인증에 성공하였습니다`);
    } else {
      console.log(`인증에 실패하였습니다`);
    }
    return response;
  };

  //----------------------------------------------------------------

  //닉네임 중복 검사 인증
  const nickNameCheck = async (nickname) => {
    console.log(nickname);
    let response;
    let data;
    try {
      response = await auth.nickNameCheck(nickname);
    } catch (error) {
      console.log(`${error}`);
      console.log("사용중인 닉네임입니다.");
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`사용가능한 닉네임입니다.`);
    } else {
      console.log(`사용중인 닉네임입니다.`);
    }
    return response;
  };

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
