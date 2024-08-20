import dynamic from "next/dynamic";
const DiaryTextEditor = dynamic(() => import("../_components/DiaryTextEditor"), {
  ssr: false,
  loading: () => (
    <span className="pai-loader w-full h-screen flex flex-col items-center text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
    </span>
  )
});

const WriteDiaryPage = () => {
  return (
    <div className="mx-auto">
      <DiaryTextEditor />
    </div>
  );
};

export default WriteDiaryPage;
