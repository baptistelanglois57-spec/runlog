import { theme } from "../../styles/theme";

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

        fontSize: 13,

        textTransform: "uppercase",

        letterSpacing: 1,
      }}
    >
      {children}
    </label>
  );
}