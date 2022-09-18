import { isDefined, isIdSelected } from '../../../core/common/common-functions';
import { Spec } from '../../../data/model/spec/spec-domain';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import { VariableDTO } from '../../../data/model/variable/variable-dto';
import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';

export const mapSpecToPreview = (
  spec: Spec,
  variablesSaved: Record<string, VariableDTO>
): string => {
  return (
    spec.items
      .map((specItem) => {
        const itemType = specItem.itemType;
        switch (itemType) {
          case SpecItemType.Enum.SELECTOR:
            return (
              '[ ' +
              specItem.selector.items.map((sItem) => sItem.value).join(' | ') +
              ' ]'
            );
          case SpecItemType.Enum.VARIABLE:
            if (isIdSelected(specItem.variableId)) {
              const variableDTO = variablesSaved[specItem.variableId];
              return '[[ ' + variableDTO.name + ' ]]';
            }
            return undefined;
          default:
            throw new ExhaustivenessFailureError(itemType);
        }
      })
      .filter(isDefined)
      .join(' ') || ''
  );
};
