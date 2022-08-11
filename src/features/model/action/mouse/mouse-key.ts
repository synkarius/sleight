export namespace MouseKey {
  export const Enum = {
    LEFT: 'Left',
    MIDDLE: 'Middle',
    RIGHT: 'Right',
    FOUR: 'Four',
    FIVE: 'Five',
    WHEEL_UP: 'Wheel Up',
    WHEEL_DOWN: 'Wheel Down',
    WHEEL_LEFT: 'Wheel Left',
    WHEEL_RIGHT: 'Wheel Right',
    STEP_UP: 'Step Up',
    STEP_DOWN: 'Step Down',
    STEP_LEFT: 'Step Left',
    STEP_RIGHT: 'Step Right',
  } as const;
  export const values = () => [
    Enum.LEFT,
    Enum.MIDDLE,
    Enum.RIGHT,
    Enum.FOUR,
    Enum.FIVE,
    Enum.WHEEL_UP,
    Enum.WHEEL_DOWN,
    Enum.WHEEL_LEFT,
    Enum.WHEEL_RIGHT,
    Enum.STEP_UP,
    Enum.STEP_DOWN,
    Enum.STEP_LEFT,
    Enum.STEP_RIGHT,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
