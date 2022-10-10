import { useAppSelector } from '../hooks';
import { SleightDataInternalFormat } from '../../data/data-formats';

export const useAllData = (): Readonly<SleightDataInternalFormat> => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const fns = useAppSelector((state) => state.fn.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  return {
    actions,
    commands,
    contexts,
    fns,
    selectors,
    specs,
    variables,
  };
};
