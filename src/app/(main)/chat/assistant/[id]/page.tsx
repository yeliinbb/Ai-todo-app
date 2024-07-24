import { AIType } from "@/types/chat.session.type";
import AssistantChat from "../../_components/AssistantChat";

interface AssistantChatPageProps {
  params: {
    ai_type: AIType;
    id: string;
  };
}

const AssistantChatPage = ({ params }: AssistantChatPageProps) => {
  const { ai_type, id: sessionId } = params;

  return (
    <div>
      <h1>AssistantChatPage</h1>
      <AssistantChat sessionId={sessionId} aiType={ai_type} />
    </div>
  );
};

export default AssistantChatPage;
