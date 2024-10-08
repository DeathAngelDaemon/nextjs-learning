"use server";

import { redirect } from "node_modules/next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "@/node_modules/next/cache";

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image || meal.image.size === 0
   ) {
    // only simple object properties, no functions (they would get lost)
    return {
      message: 'Invalid input'
    };
   }

  await saveMeal(meal);
  // 1. path to be revalidated
  // 2. layout get revalidated which includes all nested pages
  revalidatePath('/meals', 'layout');
  redirect("/meals");
}
