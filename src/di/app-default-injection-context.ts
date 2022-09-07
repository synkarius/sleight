import { getDragonflyExporter } from '../data/exports/dragonfly/dragonfly-exporter';
import { getJsonExporter } from '../data/exports/json-exporter';
import { getJsonImporter } from '../data/imports/json-importer';
import { Injected } from './injector-context';
import {
  getCrossSliceActionValidators,
  getCrossSliceCommandValidators,
  getCrossSliceContextValidators,
  getCrossSliceSpecValidators,
  getCrossSliceVariableValidators,
} from '../validation/cross-slice/cross-slice-validation-fns';
import { getDefaultActionNamer } from '../core/default-namers/action-default-namer';
import { getActionValidators } from '../core/validators/action-validators';
import { getPauseValidators } from '../core/validators/action/pause-validators';
import { getSendKeyValidators } from '../core/validators/action/send-key-validators';
import { getDefaultCommandNamer } from '../core/default-namers/command-default-namer';
import { getCommandValidators } from '../core/validators/command-validators';
import { getDefaultContextNamer } from '../core/default-namers/context-default-namer';
import { getContextValidators } from '../core/validators/context-validators';
import { getSelectorDomainMapper } from '../core/mappers/selector-domain-mapper';
import { getSpecDomainMapper } from '../core/mappers/spec-domain-mapper';
import { getDefaultSpecNamer } from '../core/default-namers/spec-default-namer';
import { getSpecValidators } from '../core/validators/spec-validators';
import { getVariableDomainMapper } from '../core/mappers/variable-domain-mapper';
import { getDefaultVariableNamer } from '../core/default-namers/variable-default-namer';
import { getVariableValidators } from '../core/validators/variable-validators';

let instance: Injected | undefined = undefined;

export const getDefaultInjectionContext = (): Injected => {
  if (!instance) {
    instance = {
      importers: {
        json: getJsonImporter(),
      },
      exporters: {
        json: getJsonExporter(),
        dragonfly: getDragonflyExporter(),
      },
      validators: {
        action: [
          ...getActionValidators(),
          ...getSendKeyValidators(),
          ...getPauseValidators(),
          ...getCrossSliceActionValidators(),
        ],
        command: [
          ...getCommandValidators(),
          ...getCrossSliceCommandValidators(),
        ],
        context: [
          ...getContextValidators(),
          ...getCrossSliceContextValidators(),
        ],
        spec: [...getSpecValidators(), ...getCrossSliceSpecValidators()],
        variable: [
          ...getVariableValidators(),
          ...getCrossSliceVariableValidators(),
        ],
      },
      mappers: {
        selector: getSelectorDomainMapper(),
        spec: getSpecDomainMapper(),
        variable: getVariableDomainMapper(),
      },
      default: {
        namers: {
          action: getDefaultActionNamer(),
          command: getDefaultCommandNamer(),
          context: getDefaultContextNamer(),
          spec: getDefaultSpecNamer(),
          variable: getDefaultVariableNamer(),
        },
      },
    };
  }
  return instance;
};
