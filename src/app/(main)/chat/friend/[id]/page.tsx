import { AIType } from "@/types/chat.session.type";
import FriendChat from "../../_components/FriendChat";

interface FriendChatPageProps {
  params: {
    ai_type: AIType;
    id: string;
  };
}

const FriendChatPage = ({ params }: FriendChatPageProps) => {
  const { id: sessionId } = params;

  return (
    <div>
      <h1>FriendChatPage</h1>
      <FriendChat sessionId={sessionId} />
    </div>
  );
};

export default FriendChatPage;
