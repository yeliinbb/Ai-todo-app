import Image from "next/image";
import React from "react";

const SaveDiaryLoading = () => {
  return (
    <div className="w-full h-screen relative">
      <div className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <div>
          <Image src="/saveDiary.gif" alt="saveDiaryGIF" width={150} height={150} />
        </div>
        <p className="text-h4 text-fai-500 h-7 font-bold text-center mt-3">일기 작성중...</p>
      </div>
    </div>
  );
};

export default SaveDiaryLoading;
