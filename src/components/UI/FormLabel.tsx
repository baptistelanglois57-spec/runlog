import "./FormControls.css";

type Props = {
  children: React.ReactNode;
};

export default function FormLabel({
  children,
}: Props) {
  return (
    <label className="rl-form-label">
      {children}
    </label>
  );
}
