import { Container, injected } from 'brandi';
import { DefaultDragonflyMustacheFnsFactory } from '../../../data/exports/dragonfly/dragonfly-mustache-helper-fns';
import { DragonflyBringAppPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-bring-app-action-printer-delegate';
import { DragonflyCallFunctionPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-call-function-action-printer-delegate';
import { DragonflyMimicPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mimic-action-printer-delegate';
import { DragonflyMousePrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-mouse-action-printer-delegate';
import { DragonflyPausePrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-pause-action-printer-delegate';
import { DragonflySendKeyPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-key-action-printer-delegate';
import { DragonflySendTextPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-send-text-action-printer-delegate';
import { DragonflyWaitForWindowPrinter } from '../../../data/exports/dragonfly/element-printers/action-printer-delegates/dragonfly-wait-for-window-action-printer-delegate';
import { DefaultDragonflyActionValueResolver } from '../../../data/exports/dragonfly/element-printers/action-value/dragonfly-action-value-resolver';
import { DelegatingDragonflyActionPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-action-printer';
import { DragonflyCommandPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-command-printer';
import { DragonflyContextPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-context-printer';
import { DragonflyDefaultsPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-defaults-printer';
import { DragonflyFnImportPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-fn-import-printer';
import { DragonflySelectorPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-selector-printer';
import { DragonflySpecPrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-spec-printer';
import { DragonflyVariablePrinter } from '../../../data/exports/dragonfly/element-printers/dragonfly-variable-printer';
import { DefaultElementTokenPrinter } from '../../../data/exports/element-token-printer';
import { DragonflyActionPrinterDelegateArray } from '../../di-collection-types';
import { Tokens } from '../brandi-tokens';

export const bindPrinters = (container: Container): void => {
  /*
   * DRAGONFLY
   */
  // misc
  container
    .bind(Tokens.ElementTokenPrinter)
    .toInstance(DefaultElementTokenPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonflyActionValueResolver)
    .toInstance(DefaultDragonflyActionValueResolver)
    .inSingletonScope();
  // action printer delegates
  bindActionPrinterDelegates(container);
  // printers
  container
    .bind(Tokens.DragonflyPrinter_Action)
    .toInstance(DelegatingDragonflyActionPrinter)
    .inSingletonScope();
  injected(
    DelegatingDragonflyActionPrinter,
    Tokens.DragonflyActionPrinterDelegateArray
  );
  container
    .bind(Tokens.DragonflyPrinter_Command)
    .toInstance(DragonflyCommandPrinter)
    .inSingletonScope();
  injected(
    DragonflyCommandPrinter,
    Tokens.DragonflyPrinter_Spec,
    Tokens.DragonflyPrinter_Action
  );
  container
    .bind(Tokens.DragonflyPrinter_Context)
    .toInstance(DragonflyContextPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonflyPrinter_Fn_Import)
    .toInstance(DragonflyFnImportPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonflyPrinter_Selector)
    .toInstance(DragonflySelectorPrinter)
    .inSingletonScope();
  container
    .bind(Tokens.DragonflyPrinter_Spec)
    .toInstance(DragonflySpecPrinter)
    .inSingletonScope();
  injected(
    DragonflySpecPrinter,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyPrinter_Selector,
    Tokens.DragonflyNegativizerPrinter
  );
  container
    .bind(Tokens.DragonflyPrinter_Variable)
    .toInstance(DragonflyVariablePrinter)
    .inSingletonScope();
  injected(
    DragonflyVariablePrinter,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyPrinter_Selector,
    Tokens.DragonflyNegativizerPrinter
  );
  container
    .bind(Tokens.DragonflyPrinter_Variable_Defaults)
    .toInstance(DragonflyDefaultsPrinter)
    .inSingletonScope();
  injected(DragonflyDefaultsPrinter, Tokens.ElementTokenPrinter);
  container
    .bind(Tokens.DragonflyMustacheFnsFactory)
    .toInstance(DefaultDragonflyMustacheFnsFactory)
    .inSingletonScope();
  injected(
    DefaultDragonflyMustacheFnsFactory,
    Tokens.DragonflyPrinter_Action,
    Tokens.DragonflyPrinter_Command,
    Tokens.DragonflyPrinter_Context,
    Tokens.DragonflyPrinter_Fn_Import,
    Tokens.DragonflyPrinter_Fn_NegativizerWrapper,
    Tokens.DragonflyPrinter_Spec,
    Tokens.DragonflyPrinter_Variable,
    Tokens.DragonflyPrinter_Variable_Defaults,
    Tokens.DragonflyNegativizerPrinter,
    Tokens.DragonflyBuiltinFnsProvider
  );
};

const bindActionPrinterDelegates = (container: Container): void => {
  container
    .bind(Tokens.DragonflyBringAppPrinter)
    .toInstance(DragonflyBringAppPrinter)
    .inSingletonScope();
  injected(
    DragonflyBringAppPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter
  );
  container
    .bind(Tokens.DragonflyCallFunctionPrinter)
    .toInstance(DragonflyCallFunctionPrinter)
    .inSingletonScope();
  injected(
    DragonflyCallFunctionPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyNegativizerPrinter
  );
  container
    .bind(Tokens.DragonflyMimicPrinter)
    .toInstance(DragonflyMimicPrinter)
    .inSingletonScope();
  injected(
    DragonflyMimicPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter
  );
  container
    .bind(Tokens.DragonflyMousePrinter)
    .toInstance(DragonflyMousePrinter)
    .inSingletonScope();
  injected(
    DragonflyMousePrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyNegativizerPrinter,
    Tokens.DragonflyBuiltinFnsProvider
  );
  container
    .bind(Tokens.DragonflyPausePrinter)
    .toInstance(DragonflyPausePrinter)
    .inSingletonScope();
  injected(
    DragonflyPausePrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyNegativizerPrinter
  );
  container
    .bind(Tokens.DragonflySendKeyPrinter)
    .toInstance(DragonflySendKeyPrinter)
    .inSingletonScope();
  injected(
    DragonflySendKeyPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter,
    Tokens.DragonflyNegativizerPrinter
  );
  container
    .bind(Tokens.DragonflySendTextPrinter)
    .toInstance(DragonflySendTextPrinter)
    .inSingletonScope();
  injected(
    DragonflySendTextPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter
  );
  container
    .bind(Tokens.DragonflyWaitForWindowPrinter)
    .toInstance(DragonflyWaitForWindowPrinter)
    .inSingletonScope();
  injected(
    DragonflyWaitForWindowPrinter,
    Tokens.DragonflyActionValueResolver,
    Tokens.ElementTokenPrinter
  );
  container
    .bind(Tokens.DragonflyActionPrinterDelegateArray)
    .toInstance(DragonflyActionPrinterDelegateArray)
    .inSingletonScope();
  injected(
    DragonflyActionPrinterDelegateArray,
    Tokens.DragonflyBringAppPrinter,
    Tokens.DragonflyCallFunctionPrinter,
    Tokens.DragonflyMimicPrinter,
    Tokens.DragonflyMousePrinter,
    Tokens.DragonflyPausePrinter,
    Tokens.DragonflySendKeyPrinter,
    Tokens.DragonflySendTextPrinter,
    Tokens.DragonflyWaitForWindowPrinter
  );
};
