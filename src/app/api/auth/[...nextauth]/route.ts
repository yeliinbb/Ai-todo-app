import NextAuth from "next-auth/next";
import NaverProvider from "next-auth/providers/naver";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!
    })
  ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
