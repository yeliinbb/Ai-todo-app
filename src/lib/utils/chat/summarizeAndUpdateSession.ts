import { AIType, MessageWithButton } from "@/types/chat.session.type";

export const summarizeAndUpdateSession = async (sessionId: string, messages: MessageWithButton[], aiType: AIType) => {
  if (!sessionId || messages.length === 0) return;
  try {
    const response = await fetch("/api/summarize-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, messages, aiType })
    });
    if (!response.ok) {
      throw new Error("Failed to summarize and update session.");
    }
    const data = await response.json();
    // console.log("Session summarized : ", data);
    return data;
  } catch (error) {
    console.error("Error summarizing session :", error);
    throw error;
  }
};
