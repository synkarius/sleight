import { getRandomId } from '../../../../core/common/random-id';
import { VariableType } from '../../variable/variable-types';
import { FunctionType } from './function-types';

export interface Function {
  id: string;
  type: FunctionType.Type;
}

export interface PythonFunction extends Function {
  type: typeof FunctionType.Enum.PYTHON;
  name: string;
  importTokens: string[];
  parameters: PythonFunctionParameter[];
}

export type PythonFunctionParameter = {
  name: string;
  type: VariableType.Type;
};

export const createPythonFunction = (): PythonFunction => ({
  id: getRandomId(),
  type: FunctionType.Enum.PYTHON,
  name: '',
  importTokens: [],
  parameters: [],
});
