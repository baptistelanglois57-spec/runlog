import type { HTMLAttributes, ReactNode } from "react";

import "./PremiumPanel.css";

type PremiumPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "page" | "modal";
};

export function PremiumPanel({
  variant = "page",
  className = "",
  ...props
}: PremiumPanelProps) {
  return (
    <div
      {...props}
      className={`premium-panel premium-panel--${variant} ${className}`.trim()}
    />
  );
}

type PremiumPanelHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  titleAs?: "h1" | "h2";
  className?: string;
};

export function PremiumPanelHeader({
  title,
  subtitle,
  leading,
  trailing,
  titleAs: Title = "h2",
  className = "",
}: PremiumPanelHeaderProps) {
  return (
    <header className={`premium-panel__header ${className}`.trim()}>
      <div className="premium-panel__header-slot">{leading}</div>
      <div className="premium-panel__heading">
        <Title>{title}</Title>
        {subtitle ? <div className="premium-panel__subtitle">{subtitle}</div> : null}
      </div>
      <div className="premium-panel__header-slot premium-panel__header-slot--end">
        {trailing}
      </div>
    </header>
  );
}

type PremiumPanelFooterProps = HTMLAttributes<HTMLDivElement>;

export function PremiumPanelFooter({
  className = "",
  ...props
}: PremiumPanelFooterProps) {
  return (
    <footer
      {...props}
      className={`premium-panel__footer ${className}`.trim()}
    />
  );
}
