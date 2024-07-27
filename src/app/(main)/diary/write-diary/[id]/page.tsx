import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

interface WriteDiaryPageProps {
  searchParams: {
    data?: string;
  };
}
const DiaryEditDetail = dynamic(() => import("../../_components/DiaryEditDetail"), { ssr: false });
const WriteDiaryPage = ({ searchParams }: WriteDiaryPageProps) => {
  const { data } = searchParams;

  if (!data) {
    notFound();
  }

  try {
    const decodedData = decodeURIComponent(data);
    const parsedData = JSON.parse(decodedData);

    return <DiaryEditDetail pageData={parsedData} />;
  } catch (error) {
    console.error("Error parsing data:", error);
    return <div>페이지를 찾을 수 없습니다.</div>;
  }
};

export default WriteDiaryPage;

export async function generateStaticParams() {
  return [{ data: encodeURIComponent(JSON.stringify({})) }];
}
