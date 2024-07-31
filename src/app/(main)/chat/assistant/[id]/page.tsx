import { AIType } from "@/types/chat.session.type";
import AssistantChat from "../../_components/AssistantChat";

interface AssistantChatPageProps {
  params: {
    id: string;
  };
}

const AssistantChatPage = ({ params }: AssistantChatPageProps) => {
  const { id: sessionId } = params;

  return (
    <div>
      <AssistantChat sessionId={sessionId} />
    </div>
  );
};

export default AssistantChatPage;
