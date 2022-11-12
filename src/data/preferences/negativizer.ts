export const DEFAULT_NEGATIVIZER_SELECTOR = 'minus';

export type Negativizer = {
  selector: string;
};

export const createNegativizer = (): Negativizer => ({
  selector: DEFAULT_NEGATIVIZER_SELECTOR,
});
