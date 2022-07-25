import React from 'react';
import { ImproperContextUsageError } from '../error/ImproperContextUsageError';
import { Field } from './validation-field';
import { ValidationError } from './validator';

interface ValidationData {
  readonly touch: (field: Field) => void;
  readonly validateForm: () => boolean;
  readonly getErrors: () => ValidationError[];
}

const createDefaultValidationState = (): ValidationData => {
  return {
    touch: (field: Field) => {
      throw new ImproperContextUsageError();
    },
    validateForm: () => {
      throw new ImproperContextUsageError();
    },
    getErrors: (): ValidationError[] => {
      throw new ImproperContextUsageError();
    },
  };
};
export const ValidationContext = React.createContext(
  createDefaultValidationState()
);
