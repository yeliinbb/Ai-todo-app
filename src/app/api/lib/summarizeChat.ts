import openai from "@/lib/utils/openaiClient";
import { Message } from "@/types/chat.session.type";

export const summarizeChat = async (messages: Message[]): Promise<string> => {
  if (!messages || messages.length === 0) {
    return "새로운 대화";
  }
  try {
    const chatContent = messages.map((message) => `${message.content}`).join("\n");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "당신은 사용자의 투두리스트 내용을 간결하게 요약하는 도우미입니다. " +
            "대화 내용 중 사용자가 실제로 작성한 투두리스트 항목들에만 집중하세요. " +
            "PAi의 설명이나 안내 과정은 무시하고, 오직 사용자가 언급한 실제 할 일 목록만 요약하세요. " +
            "투두리스트가 없다면 대화의 주요 주제를 간단히 요약하세요. " +
            "20-30자 내외로 핵심 내용만 간결하게 작성하세요. " +
            "요약된 내용에 투두리스트라는 단어는 제외해주세요" +
            "항상 한국어로 요약을 작성하세요."
        },
        {
          role: "user",
          content: `다음 대화에서 사용자가 실제로 작성한 투두리스트 항목들만 요약해주세요. 맨 앞에 '투두리스트'는 붙이지 마세요. 투두리스트가 없다면 대화의 주요 내용을 간단히 요약해주세요: "${chatContent}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const summary = response.choices[0].message.content?.trim();
    return summary || "새로운 대화";
  } catch (error) {
    console.error("Error summarizing chat :", error);
    return "새로운 대화";
  }
};
