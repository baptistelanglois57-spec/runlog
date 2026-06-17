import CalendarGrid from "./CalendarGrid";

type CalendarProps = {
  month: Date;
};

export default function Calendar({
  month,
}: CalendarProps) {
  return (
    <CalendarGrid month={month} />
  );
}