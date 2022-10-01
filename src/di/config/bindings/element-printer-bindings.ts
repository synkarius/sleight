import { Container, injected } from 'brandi';
import { DefaultDragonflyMustacheFnsFactory } from '../../../data/exports/dragonfly/dragonfly-mustache-helper-fns';
import { DragonflyActionPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-action-printer';
import { DragonflyCommandPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-command-printer';
import { DragonflyContextPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-context-printer';
import { DragonflySelectorPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-selector-printer';
import { DragonflySpecPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-spec-printer';
import { DragonflyVariablePrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-variable-printer';
import { DefaultElementNamePrinter } from '../../../data/exports/element-name-printer';
import { Tokens } from '../brandi-tokens';

export const bindElementPrinters = (container: Container): void => {
  /*
   * DRAGONFLY
   */
  container
    .bind(Tokens.ElementNamePrinter)
    .toInstance(DefaultElementNamePrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonElementPrinter_Action)
    .toInstance(DragonflyActionPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonElementPrinter_Command)
    .toInstance(DragonflyCommandPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonElementPrinter_Context)
    .toInstance(DragonflyContextPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonElementPrinter_Selector)
    .toInstance(DragonflySelectorPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonElementPrinter_Spec)
    .toInstance(DragonflySpecPrinter)
    .inSingletonScope();
  injected(
    DragonflySpecPrinter,
    Tokens.ElementNamePrinter,
    Tokens.DragonElementPrinter_Selector
  );
  container
    .bind(Tokens.DragonElementPrinter_Variable)
    .toInstance(DragonflyVariablePrinter)
    .inSingletonScope();
  injected(
    DragonflyVariablePrinter,
    Tokens.ElementNamePrinter,
    Tokens.DragonElementPrinter_Selector
  );
  container
    .bind(Tokens.DragonflyMustacheFnsFactory)
    .toInstance(DefaultDragonflyMustacheFnsFactory)
    .inSingletonScope();
  injected(
    DefaultDragonflyMustacheFnsFactory,
    Tokens.DragonElementPrinter_Action,
    Tokens.DragonElementPrinter_Command,
    Tokens.DragonElementPrinter_Context,
    Tokens.DragonElementPrinter_Spec,
    Tokens.DragonElementPrinter_Variable
  );
};
