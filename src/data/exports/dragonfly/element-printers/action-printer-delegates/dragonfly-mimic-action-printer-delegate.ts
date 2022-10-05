import { isEmpty, quote } from '../../../../../core/common/common-functions';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isMimicAction } from '../../../../model/action/mimic/mimic';
import { ElementType } from '../../../../model/element-types';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResultType,
  resultIsEmpty,
  resultToArg,
  resultToDFStrInterp,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyMimicPrinter implements DragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}
  printAction(
    action: Action,
    data: SleightDataInternalFormat
  ): string | undefined {
    if (isMimicAction(action)) {
      const args: string[] = [];
      //
      const wordsResult = this.actionValueResolver.resolve(action.words, data);
      if (!resultIsEmpty(wordsResult)) {
        if (
          wordsResult.type ===
          DragonflyActionValueResolverResultType.USE_VARIABLE
        ) {
          args.push(
            quote(resultToDFStrInterp(wordsResult)(this.elementTokenPrinter))
          );
        } else {
          wordsResult.value
            .split(' ')
            .map(quote)
            .forEach((word) => args.push(word));
        }
      }
      return ['Mimic(', args.join(', '), ')'].join('');
    }
  }
}
