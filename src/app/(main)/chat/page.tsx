import SessionBtn from "./_components/SessionBtn";
import SessionsChat from "./_components/SessionsChat";

const ChatPage = () => {
  return (
    <div>
      <h1>Chat Sessions</h1>
      <div className="flex flex-col">
        <SessionBtn aiType="assistant" />
        <SessionBtn aiType="friend" />
      </div>
      <SessionsChat aiType="assistant" />
      <SessionsChat aiType="friend" />
    </div>
  );
};

export default ChatPage;
