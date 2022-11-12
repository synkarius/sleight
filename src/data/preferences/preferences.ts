import { createNegativizer, Negativizer } from './negativizer';

export type Preferences = {
  negativizer: Negativizer;
};

export const createPreferences = (): Preferences => ({
  negativizer: createNegativizer(),
});
