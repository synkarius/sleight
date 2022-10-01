import { replaceNonAlphaNumeric } from '../../core/common/common-functions';
import { ElementType } from '../model/element-types';

export type ElementNamePrinter = {
  printElementName: (name: string, type: ElementType.Type) => string;
};

export class DefaultElementNamePrinter implements ElementNamePrinter {
  printElementName(name: string, type: ElementType.Type): string {
    return type.toLowerCase() + '_' + replaceNonAlphaNumeric(name, '_');
  }
}
