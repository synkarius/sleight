import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isMimicAction } from '../../../../model/action/mimic/mimic';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import {
  DragonflyActionValueResolverResultType,
  resultIsEmpty,
  resultToDFStrInterp,
} from '../action-value/dragonfly-action-value-resolver-result';
import { DragonflyActionPrinterDelegate } from './action-printer-delegate';

export class DragonflyMimicPrinter implements DragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    private elementTokenPrinter: ElementTokenPrinter
  ) {}
  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
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
      return some(['Mimic(', args.join(', '), ')'].join(''));
    }
    return none();
  }
}
