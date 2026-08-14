import "./FormControls.css";

type Props =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SecondaryButton(
  props: Props
) {
  const { className = "", ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={`rl-secondary-button ${className}`.trim()}
    />
  );
}
