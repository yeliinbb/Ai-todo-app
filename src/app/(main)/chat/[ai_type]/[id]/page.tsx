import { AIType } from "@/types/chat.session.type";
import AssistantChat from "../../_components/AssistantChat";
import FriendChat from "../../_components/FriendChat";

interface ChatPageProps {
  params: {
    id: string;
    ai_type: AIType;
  };
}

const ChatPage = ({ params }: ChatPageProps) => {
  const { id: sessionId, ai_type } = params;
  // console.log("params", params);

  return (
    <>
      {ai_type === "assistant" ? (
        <AssistantChat sessionId={sessionId} aiType={ai_type} />
      ) : (
        <FriendChat sessionId={sessionId} aiType={ai_type} />
      )}
    </>
  );
};

export default ChatPage;
