import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { DiaryContentType } from "@/types/diary.type";
import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { targetDiary, targetDiaryContentId } = await request.json();
  const supabase = createClient();

  try {

    const { data, error: fetchError } = await supabase
      .from(DIARY_TABLE)
      .select("content")
      .eq("diary_id", targetDiary)
      .single();

    if (fetchError) {
      console.error("Error fetching diary:", fetchError);
      return NextResponse.json({ error: "Error fetching diary" }, { status: 500 });
    }

    if (data?.content && Array.isArray(data.content)) {
      const contentArray = data.content as DiaryContentType[];
      const updatedContent = contentArray.filter((entry) => entry.diary_id !== targetDiaryContentId);

      if (updatedContent.length === 0) {
        const { error: deleteError } = await supabase.from(DIARY_TABLE).delete().eq("diary_id", targetDiary);

        if (deleteError) {
          console.error("Error deleting diary:", deleteError);
          return NextResponse.json({ error: "Error deleting diary" }, { status: 500 });
        }
      } else {
        const { error: updateError } = await supabase
          .from(DIARY_TABLE)
          .update({ content: updatedContent })
          .eq("diary_id", targetDiary);

        if (updateError) {
          console.error("Error updating diary:", updateError);
          return NextResponse.json({ error: "Error updating diary" }, { status: 500 });
        }
      }

      return NextResponse.json({ message: "Diary deleted successfully" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }

  return NextResponse.json({ error: "No content found" }, { status: 404 });
}
