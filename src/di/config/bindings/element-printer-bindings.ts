import { Container, injected } from 'brandi';
import { DefaultDragonflyMustacheFnsFactory } from '../../../data/exports/dragonfly/dragonfly-mustache-helper-fns';
import { DragonflyBringAppPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-bring-app-action-printer-delegate';
import { DragonflyPausePrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-pause-action-printer-delegate';
import { DefaultDragonflyActionValueResolver } from '../../../data/exports/dragonfly/element-printers/action-value/dragonfly-action-value-resolver';
import { DelegatingDragonflyActionPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-action-printer';
import { DragonflyCommandPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-command-printer';
import { DragonflyContextPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-context-printer';
import { DragonflySelectorPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-selector-printer';
import { DragonflySpecPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-spec-printer';
import { DragonflyVariablePrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-variable-printer';
import { DefaultElementNamePrinter } from '../../../data/exports/element-name-printer';
import { DragonflyActionPrinterDelegateArray } from '../../di-collection-types';
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
    .bind(Tokens.DragonflyActionValueResolver)
    .toInstance(DefaultDragonflyActionValueResolver)
    .inSingletonScope();
  container
    .bind(Tokens.DragonflyBringAppPrinter)
    .toInstance(DragonflyBringAppPrinter)
    .inSingletonScope();
  injected(
    DragonflyBringAppPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementNamePrinter
  );
  container
    .bind(Tokens.DragonflyPausePrinter)
    .toInstance(DragonflyPausePrinter)
    .inSingletonScope();
  injected(
    DragonflyPausePrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementNamePrinter
  );
  container
    .bind(Tokens.DragonflyActionPrinterDelegateArray)
    .toInstance(DragonflyActionPrinterDelegateArray)
    .inSingletonScope();
  injected(
    DragonflyActionPrinterDelegateArray,
    Tokens.DragonflyBringAppPrinter,
    Tokens.DragonflyPausePrinter
  );
  //
  //
  container
    .bind(Tokens.DragonElementPrinter_Action)
    .toInstance(DelegatingDragonflyActionPrinter)
    .inSingletonScope();
  injected(
    DelegatingDragonflyActionPrinter,
    Tokens.DragonflyActionPrinterDelegateArray
  );
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
