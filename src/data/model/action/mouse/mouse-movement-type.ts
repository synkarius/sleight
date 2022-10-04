export namespace MouseMovementType {
  export const Enum = {
    ABSOLUTE_PIXELS: 'Absolute Pixels',
    RELATIVE_PIXELS: 'Relative Pixels',
    WINDOW_PERCENTAGE: 'Window Percentage',
  } as const;
  export const values = () => [
    Enum.ABSOLUTE_PIXELS,
    Enum.RELATIVE_PIXELS,
    Enum.WINDOW_PERCENTAGE,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
