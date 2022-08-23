import { ExhaustivenessFailureError } from '../../../error/exhaustiveness-failure-error';
import { ElementType } from '../../../features/model/common/element-types';
import { ContextType } from '../../../features/model/context/context-types';
import { SelectorDTO } from '../../../features/model/selector/data/selector-dto';
import { SpecItemDTO } from '../../../features/model/spec/data/spec-dto';
import { SpecItemType } from '../../../features/model/spec/spec-item-type';
import { VariableDTO } from '../../../features/model/variable/data/variable-dto';
import { VariableType } from '../../../features/model/variable/variable-types';
import { replaceNonAlphaNumeric } from '../../../util/common-functions';
import { SleightDataInternalFormat } from '../../data-formats';
import { createMustacheFn } from '../util-mustache-fns';

const pElementName = (name: string, type: ElementType.Type): string => {
  return type.toLowerCase() + '_' + replaceNonAlphaNumeric(name, '_');
};

const pSelectorName = (id: string): string => {
  return 'selector_' + replaceNonAlphaNumeric(id, '');
};

const pSelectorItems = (selector: SelectorDTO): string => {
  return selector.items
    .map((item) => item.value)
    .join(' | ')
    .trim();
};

const pSpecItemToken = (
  specItem: SpecItemDTO,
  selectors: Readonly<Record<string, SelectorDTO>>,
  variables: Readonly<Record<string, VariableDTO>>
): string => {
  switch (specItem.itemType) {
    case SpecItemType.Enum.SELECTOR:
      return pSelectorItems(selectors[specItem.itemId]);
    case SpecItemType.Enum.VARIABLE:
      const variable = variables[specItem.itemId];
      return '<' + pElementName(variable.name, ElementType.Enum.VARIABLE) + '>';
    default:
      throw new ExhaustivenessFailureError(specItem.itemType);
  }
};

type PrintingSpecItem = Pick<SpecItemDTO, 'optional' | 'grouped'> & {
  token: string;
};

const finishSpecsProcessing = (partially: PrintingSpecItem[]): string => {
  const result: string[] = [];
  for (let i = 0; i < partially.length; i++) {
    const item = partially[i];
    const prevExists = i > 0;
    const nextExists = i + 1 < partially.length;

    const prevWasGrouped = prevExists && partially[i - 1].grouped;
    if ((item.grouped && !prevWasGrouped) || (!item.grouped && item.optional)) {
      result.push('[');
    }

    // TODO: don't need to always add parens
    const addParens = item.token.includes('|');
    result.push(addParens ? '(' : '');
    result.push(item.token);
    result.push(addParens ? ')' : '');

    const nextIsGrouped = nextExists && partially[i + 1].grouped;
    if ((item.grouped && !nextIsGrouped) || (!item.grouped && item.optional)) {
      result.push(']');
    }
  }
  return result
    .join(' ')
    .replaceAll(/[ ]{2,}/g, ' ')
    .trim();
};

export const dragonflyViewFunctions = (data: SleightDataInternalFormat) => ({
  printSelectorName: createMustacheFn((id, r) => pSelectorName(r(id))),
  printSelectorItems: createMustacheFn((id, r) => {
    const selectorId = r(id);
    return pSelectorItems(data.selectors[selectorId]);
  }),
  printSpec: createMustacheFn((id, r) => {
    const specId = r(id);
    const spec = data.specs[specId];
    const partiallyProcessed = spec.items.map(
      (specItem): PrintingSpecItem => ({
        ...specItem,
        token: pSpecItemToken(specItem, data.selectors, data.variables),
      })
    );
    return finishSpecsProcessing(partiallyProcessed);
  }),
  printContext: createMustacheFn((id, r) => {
    const contextId = r(id);
    const context = data.contexts[contextId];
    const matched =
      context.type === ContextType.Enum.EXECUTABLE_NAME
        ? 'executable'
        : 'title';
    return `AppContext(${matched}="${context.matcher}")`;
  }),
  printVariable: createMustacheFn((id, r) => {
    const variableId = r(id);
    const variable = data.variables[variableId];
    const name = pElementName(variable.name, ElementType.Enum.VARIABLE);
    switch (variable.type) {
      case VariableType.Enum.TEXT:
        return `Dictation("${name}")`;
      case VariableType.Enum.RANGE:
        return `ShortIntegerRef("${name}", ${variable.beginInclusive}, ${variable.endInclusive})`;
      case VariableType.Enum.CHOICE:
        //
        const choiceItems =
          '{' +
          variable.items
            .map((item) => `${pSelectorName(item.selectorId)}: "${item.value}"`)
            .join(', ') +
          '}';
        return `Choice("${name}", ${choiceItems})`;
    }
  }),
});
