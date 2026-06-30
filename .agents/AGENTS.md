# Styling & Feature Implementation Rules

## CSS / SCSS Guidelines
- **Always Check Existing Utilities First**: Before implementing styling for a new feature or creating new classes, search through the common stylesheets:
  - [_common.scss](file:///c:/Users/HAO/Documents/GitHub/moma/src/app/shared/assets/styles/_common.scss) (for padding, margin, width, gap, font-size utilities, etc.)
  - [_typography.scss](file:///c:/Users/HAO/Documents/GitHub/moma/src/app/shared/assets/styles/_typography.scss) (for global typography presets and color classes)
  - [_variables.scss](file:///c:/Users/HAO/Documents/GitHub/moma/src/app/shared/assets/styles/_variables.scss) (for custom size, spacing, and color variables)
  - [_button.scss](file:///c:/Users/HAO/Documents/GitHub/moma/src/app/shared/assets/styles/_button.scss) (for button configurations and variants)
- **Reuse Utility Classes**: If a layout or size utility is already defined (e.g. `.fontsize-32`, `.text-color-danger`), use it directly in the HTML template instead of writing custom CSS rules in the component's stylesheet.
- **Variable Definitions**: Always define any new custom variables for colors, spacing, or sizes in `_variables.scss` instead of hardcoding them locally.
- **Semantic Classes Criteria**: Only define new semantic typography classes in `_typography.scss` if they group together multiple typography attributes (such as `font-size`, `font-weight`, and `line-height`) rather than just a single property.

## Component Reuse Guidelines
- **Always Reuse Common Components**: Before creating custom layouts or using raw HTML elements, check the [components](file:///c:/Projects/moma/src/app/components) directory for existing shared components.
- **Do Not Use Raw HTML Alternatives**: Avoid using standard HTML tags (like `<button>`) when a corresponding custom component is available (like `ht-button`).
- **Available Shared Components**:
  - [ht-button](file:///c:/Projects/moma/src/app/components/ht-button/ht-button.component.ts): Use for all action buttons (primary, secondary, danger/delete).
  - [ht-input](file:///c:/Projects/moma/src/app/components/ht-input/ht-input.component.ts): Use for standard text inputs and form fields.
  - [ht-card](file:///c:/Projects/moma/src/app/components/ht-card/ht-card.component.ts): Use for standard containers, content sections, and dashboard blocks.
  - [ht-loading](file:///c:/Projects/moma/src/app/components/ht-loading/ht-loading.component.ts): Use for screen overlays, loaders, and async spinners.
  - [ht-metric-card](file:///c:/Projects/moma/src/app/components/ht-metric-card/ht-metric-card.component.ts): Use for KPI indexes, statistics, and numeric highlights.
  - [ht-table](file:///c:/Projects/moma/src/app/components/ht-table/ht-table.component.ts): Use for structured tabular data grids.

