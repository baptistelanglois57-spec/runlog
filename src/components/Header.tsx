type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      style={{
        marginBottom: "35px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          margin: 0,
        }}
      >
        🏃 {title}
      </h1>

      <p
        style={{
          color: "#94A3B8",
          fontSize: "18px",
          marginTop: "10px",
        }}
      >
        {subtitle}
      </p>
    </header>
  );
}