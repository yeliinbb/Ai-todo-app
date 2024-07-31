import { UpdateTOdoAddressType } from "@/types/diary.type";
import { TODOS_TABLE } from "@/lib/constants/tableNames";
import { supabase } from "@/utils/supabase/client";

export const updateTodoAddress = async ({ todoId, lat, lng }: UpdateTOdoAddressType): Promise<void> => {
  try {
    const { data, error } = await supabase.from(TODOS_TABLE).update({ address: { lat, lng } }).eq("todo_id", todoId);

    if (error) {
      throw new Error(`Error updating todo: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`todo의 위치 업데이트 실패: ${error.message}`);
    }
    throw new Error(`todo의 위치 업데이트 진행 시 예상치 못한 Error 발생: ${error}`);
  }
};
