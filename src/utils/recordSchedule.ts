export function shouldCheckWeekRecord(): boolean {
  const today = new Date();

  // Lundi
  return today.getDay() === 1;
}

export function shouldCheckMonthRecord(): boolean {
  const today = new Date();

  // Premier jour du mois
  return today.getDate() === 1;
}

export function shouldCheckYearRecord(): boolean {
  const today = new Date();

  // 1er janvier
  return (
    today.getDate() === 1 &&
    today.getMonth() === 0
  );
}