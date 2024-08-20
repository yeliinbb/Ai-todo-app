"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const DiaryEditDetail = dynamic(() => import("@/app/(main)/diary/_components/DiaryEditDetail"), { ssr: false });

const WriteDiaryPage = () => {
  const [pageData, setPageData] = useState(null);
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setPageData(parsedData);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [data]);
  if (!pageData) {
    return (
      <span className="pai-loader w-full h-screen flex flex-col items-center text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
    </span>
    );
  }
  return <DiaryEditDetail pageData={pageData} />;
};

export default WriteDiaryPage;
