import { SleightDataInternalFormat } from '../data-formats';
import { Action } from '../model/action/action';
import { Command } from '../model/command/command';
import { Context } from '../model/context/context';
import { SpecDTO } from '../model/spec/spec-dto';
import { VariableDTO } from '../model/variable/variable-dto';
import { ModelUpdateEvaluator } from './model-update/model-update-evaluator';
import { SelectorModelUpdateEvaluator } from './model-update/selector-model-update-evaluator';

/** Merges import data over existing data. */
export type ImportDataMerger = {
  merge: (
    base: SleightDataInternalFormat,
    imported: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

export class CopyingImportDataMerger implements ImportDataMerger {
  constructor(
    private actionModelUpdateEvaluator: ModelUpdateEvaluator<Action>,
    private commandModelUpdateEvaluator: ModelUpdateEvaluator<Command>,
    private contextModelUpdateEvaluator: ModelUpdateEvaluator<Context>,
    private selectorModelUpdateEvaluator: SelectorModelUpdateEvaluator,
    private specModelUpdateEvaluator: ModelUpdateEvaluator<SpecDTO>,
    private variableModelUpdateEvaluator: ModelUpdateEvaluator<VariableDTO>
  ) {}

  merge(
    base: SleightDataInternalFormat,
    deserialized: SleightDataInternalFormat
  ): SleightDataInternalFormat {
    const baseCopy = structuredClone(base);
    const deserializedCopy = structuredClone(deserialized);

    const baseCopyActions = Object.values(baseCopy.actions);
    const evaluatedActions = Object.values(deserializedCopy.actions).map(
      (action) =>
        this.actionModelUpdateEvaluator.evaluate(action, baseCopyActions)
    );
    const baseCopyCommands = Object.values(baseCopy.commands);
    const evaluatedCommands = Object.values(deserializedCopy.commands).map(
      (command) =>
        this.commandModelUpdateEvaluator.evaluate(command, baseCopyCommands)
    );
    // TODO: element evaluations, then model updates based on those evaluations

    return {
      ...baseCopy,
      ...deserializedCopy,
    };
  }
}
