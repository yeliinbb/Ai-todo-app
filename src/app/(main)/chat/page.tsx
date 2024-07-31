import { AIType } from "@/types/chat.session.type";
import SessionBtn from "./_components/SessionBtn";

const aiTypes: AIType[] = ["assistant", "friend"];

const ChatPage = () => {
  // TODO : 여기서 리스트 불러오면 prefetch 사용해서 렌더링 줄이기
  return (
    <div className="gradient-container w-full h-full rounded-t-[100px]">
      <div className="gradient-rotated gradient-ellipse w-full h-[90%]"></div>
      <div className="relative z-10 w-full h-full">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-gray-600 font-medium text-lg">어떤 파이와 이야기해 볼까요?</span>
          <div className="flex flex-col p-4 gap-6">
            {aiTypes.map((aiType) => (
              <SessionBtn key={aiType} aiType={aiType} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
