import { Metadata } from "next";
import Home from "./_components/Home";

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
  return <Home />;
};

export default HomePage;
