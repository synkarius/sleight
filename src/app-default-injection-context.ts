import { getDragonflyExporter } from './data/exports/dragonfly/dragonfly-exporter';
import { getJsonExporter } from './data/exports/json-exporter';
import { getJsonImporter } from './data/imports/json-importer';
import { Injected } from './di/injector-context';
import {
  getCrossSliceActionValidators,
  getCrossSliceCommandValidators,
  getCrossSliceContextValidators,
  getCrossSliceRoleKeyValidators,
  getCrossSliceSpecValidators,
  getCrossSliceVariableValidators,
} from './features/cross-slice-validation-fns';
import { getDefaultActionNamer } from './features/model/action/action-default-namer';
import { getActionValidators } from './features/model/action/action-validators';
import { getPauseValidators } from './features/model/action/pause/pause-validators';
import { getSendKeyValidators } from './features/model/action/send-key/send-key-validators';
import { getDefaultCommandNamer } from './features/model/command/command-default-namer';
import { getCommandValidators } from './features/model/command/command-validators';
import { getDefaultContextNamer } from './features/model/context/context-default-namer';
import { getContextValidators } from './features/model/context/context-validators';
import { getRoleKeyValidators } from './features/model/role-key/role-key-validation';
import { getSelectorDomainMapper } from './features/model/selector/data/selector-domain-mapper';
import { getSpecDomainMapper } from './features/model/spec/data/spec-domain-mapper';
import { getDefaultSpecNamer } from './features/model/spec/spec-default-namer';
import { getSpecValidators } from './features/model/spec/spec-validators';
import { getVariableDomainMapper } from './features/model/variable/data/variable-domain-mapper';
import { getDefaultVariableNamer } from './features/model/variable/variable-default-namer';
import { getVariableValidators } from './features/model/variable/variable-validators';

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
        roleKey: [
          ...getRoleKeyValidators(),
          ...getCrossSliceRoleKeyValidators(),
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
