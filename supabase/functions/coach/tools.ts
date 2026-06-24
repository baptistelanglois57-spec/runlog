export function prepareContext(context: unknown) {
  return JSON.stringify(context, null, 2);
}