export type GymProgressAdvice = {
  type: "success" | "warning" | "danger";
  icon: string;
  title: string;
  message: string;
};

type ExerciseSet = {
  reps?: number;
  weight?: number;
};

export function getGymProgressAdvice(
  sets: ExerciseSet[]
): GymProgressAdvice | null {
  if (sets.length < 3) {
    return null;
  }

  const s1 = sets[0].reps ?? 0;
  const s2 = sets[1].reps ?? 0;
  const s3 = sets[2].reps ?? 0;

  // 🟢 Augmenter la charge
  if (
    s1 >= 12 &&
    s2 >= 12 &&
    s3 >= 10
  ) {
    return {
      type: "success",
      icon: "🚀",
      title: "Tu peux augmenter la charge",
      message:
        "La prochaine séance tu peux augmenter la charge de 2 à 5 %.",
    };
  }

  // 🔴 Diminuer la charge
  if (
    s1 < 8 ||
    s2 < 8 ||
    s3 < 8
  ) {
    return {
      type: "danger",
      icon: "⬇️",
      title: "Charge trop élevée",
      message:
        "Réduis légèrement la charge afin d'atteindre au minimum 8 / 8 / 8.",
    };
  }

  // 🟡 Continuer
  return {
    type: "warning",
    icon: "🎯",
    title: "Continue avec cette charge",
    message:
      "Objectif : atteindre 12 / 12 / 10 avant d'augmenter la charge.",
  };
}