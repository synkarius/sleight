import { quote } from '../../../../../core/common/common-functions';
import { Maybe, none, some } from '../../../../../core/common/maybe';
import { SleightDataInternalFormat } from '../../../../data-formats';
import { Action } from '../../../../model/action/action';
import { isMimicAction } from '../../../../model/action/mimic/mimic';
import { ElementTokenPrinter } from '../../../element-token-printer';
import { DragonflyActionValueResolver } from '../action-value/dragonfly-action-value-resolver';
import { DragonflyActionValueResolverResultType } from '../action-value/dragonfly-action-value-resolver-result';
import { AbstractDragonflyActionPrinterDelegate } from './abstract-action-printer-delegate';

export class DragonflyMimicPrinter extends AbstractDragonflyActionPrinterDelegate {
  constructor(
    private actionValueResolver: DragonflyActionValueResolver,
    elementTokenPrinter: ElementTokenPrinter
  ) {
    super(elementTokenPrinter);
  }
  printAction(action: Action, data: SleightDataInternalFormat): Maybe<string> {
    if (isMimicAction(action)) {
      const args: string[] = [];
      //
      const wordsResult = this.actionValueResolver.resolve(action.words, data);
      if (!this.resultIsEmpty(wordsResult)) {
        if (
          wordsResult.type ===
          DragonflyActionValueResolverResultType.USE_VARIABLE
        ) {
          args.push(quote(this.resultToDFStrInterp(wordsResult)));
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
