import openai from "@/lib/utils/chat/openaiClient";
import { AIType, Message } from "@/types/chat.session.type";

export const summarizeChat = async (messages: Message[], aiType: AIType): Promise<string | null> => {
  // system 메시지를 제외한 메시지만 필터링
  const filteredMessages = messages.filter((message) => message.role !== "system");

  if (!filteredMessages || filteredMessages.length === 0) {
    return null;
  }
  try {
    const chatContent = filteredMessages.map((message) => `${message.content}`).join("\n");
    let systemMessage = "";
    let userMessage = "";

    if (aiType === "assistant") {
      systemMessage =
        "당신은 사용자의 투두리스트 내용을 간결하게 요약하는 도우미입니다. " +
        "대화 내용 중 사용자가 실제로 작성한 투두리스트 항목들에만 집중하세요. " +
        "PAi의 설명이나 안내 과정은 무시하고, 오직 사용자가 언급한 실제 할 일 목록만 요약하세요. " +
        "투두리스트가 없다면 대화의 주요 주제를 간단히 요약하세요. " +
        "20-30자 내외로 핵심 내용만 간결하게 작성하세요. " +
        "요약된 내용에 투두리스트라는 단어는 제외해주세요. " +
        "항상 한국어로 요약을 작성하세요.";

      userMessage = `다음 대화에서 사용자가 실제로 작성한 투두리스트 항목들만 요약해주세요. 맨 앞에 '투두리스트'는 붙이지 마세요. 투두리스트가 없다면 대화의 주요 내용을 간단히 요약해주세요: "${chatContent}"`;
    } else if (aiType === "friend") {
      systemMessage =
        "당신은 사용자의 일기 내용을 간결하게 요약하는 도우미입니다. " +
        "대화 내용 중 사용자의 감정, 주요 사건, 생각 등에 집중하세요. " +
        "FAi의 응답이나 안내는 무시하고, 오직 사용자가 언급한 실제 일기 내용만 요약하세요. " +
        "일기 내용이 없다면 대화의 주요 주제를 간단히 요약하세요. " +
        "20-30자 내외로 핵심 내용만 간결하게 작성하세요. " +
        "요약된 내용에 일기라는 단어는 제외해주세요. " +
        "항상 한국어로 요약을 작성하세요.";

      userMessage = `다음 대화에서 사용자가 실제로 작성한 일기 내용만 요약해주세요. 맨 앞에 '일기'는 붙이지 마세요. 일기 내용이 없다면 대화의 주요 내용을 간단히 요약해주세요: "${chatContent}"`;
    } else {
      return null;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const summary = response.choices[0].message.content?.trim();
    return summary || null;
  } catch (error) {
    console.error("Error summarizing chat :", error);
    return null;
  }
};
