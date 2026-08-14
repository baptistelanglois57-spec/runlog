import "./FormControls.css";

type Props =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextareaField(
  props: Props
) {
  const { className = "", ...textareaProps } = props;

  return (
    <textarea
      {...textareaProps}
      className={`rl-textarea ${className}`.trim()}
    />
  );
}
