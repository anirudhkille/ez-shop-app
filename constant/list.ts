/**
 * Virtualization settings shared by the two-column product grids. Six cards per
 * batch keeps the first paint quick on low-end phones without leaving gaps
 * while scrolling.
 */
export const GRID_WINDOW = {
  initialNumToRender: 6,
  maxToRenderPerBatch: 6,
  windowSize: 5,
  updateCellsBatchingPeriod: 50,
} as const;
