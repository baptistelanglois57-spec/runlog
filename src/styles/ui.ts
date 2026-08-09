// ===============================
// RunLog UI System
// Mobile First
// ===============================

export const Typography = {
  pageTitle: "var(--rl-type-page-title)",
  sectionTitle: "var(--rl-type-section-title)",
  cardTitle: "var(--rl-type-card-title)",
  body: "var(--rl-type-body)",
  bodySecondary: "var(--rl-type-body-secondary)",
  caption: "var(--rl-type-caption)",
  button: "var(--rl-type-button)",
  input: "16px",
  metric: "var(--rl-type-metric)",
} as const;

export const UI = {
  // Largeurs
  PAGE_MAX_WIDTH: "430px",
  CONTENT_MAX_WIDTH: "660px",

  // Espacements
  PAGE_PADDING: 16,
  CARD_PADDING: 18,
  SECTION_GAP: 18,
  GRID_GAP: 16,

  // Coins arrondis
  RADIUS_SMALL: 12,
  RADIUS: 20,
  RADIUS_LARGE: 24,
  RADIUS_FULL: 999,

  // Icônes
  ICON_BOX: 40,
  ICON_SIZE: 20,
  ICON_SIZE_LARGE: 24,

  // Boutons
  BUTTON_HEIGHT: 48,
  BUTTON_RADIUS: 14,

  // Inputs
  INPUT_HEIGHT: 52,
  INPUT_RADIUS: 14,

  // Cartes
  CARD_MIN_HEIGHT: 125,
  CARD_MIN_HEIGHT_LARGE: 145,

  // Typographie — échelle RunLog 3.0 (tokens CSS définis dans index.css)
  FONT_HERO: Typography.pageTitle,
  FONT_H1: Typography.pageTitle,
  FONT_H2: Typography.sectionTitle,
  FONT_H3: Typography.cardTitle,

  FONT_BODY: Typography.body,
  FONT_SMALL: Typography.bodySecondary,
  FONT_TINY: Typography.caption,

  FONT_NUMBER: Typography.metric,

  // Marges
  HEADER_MARGIN: 30,
  CARD_MARGIN: 18,

  // Animations
  TRANSITION: "all .20s ease",
};
