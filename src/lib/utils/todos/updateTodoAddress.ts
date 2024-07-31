import { UpdateTOdoAddressType } from "@/types/diary.type";
import { supabase } from "../../../utils/supabase/client";

export const updateTodoAddress = async ({ todoId, lat, lng }: UpdateTOdoAddressType): Promise<void> => {
  const { data, error } = await supabase.from("todos").update({ address: { lat, lng } }).eq("todo_id", todoId);

  if (error) {
    console.error("Error updating todo:", error);
  } else {
    console.log("Todo updated successfully:", data);
  }
};
