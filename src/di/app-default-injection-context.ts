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
import { getDefaultActionNamer } from '../ui/model/action/action-default-namer';
import { getActionValidators } from '../ui/model/action/action-validators';
import { getPauseValidators } from '../ui/model/action/pause/pause-validators';
import { getSendKeyValidators } from '../ui/model/action/send-key/send-key-validators';
import { getDefaultCommandNamer } from '../ui/model/command/command-default-namer';
import { getCommandValidators } from '../ui/model/command/command-validators';
import { getDefaultContextNamer } from '../ui/model/context/context-default-namer';
import { getContextValidators } from '../ui/model/context/context-validators';
import { getSelectorDomainMapper } from '../ui/model/selector/data/selector-domain-mapper';
import { getSpecDomainMapper } from '../ui/model/spec/data/spec-domain-mapper';
import { getDefaultSpecNamer } from '../ui/model/spec/spec-default-namer';
import { getSpecValidators } from '../ui/model/spec/spec-validators';
import { getVariableDomainMapper } from '../ui/model/variable/data/variable-domain-mapper';
import { getDefaultVariableNamer } from '../ui/model/variable/variable-default-namer';
import { getVariableValidators } from '../ui/model/variable/variable-validators';

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
