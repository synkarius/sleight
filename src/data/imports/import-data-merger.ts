import { SleightDataInternalFormat } from '../data-formats';
import { Action } from '../model/action/action';
import { Command } from '../model/command/command';
import { Context } from '../model/context/context';
import { SpecDTO } from '../model/spec/spec-dto';
import { VariableDTO } from '../model/variable/variable-dto';
import { ModelUpdateEvaluator } from './role-key-overriding/model-update-evaluator';
import { createModelUpdateEvaluator } from './role-key-overriding/model-update-evaluator-factory';
import {
  getSelectorModelUpdateEvaluator,
  SelectorModelUpdateEvaluator,
} from './role-key-overriding/selector-model-update-evaluator';

/** Merges import data over existing data. */
export type ImportDataMerger = {
  merge: (
    base: SleightDataInternalFormat,
    imported: SleightDataInternalFormat
  ) => SleightDataInternalFormat;
};

const actionEvaluator: ModelUpdateEvaluator<Action> =
  createModelUpdateEvaluator();
const commandEvaluator: ModelUpdateEvaluator<Command> =
  createModelUpdateEvaluator();
const contextEvaluator: ModelUpdateEvaluator<Context> =
  createModelUpdateEvaluator();
const selectorEvaluator: SelectorModelUpdateEvaluator =
  getSelectorModelUpdateEvaluator();
const specEvaluator: ModelUpdateEvaluator<SpecDTO> =
  createModelUpdateEvaluator();
const variableEvaluator: ModelUpdateEvaluator<VariableDTO> =
  createModelUpdateEvaluator();

export const getCopyingImportDataMerger = (): ImportDataMerger => ({
  merge: (base, deserialized) => {
    const baseCopy = structuredClone(base);
    const deserializedCopy = structuredClone(deserialized);

    // TODO: element evaluations, then model updates based on those evaluations

    return {
      ...baseCopy,
      ...deserializedCopy,
    };
  },
});
