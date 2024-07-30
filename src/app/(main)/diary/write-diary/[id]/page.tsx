"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
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
        const decodedData = decodeURIComponent(data);
        const parsedData = JSON.parse(decodedData);
        setPageData(parsedData);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, [data]);

  if (!data) {
    notFound();
  }

  if (!pageData) {
    return <div>Loading...</div>;
  }
  return <DiaryEditDetail pageData={pageData} />;
};

export default WriteDiaryPage;
