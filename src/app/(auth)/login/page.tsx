import { Metadata } from "next";
import Login from "../_components/Login";

export const metadata: Metadata = {
  title: "Login",
  description: "로그인 페이지"
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
