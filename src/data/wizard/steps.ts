export namespace Steps {
  export const Enum = {
    STEP_1: '',
    STEP_2: 'step2',
    STEP_3: 'step3',
    STEP_4: 'step4',
    STEP_5: 'step5',
    STEP_6: 'step6',
    STEP_7: 'step7',
    COMPLETE: 'complete',
  } as const;
  export const values = () => [
    Enum.STEP_1,
    Enum.STEP_2,
    Enum.STEP_3,
    Enum.STEP_4,
    Enum.STEP_5,
    Enum.STEP_6,
    Enum.STEP_7,
    Enum.COMPLETE,
  ];
  export type Type = typeof Enum[keyof typeof Enum];
}
