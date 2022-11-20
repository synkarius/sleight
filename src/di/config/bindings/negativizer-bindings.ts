import { Container, injected } from 'brandi';
import { DefaultDragonflyNegativizerFnWrapperPrinter } from '../../../data/exports/dragonfly/element-printers/negativizer/dragonfly-negativizer-fn-wrapper-printer';
import { DefaultDragonflyNegativizerPrinter } from '../../../data/exports/dragonfly/element-printers/negativizer/dragonfly-negativizer-printer-augmenter';
import { Tokens } from '../brandi-tokens';

export const bindNegativizer = (container: Container): void => {
  container
    .bind(Tokens.DragonflyNegativizerPrinter)
    .toInstance(DefaultDragonflyNegativizerPrinter)
    .inSingletonScope();
  injected(DefaultDragonflyNegativizerPrinter, Tokens.ElementTokenPrinter);
  container
    .bind(Tokens.DragonflyPrinter_Fn_NegativizerWrapper)
    .toInstance(DefaultDragonflyNegativizerFnWrapperPrinter)
    .inSingletonScope();
};
