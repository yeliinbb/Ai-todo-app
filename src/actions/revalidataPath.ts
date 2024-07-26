"use server";

import { revalidatePath } from "next/cache";

export default async function revalidateAction(path: string, type: "layout" | "page") {
  revalidatePath(path, type);
}
