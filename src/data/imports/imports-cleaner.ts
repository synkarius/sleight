import { Cleaner } from '../../core/cleaners/cleaner';
import { FormatMapper } from '../data-format-mapper';
import { SleightDataArrays, SleightDataInternalFormat } from '../data-formats';
import { Action } from '../model/action/action';
import { Command } from '../model/command/command';
import { Context } from '../model/context/context';
import { Fn } from '../model/fn/fn';
import { SelectorDTO } from '../model/selector/selector-dto';
import { SpecDTO } from '../model/spec/spec-dto';
import { VariableDTO } from '../model/variable/variable-dto';

/** Clean data -- should remove values not in format. */
export type ImportsCleaner = {
  cleanData: (data: SleightDataInternalFormat) => SleightDataInternalFormat;
};

export class DefaultImportsCleaner implements ImportsCleaner {
  constructor(
    private formatMapper: FormatMapper,
    private actionCleaner: Cleaner<Action>,
    private commandCleaner: Cleaner<Command>,
    private contextCleaner: Cleaner<Context>,
    private fnCleaner: Cleaner<Fn>,
    private selectorCleaner: Cleaner<SelectorDTO>,
    private specCleaner: Cleaner<SpecDTO>,
    private variableCleaner: Cleaner<VariableDTO>
  ) {}

  cleanData(data: SleightDataInternalFormat): SleightDataInternalFormat {
    const arrays: SleightDataArrays =
      this.formatMapper.internalFormatToArrays(data);
    const cleanedValues: SleightDataArrays = {
      actions: this.actionCleaner.clean(arrays.actions),
      commands: this.commandCleaner.clean(arrays.commands),
      contexts: this.contextCleaner.clean(arrays.contexts),
      fns: this.fnCleaner.clean(arrays.fns),
      selectors: this.selectorCleaner.clean(arrays.selectors),
      specs: this.specCleaner.clean(arrays.specs),
      variables: this.variableCleaner.clean(arrays.variables),
    };
    // convert back to internal format
    const internalFormat =
      this.formatMapper.externalFormatToInternal(cleanedValues);
    return internalFormat;
  }
}
