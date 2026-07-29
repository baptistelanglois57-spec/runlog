type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header
      style={{
        marginBottom: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <h1
        style={{
          margin: 0,
          color: "#FFFFFF",
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: "-1px",
          lineHeight: 1,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          color: "#9CA3AF",
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        {subtitle}
      </p>
    </header>
  );
}