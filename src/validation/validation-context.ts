import React from 'react';
import { Field } from './validation-field';
import { ErrorValidationResult } from './validation-result';

interface ValidationData {
  readonly touch: (field: Field) => void;
  readonly validateForSave: () => boolean;
  readonly validateForDelete: () => ErrorValidationResult[];
  readonly getErrorResults: () => ErrorValidationResult[];
}

export const ValidationContext = React.createContext<
  ValidationData | undefined
>(undefined) as React.Context<ValidationData>;
