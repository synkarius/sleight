import { useAppSelector } from '../app/hooks';
import { SleightDataInternalFormat } from './data-formats';

export const useAllDataSelector = (): Readonly<SleightDataInternalFormat> => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const roleKeys = useAppSelector((state) => state.roleKey.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  return {
    actions,
    commands,
    contexts,
    roleKeys,
    selectors,
    specs,
    variables,
  };
};
