import { useAppSelector } from '../hooks';
import { ExhaustivenessFailureError } from '../../error/exhaustiveness-failure-error';
import { ElementType } from '../../data/model/element-types';

/** custom hook to determine if there is a saved element with the given id */
export const useSaved = (
  elementType: ElementType.Type,
  id: string
): boolean => {
  const actions = useAppSelector((state) => state.action.saved);
  const commands = useAppSelector((state) => state.command.saved);
  const contexts = useAppSelector((state) => state.context.saved);
  const specs = useAppSelector((state) => state.spec.saved);
  const variables = useAppSelector((state) => state.variable.saved);
  switch (elementType) {
    case ElementType.Enum.ACTION:
      return !!actions[id];
    case ElementType.Enum.COMMAND:
      return !!commands[id];
    case ElementType.Enum.CONTEXT:
      return !!contexts[id];
    case ElementType.Enum.SPEC:
      return !!specs[id];
    case ElementType.Enum.VARIABLE:
      return !!variables[id];
    default:
      throw new ExhaustivenessFailureError(elementType);
  }
};
