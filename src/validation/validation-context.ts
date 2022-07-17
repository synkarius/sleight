import React from 'react';
import { ImproperContextUsageError } from '../error/ImproperContextUsageError';
import { Field } from './validation-field';
import { ValidationError } from './validator';

interface ValidationData {
  // F is a ===-able type which can uniquely identify a field
  touch: (field: Field) => void;
  validateForm: () => boolean;
  getErrors: () => ValidationError[];
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
