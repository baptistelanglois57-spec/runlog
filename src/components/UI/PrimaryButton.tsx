import type { ButtonHTMLAttributes } from "react";
import "./FormControls.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton(
  props: Props
) {
  const { className = "", ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={`rl-primary-button ${className}`.trim()}
    />
  );
}
