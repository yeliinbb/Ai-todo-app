import SessionBtn from "./_components/SessionBtn";

const ChatPage = () => {
  return (
    <div className="gradient-container w-full h-full rounded-t-[100px]">
      <div className="gradient-rotated gradient-ellipse w-full h-[90%]"></div>
      <div className="relative z-10 w-full h-full">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span>어떤 파이와 이야기해 볼까요?</span>
          <div className="flex flex-col">
            <SessionBtn aiType="assistant" />
            <SessionBtn aiType="friend" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
