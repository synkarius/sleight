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

/**
 * Temporary -- here only so that code elsewhere gets built out
 * correctly. Delete when there's a second function type.
 */
interface OtherFnType extends Ided, Named, RoleKeyed, Enablable, Lockable {
  type: 'other';
}

export interface PythonFn extends AbstractFn {
  type: typeof FnType.Enum.PYTHON;
  importTokens: string[];
  parameters: PythonFnParameter[];
}

export type PythonFnParameter = {
  name: string;
  type: VariableType.Type;
};

export type Fn = PythonFn | OtherFnType;

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
