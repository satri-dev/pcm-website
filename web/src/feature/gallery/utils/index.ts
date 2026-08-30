/**
 * Returns the display label for a gallery category. Categories are dynamic
 * (derived from the database), so the category string is used directly. The
 * special "all" value is shown as "All".
 */
export function categoryLabel(cat: string): string {
  return cat === "all" ? "All" : cat;
}

/**
 * Keyboard handler that fires callback on Enter or Space.
 * Use for accessible click-like interactions on non-button elements.
 */
export function onEnterOrSpace(
  cb: () => void
): React.KeyboardEventHandler<HTMLElement> {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cb();
    }
  };
}
