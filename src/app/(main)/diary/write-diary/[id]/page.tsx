
import { notFound } from "next/navigation";
import DiaryEditDetail from "../../_components/DiaryEditDetail";
import { parse } from "path";

interface WriteDiaryPageProps {
  searchParams: {
    data?: string;
  };
}
const WriteDiaryPage = async ({ searchParams }: WriteDiaryPageProps) => {
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
    notFound();
  }
};

export default WriteDiaryPage;
