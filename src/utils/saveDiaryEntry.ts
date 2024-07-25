import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
const supabase = createClient();

// 이미지를 Supabase에 업로드하고 URL 반환
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

    // 업로드된 파일의 공용 URL을 가져오기
    const { data: publicUrlData } = supabase.storage.from("diary-images").getPublicUrl(fileName);

    console.log("이미지의 실제 URL입니다.", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
};

export const saveDiaryEntry = async (date: string, diaryTitle: string, htmlContent: string) => {
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

    const searchDate = date ? new Date(date) : new Date();
    const startDate = new Date(searchDate);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(searchDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data: existingEntry, error: fetchError } = await supabase
      .from("diaries")
      .select("content")
      .eq("user_id", user_id)
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString())
      .order("created_at", { ascending: true });

    if (fetchError) {
      console.error("Error fetching existing diary entry:", fetchError);
      throw fetchError;
    }
    console.log(existingEntry);
    if (existingEntry && existingEntry.length > 0) {
      let contentArray = existingEntry[0].content;
      if (typeof contentArray === "string") {
        contentArray = JSON.parse(contentArray);
      }

      if (!Array.isArray(contentArray)) {
        contentArray = [];
      }
      const updatedContent = [...contentArray, { title: diaryTitle, content: updatedHtmlContent }];
      const { error: updateError } = await supabase
        .from("diaries")
        .update({ content: updatedContent })
        .eq("user_id", user_id)
        .eq("created_at", new Date(date).toISOString());

      if (updateError) {
        console.error("Error updating diary entry:", updateError);
        throw updateError;
      }
    } else {
      // 기존 항목이 없는 경우 새로 삽입
      const { error: insertError } = await supabase.from("diaries").insert({
        user_id,
        content: [{ title: diaryTitle, content: updatedHtmlContent }],
        created_at: new Date(date).toISOString()
      });

      if (insertError) {
        console.error("Error inserting new diary entry:", insertError);
        throw insertError;
      }
    }

    alert("일기 작성완료");
  } catch (error) {
    console.error("Error in saveDiaryEntry:", error);
  }
};
