import NextAuth from "next-auth/next";
import NaverProvider from "next-auth/providers/naver";

export const authOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!
    })
  ]
};

export default NextAuth(authOptions);
