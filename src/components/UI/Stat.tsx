import { theme } from "../../styles/theme";

type Props = {
  icon?: string;
  title: string;
  value: string | number;
};

export default function Stat({
  icon,
  title,
  value,
}: Props) {
  return (
    <div>
      <p
        style={{
          marginBottom: "6px",
          color: theme.colors.textSecondary,
          fontSize: "15px",
        }}
      >
        {icon} {title}
      </p>

      <strong
        style={{
          color: theme.colors.text,
          fontSize: "17px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}