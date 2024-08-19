import { ChatTodoItem, RecommendItem } from "@/types/chat.session.type";

export function formatTodoItems(items: ChatTodoItem[]): string {
  return items
    .map((item) => {
      let formattedItem = `• ${item.title}`;
      if (item.description) formattedItem += ` : ${item.description}`;
      if (item.time && item.location) {
        formattedItem += ` (${item.time}, ${item.location})`;
      } else if (item.time) {
        formattedItem += ` (${item.time})`;
      } else if (item.location) {
        formattedItem += ` (${item.location})`;
      }

      return formattedItem.trim();
    })
    .join("\n");
}

export function formatRecommendItems(items: RecommendItem[]): string {
  return items.map((item) => `• ${item.title} : ${item.description}`).join("\n");
}
