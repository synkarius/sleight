import { replaceNonAlphaNumeric } from '../../core/common/common-functions';
import { ElementType } from '../model/element-types';

export type ElementTokenPrinter = {
  printElementToken: (id: string, type: ElementType.Type) => string;
};

export class DefaultElementTokenPrinter implements ElementTokenPrinter {
  printElementToken(id: string, type: ElementType.Type): string {
    return type.toLowerCase() + '_' + replaceNonAlphaNumeric(id, '_');
  }
}
