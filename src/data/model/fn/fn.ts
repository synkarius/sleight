import { getRandomId } from '../../../core/common/random-id';
import { Enablable, Ided, Lockable, Named, RoleKeyed, Typed } from '../domain';
import { VariableType } from '../variable/variable-types';
import { FnType } from './fn-types';

interface AbstractFn
  extends Ided,
    Named,
    RoleKeyed,
    Typed<FnType.Type>,
    Enablable,
    Lockable {}

export interface PythonFn extends AbstractFn {
  type: typeof FnType.Enum.PYTHON;
  importTokens: string[];
  parameters: PythonFnParameter[];
}

export const isPythonFn = (fn: Fn): fn is PythonFn =>
  fn.type === FnType.Enum.PYTHON;

interface AbstractFnParameter extends Ided, Named, Typed<VariableType.Type> {}

export interface PythonFnParameter extends AbstractFnParameter {}

export type FnParameter = PythonFnParameter;

export type Fn = PythonFn;

export const createPythonFnParameter = (): PythonFnParameter => ({
  id: getRandomId(),
  name: '',
  type: VariableType.Enum.TEXT,
});

export const createPythonFn = (): PythonFn => ({
  id: getRandomId(),
  type: FnType.Enum.PYTHON,
  name: '',
  roleKey: '',
  enabled: true,
  locked: false,
  importTokens: [],
  parameters: [],
});

export const copyIntoPythonFn = (fn: Fn): PythonFn => ({
  id: fn.id,
  type: FnType.Enum.PYTHON,
  name: fn.name,
  roleKey: fn.roleKey,
  enabled: fn.enabled,
  locked: fn.locked,
  importTokens: [],
  parameters: [],
});
