import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const DiaryTextEditor = dynamic(() => import("../_components/DiaryTextEditor"), { 
  ssr: false,
  loading: () => <p>Loading...</p>
});

const WriteDiaryPage = () => {
  return (
    <div className="mx-auto">
      <DiaryTextEditor />
    </div>
  );
};

export default WriteDiaryPage;
