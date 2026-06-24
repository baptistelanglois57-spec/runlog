import { supabase } from "../lib/supabase";
import { buildCoachContext } from "./coachContext";

export async function askCoach(
  question: string
) {
  const context =
    await buildCoachContext();

  const { data, error } =
    await supabase.functions.invoke(
      "coach",
      {
        body: {
          question,
          context,
        },
      }
    );

  if (error) {
    console.error(
      "Erreur Coach :",
      error
    );

    return JSON.stringify(error);
  }

  return data.answer;
}