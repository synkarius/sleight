import React from 'react';
import { Field } from './validation-field';
import { ErrorValidationResult } from './validation-result';

interface ValidationData {
  readonly touch: (field: Field) => void;
  readonly validateForm: () => boolean;
  readonly getErrorResults: () => ErrorValidationResult[];
}

/**
 * Ignoring the requirement to add a default context because
 * it's better to have a React error than some Sleight error.
 */
export const ValidationContext: React.Context<ValidationData> =
  // @ts-ignore
  React.createContext();
