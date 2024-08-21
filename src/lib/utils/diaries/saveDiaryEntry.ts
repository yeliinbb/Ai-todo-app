import { DIARY_TABLE } from "@/lib/constants/tableNames";
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { v4 as uuid4 } from "uuid";
const supabase = createClient();
type DiaryContentType = {
  content: string;
  diary_id: string;
  title: string;
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
    console.log(publicUrlData.publicUrl);
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
  userId: string
) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));
    console.log("userId", userId);
    console.log("diaryId", diaryId);
    console.log("htmlContent", htmlContent);
    console.log("diaryTitle", diaryTitle);
    console.log("date", date);

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
    const userInfo_id = await supabase.auth.getSession();
    const userInfo_id_details = userInfo_id.data.session?.user.id as string
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const startDateString = startDate.toISOString();

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);
    const endDateString = endDate.toISOString();
    const { data: existingEntry, error: fetchError } = await supabase
      .from("diaries")
      .select("content")
      .eq("user_auth", userInfo_id_details)
      .gte("created_at", startDateString)
      .lte("created_at", endDateString)
      .single();

    const newContentItem = {
      diary_id: nanoid(),
      title: diaryTitle,
      content: updatedHtmlContent
    };
    let itemIndex = "-1";
    let diaryIdToDetailPage = diaryId;
    console.log("=============================");
    console.log("existingEntry항목입니다.", existingEntry);
    console.log("=============================");
    if (existingEntry) {
      let contentArray = existingEntry.content as DiaryContentType[];

      const entryIndex = contentArray.findIndex((entry) => entry?.diary_id === diaryId);

      if (entryIndex > -1) {
        contentArray[entryIndex] = {
          diary_id: diaryId,
          title: diaryTitle,
          content: updatedHtmlContent
        };
        diaryIdToDetailPage = nanoid();
        itemIndex = String(entryIndex);
      } else {
        contentArray.push(newContentItem);
        itemIndex = String(contentArray.length - 1);
      }

      const { error: updateError } = await supabase
        .from(DIARY_TABLE)
        .update({ content: contentArray })
        .eq("user_auth", userInfo_id_details)
        .eq("created_at", new Date(date).toISOString());

      if (updateError) {
        console.error("Error updating diary entry:", updateError);
        throw updateError;
      }
      if (typeof window !== "undefined" && !window.location.pathname.includes("/chat/friend")) {
        toast.success("일기 추가/갱신 완료");
      }
    } else {
      diaryIdToDetailPage = nanoid();
      const newContentArray = [
        {
          diary_id: diaryIdToDetailPage,
          title: diaryTitle,
          content: updatedHtmlContent
        }
      ];
      itemIndex = "0";

      const userInfo_id = await supabase.auth.getSession();
      const userInfo_id_details = userInfo_id.data.session?.user.id;
      const { error: insertError } = await supabase.from(DIARY_TABLE).insert({
        content: newContentArray,
        user_auth: userInfo_id_details,
        created_at: new Date(date).toISOString(),
        user_id: ""
      });
      // .eq("user_auth", userId)
      // .eq("created_at", new Date(date).toISOString());

      if (insertError) {
        console.error("Error updating diary entry:", insertError);
        throw insertError;
      }
      if (typeof window !== "undefined" && !window.location.pathname.includes("/chat/friend")) {
        toast.success("오늘의 첫 일기 추가 완료");
      }
    }
    const { data: diaryData, error: selectError } = await supabase
      .from(DIARY_TABLE)
      .select("diary_id")
      .eq("user_auth", userInfo_id_details)
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
