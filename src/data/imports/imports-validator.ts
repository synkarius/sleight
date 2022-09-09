import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { SleightDataInternalFormat } from '../data-formats';

enum ImportValidationResultType {
  VALID,
  INVALID,
}

type ValidResult = {
  status: typeof ImportValidationResultType.VALID;
};

type Invalidated = {
  id: string;
  message: string;
};

type InvalidResult = {
  status: typeof ImportValidationResultType.INVALID;
  invalidated: Invalidated[];
};

export type ImportsValidationResult = ValidResult | InvalidResult;

export type ImportsValidator = {
  validateImportedData: (
    data: SleightDataInternalFormat
  ) => ImportsValidationResult;
};

export const getImportsValidator = (): ImportsValidator => {
  return {
    validateImportedData: (data) => {
      const injected = getDefaultInjectionContext();
      const results = [
        ...Object.values(data.actions).flatMap((action) =>
          injected.validators.action.map((validator) =>
            validator.validate(action, data)
          )
        ),
      ];

      return {
        status: ImportValidationResultType.VALID,
      };
    },
  };
};
