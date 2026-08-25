/**
 * Returns a human-readable label for a gallery category.
 */
export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    all:      "All",
    albums:   "Albums",
    sports:   "Sports",
    cultural: "Cultural",
    academic: "Academic",
    tour:     "Tour",
  };
  return map[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
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
