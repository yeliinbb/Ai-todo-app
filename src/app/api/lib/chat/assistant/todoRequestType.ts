// todoRequestType.ts
import { ChatTodoMode } from "@/app/(main)/chat/_components/AssistantChat";
import { isTodoCreate, isTodoUpdate, isTodoDelete, isTodoRecommend } from "./todoPatterns";

export type TodoRequestType = "reset" | "add" | "create" | "update" | "delete" | "recommend" | "none";

export const getTodoRequestType = (
  message: string,
  todoMode: ChatTodoMode,
  currentTodoList: string[]
): TodoRequestType => {
  if (todoMode === "resetTodo") return "reset";
  if (isTodoCreate(message)) return "create";
  if (isTodoUpdate(message)) return "update";
  if (isTodoDelete(message)) return "delete";
  if (isTodoRecommend(message)) return "recommend";

  if (todoMode === "createTodo") {
    return currentTodoList.length === 0 ? "create" : "add";
  }
  if (todoMode === "recommendTodo") return "recommend";

  console.log("Returning 'none' for todoRequestType");
  return "none";
};
