import type { InputHTMLAttributes } from "react";
import "./FormControls.css";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function InputField(
  props: Props
) {
  const { className = "", ...inputProps } = props;

  return (
    <input
      {...inputProps}
      className={`rl-input ${className}`.trim()}
    />
  );
}
