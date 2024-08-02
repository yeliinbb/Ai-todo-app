import React from "react";
import SignUp from "../_components/SignUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "회원가입 페이지"
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
