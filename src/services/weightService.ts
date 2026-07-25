import type { Weight } from "../types/Weight";

const STORAGE_KEY = "runlog_weights";

export async function getWeights(): Promise<Weight[]> {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export async function saveWeight(weight: Weight) {
  const weights = await getWeights();

  weights.unshift(weight);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(weights)
  );
}

export async function deleteWeight(id: string) {
  const weights = await getWeights();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      weights.filter((w) => w.id !== id)
    )
  );
}