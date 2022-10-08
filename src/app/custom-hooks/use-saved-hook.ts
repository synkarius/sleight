import { useAppSelector } from '../hooks';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { ElementType } from '../../data/model/element-types';
import { ResourceType } from '../../data/model/resource-types';

/** custom hook to determine if there is a saved element with the given id */
export const useSaved = (
  type: ElementType.Type | ResourceType.Type,
  id: string
): boolean => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const fns = useAppSelector((state) => state.fn.saved);
  const selectors = useAppSelector((state) => state.selector.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  switch (type) {
    case ElementType.Enum.ACTION:
      return !!actions[id];
    case ElementType.Enum.COMMAND:
      return !!commands[id];
    case ElementType.Enum.CONTEXT:
      return !!contexts[id];
    case ResourceType.Enum.FN:
      return !!fns[id];
    case ResourceType.Enum.SELECTOR:
      return !!selectors[id];
    case ElementType.Enum.SPEC:
      return !!specs[id];
    case ElementType.Enum.VARIABLE:
      return !!variables[id];
    default:
      throw new ExhaustivenessFailureError(type);
  }
};
