import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

type Props = {
  children: React.ReactNode;
};

export default function FormLabel({
  children,
}: Props) {
  return (
    <label
      style={{
        display: "block",

        marginBottom: 8,

        color: theme.colors.primary,

        fontWeight: 700,

        fontSize: Typography.caption,

        textTransform: "uppercase",

        letterSpacing: 1,
      }}
    >
      {children}
    </label>
  );
}
