import SessionBtn from "./_components/SessionBtn";

const ChatPage = () => {
  return (
    <div>
      <h1>Chat Sessions</h1>
      <div className="flex flex-col">
        <SessionBtn aiType="assistant" />
        <SessionBtn aiType="friend" />
      </div>
    </div>
  );
};

export default ChatPage;
