const REFERENCE_WIDTH = 390;

/** Display headings are sized for a 390 dp phone; shrink them on narrower screens. */
export const displaySize = (base: number, width: number) =>
  Math.round(base * Math.min(1, width / REFERENCE_WIDTH));
