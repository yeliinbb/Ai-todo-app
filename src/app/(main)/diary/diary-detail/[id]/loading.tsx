"use client";
import SaveDiaryLoading from "../../_components/SaveDiaryLoading";
import { useSearchParams } from "next/navigation";

const Loading = () => {
  const searchParams = useSearchParams();
  const isWriteDiaryPage = searchParams.get("from");
  return <>{isWriteDiaryPage === "diary-home" ? <span className="pai-loader"></span> : <SaveDiaryLoading />}</>;
};

export default Loading;
