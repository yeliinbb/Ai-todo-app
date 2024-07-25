'use client'
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DiaryEditDetail from "../../_components/DiaryEditDetail";

const WriteDiaryPage = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    if (data) {
      try {
        const decodedData = decodeURIComponent(data);
        const parsedData = JSON.parse(decodedData);
        setPageData(parsedData);
      } catch (e) {
        console.error("Error parsing data:", e);
      }
    }
  }, [data]);

  if (!pageData) {
    return <div>로딩중...</div>;
  }

  return <DiaryEditDetail pageData={pageData} />;
};

export default WriteDiaryPage;
