import { SleightDataInternalFormat } from '../../data-formats';
import { createMustacheFn, MustacheFn } from '../util-mustache-fns';
import { MapUtil } from '../../../core/common/map-util';
import { Printer } from '../printer';
import { Action } from '../../model/action/action';
import { Command } from '../../model/command/command';
import { Context } from '../../model/context/context';
import { SpecDTO } from '../../model/spec/spec-dto';
import { VariableDTO } from '../../model/variable/variable-dto';
import { Fn } from '../../model/fn/fn';
import { Preferences } from '../../preferences/preferences';
import { DragonflyNegativizerPrinter } from './element-printers/negativizer/dragonfly-negativizer-printer-augmenter';
import { isSome } from '../../../core/common/maybe';
import { DragonflyBuiltinFnsProvider } from './builtin-fns/builtin-fns-supplier';
import { reduceIded } from '../../imports/model-update/reduce-ided';

type DragonflyMustacheFns = {
  printAction: () => MustacheFn;
  printCommand: () => MustacheFn;
  printContext: () => MustacheFn;
  printFnImport: () => MustacheFn;
  printSpec: () => MustacheFn;
  printVariable: () => MustacheFn;
  printDefault: () => MustacheFn;
  printNegativizerDefault: () => MustacheFn;
  printNegativizerWrapper: () => MustacheFn;
};

export type DragonflyMustacheFnsFactory = {
  getDragonflyMustacheFns: (
    data: SleightDataInternalFormat,
    prefs: Preferences
  ) => DragonflyMustacheFns;
};

export class DefaultDragonflyMustacheFnsFactory
  implements DragonflyMustacheFnsFactory
{
  constructor(
    private actionPrinter: Printer<Action>,
    private commandPrinter: Printer<Command>,
    private contextPrinter: Printer<Context>,
    private fnImportPrinter: Printer<Fn>,
    private fnNegativizerPrinter: Printer<Fn>,
    private specPrinter: Printer<SpecDTO>,
    private variablePrinter: Printer<VariableDTO>,
    private defaultPrinter: Printer<VariableDTO>,
    private negativizerAugmenter: DragonflyNegativizerPrinter,
    private builtinFnsProvider: DragonflyBuiltinFnsProvider
  ) {}

  getDragonflyMustacheFns(
    data: SleightDataInternalFormat,
    prefs: Preferences
  ): DragonflyMustacheFns {
    return {
      printAction: createMustacheFn((id, r) => {
        const action = MapUtil.getOrThrow(data.actions, r(id));
        return this.actionPrinter.printItem(action, data, prefs);
      }),
      printCommand: createMustacheFn((id, r) => {
        const command = MapUtil.getOrThrow(data.commands, r(id));
        return this.commandPrinter.printItem(command, data, prefs);
      }),
      printContext: createMustacheFn((id, r) => {
        const context = MapUtil.getOrThrow(data.contexts, r(id));
        return this.contextPrinter.printItem(context, data, prefs);
      }),
      printFnImport: createMustacheFn((id, r) => {
        const fn = MapUtil.getOrThrow(data.fns, r(id));
        return this.fnImportPrinter.printItem(fn, data, prefs);
      }),
      printSpec: createMustacheFn((id, r) => {
        const spec = MapUtil.getOrThrow(data.specs, r(id));
        return this.specPrinter.printItem(spec, data, prefs);
      }),
      printVariable: createMustacheFn((id, r) => {
        const variable = MapUtil.getOrThrow(data.variables, r(id));
        return this.variablePrinter.printItem(variable, data, prefs);
      }),
      printDefault: createMustacheFn((id, r) => {
        const variable = MapUtil.getOrThrow(data.variables, r(id));
        return this.defaultPrinter.printItem(variable, data, prefs);
      }),
      printNegativizerDefault: createMustacheFn((id, r) => {
        const variableId = r(id);
        const maybeNegativizerDefault =
          this.negativizerAugmenter.printForDefaults(variableId, data);
        return isSome(maybeNegativizerDefault)
          ? `${maybeNegativizerDefault.value},`
          : '';
      }),
      printNegativizerWrapper: createMustacheFn((id, r) => {
        const builtins = this.builtinFnsProvider.getAll();
        const fromData = Object.values(data.fns);
        const combined: Record<string, Fn> = [...builtins, ...fromData].reduce(
          reduceIded,
          {}
        );
        const fnId = r(id);
        const fn = MapUtil.getOrThrow(combined, fnId);
        return this.fnNegativizerPrinter.printItem(fn, data, prefs);
      }),
    };
  }
}
