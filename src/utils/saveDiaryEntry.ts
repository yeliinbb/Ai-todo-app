import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
const supabase = createClient();
type DiaryContentType = {
  content: string;
  diary_id: string;
  title: string;
  isFetching_todo: boolean;
};

const uploadImageToSupabase = async (blob: Blob): Promise<string | null> => {
  try {
    const fileName = `diary-images/${nanoid()}.png`;
    const { data, error: uploadError } = await supabase.storage.from("diary-images").upload(fileName, blob, {
      cacheControl: "3600",
      upsert: true
    });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    }
    const { data: publicUrlData } = supabase.storage.from("diary-images").getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
};

export const saveDiaryEntry = async (
  date: string,
  diaryTitle: string,
  htmlContent: string,
  diaryId: string,
  fetchingTodos: boolean
) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    for (const img of images) {
      const imageSrc = img.src;

      if (imageSrc.startsWith("data:image/")) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const imageUrl = await uploadImageToSupabase(blob);
        if (imageUrl) {
          img.src = imageUrl;
        }
      }
    }

    const updatedHtmlContent = doc.documentElement.innerHTML;
    const user_id = "kimyong1@result.com";

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const startDateString = startDate.toISOString();

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
    const endDateString = endDate.toISOString();
    const { data: existingEntry, error: fetchError } = await supabase
      .from("diaries")
      .select("content")
      .eq("user_id", user_id)
      .gte("created_at", startDateString)
      .lte("created_at", endDateString)
      .single();

    const newContentItem = {
      diary_id: nanoid(),
      title: diaryTitle,
      content: updatedHtmlContent,
      isFetching_todo: fetchingTodos
    };
    let itemIndex = "-1";
    let diaryIdToDetailPage = diaryId;

    if (existingEntry) {
      let contentArray = existingEntry.content as DiaryContentType[];

      const entryIndex = contentArray.findIndex((entry) => entry?.diary_id === diaryId);

      if (entryIndex > -1) {
        contentArray[entryIndex] = {
          diary_id: diaryId,
          title: diaryTitle,
          content: updatedHtmlContent,
          isFetching_todo: fetchingTodos
        };
        diaryIdToDetailPage = nanoid();
        itemIndex = String(entryIndex);
      } else {
        contentArray.push(newContentItem);
        itemIndex = String(contentArray.length - 1);
      }

      const { error: updateError } = await supabase
        .from("diaries")
        .update({ content: contentArray })
        .eq("user_id", user_id)
        .eq("created_at", new Date(date).toISOString());

      if (updateError) {
        console.error("Error updating diary entry:", updateError);
        throw updateError;
      }
      alert("일기 내용 업데이트 완료");
    } else {
      diaryIdToDetailPage = nanoid();
      const newContentArray = [
        { diary_id: nanoid(), title: diaryTitle, content: updatedHtmlContent, isFetching_todo: fetchingTodos }
      ];
      itemIndex = "0";
      const { error: insertError } = await supabase
        .from("diaries")
        .insert({
          content: newContentArray,
          user_id: user_id,
          created_at: new Date(date).toISOString()
        })
        .eq("user_id", user_id)
        .eq("created_at", new Date(date).toISOString());

      if (insertError) {
        console.error("Error updating diary entry:", insertError);
        throw insertError;
      }
      alert("일기 내용 추가 완료");
    }
    const { data: diaryData, error: selectError } = await supabase
      .from("diaries")
      .select("diary_id")
      .eq("user_id", user_id)
      .eq("created_at", startDateString)
      .single();

    if (selectError) {
      console.error("Error fetching diary id:", selectError);
      throw selectError;
    }
    return { diaryData, itemIndex };
  } catch (error) {
    console.error("Error in saveDiaryEntry:", error);
  }
};
