import { Metadata } from "next";
import Home from "./_components/Home";
import Loading from "@/app/loading/loading";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "PAi 홈페이지입니다.",
  keywords: ["chat", "assistant", "friend", "todo", "todolist", "diary", "투두", "다이어리"],
  openGraph: {
    title: "Home",
    description: "PAi 홈페이지입니다.",
    type: "website"
  }
};

const HomePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
};

export default HomePage;
