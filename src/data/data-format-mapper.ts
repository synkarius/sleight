import {
  SleightDataArrays,
  SleightDataExportFormat,
  SleightDataInternalFormat,
} from './data-formats';
import { SCHEMA_VERSION } from './exports/schema-version';
import { reduceIded } from './imports/model-update/reduce-ided';

export type FormatMapper = {
  internalFormatToArrays: (
    data: SleightDataInternalFormat
  ) => SleightDataArrays;

  externalFormatToInternal: (
    external: Omit<SleightDataExportFormat, 'version'>
  ) => SleightDataInternalFormat;

  internalFormatToExternal: (
    data: SleightDataInternalFormat
  ) => SleightDataExportFormat;
};

export class DefaultFormatMapper implements FormatMapper {
  internalFormatToArrays(data: SleightDataInternalFormat): SleightDataArrays {
    return {
      actions: Object.values(data.actions),
      commands: Object.values(data.commands),
      contexts: Object.values(data.contexts),
      fns: Object.values(data.fns),
      selectors: Object.values(data.selectors),
      specs: Object.values(data.specs),
      variables: Object.values(data.variables),
    };
  }
  externalFormatToInternal(
    external: Omit<SleightDataExportFormat, 'version'>
  ): SleightDataInternalFormat {
    const result: SleightDataInternalFormat = {
      actions: external.actions.reduce(reduceIded, {}),
      commands: external.commands.reduce(reduceIded, {}),
      contexts: external.contexts.reduce(reduceIded, {}),
      fns: external.fns.reduce(reduceIded, {}),
      selectors: external.selectors.reduce(reduceIded, {}),
      specs: external.specs.reduce(reduceIded, {}),
      variables: external.variables.reduce(reduceIded, {}),
    };
    return result;
  }
  internalFormatToExternal(
    data: SleightDataInternalFormat
  ): SleightDataExportFormat {
    return {
      version: SCHEMA_VERSION,
      ...this.internalFormatToArrays(data),
    };
  }
}
