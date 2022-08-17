import { getDragonflyExporter } from './data/exports/dragonfly/dragonfly-exporter';
import { getJsonExporter } from './data/exports/json-exporter';
import { getJsonImporter } from './data/imports/json-importer';
import { Injected } from './di/injector-context';
import { getActionValidators } from './features/model/action/action-validators';
import { getSendKeyValidators } from './features/model/action/send-key/send-key-validators';
import { getCommandValidators } from './features/model/command/command-validators';
import { getContextValidators } from './features/model/context/context-validation';
import { getRoleKeyValidators } from './features/model/role-key/role-key-validation';
import { getSelectorDomainMapper } from './features/model/selector/data/selector-domain-mapper';
import { getSpecDomainMapper } from './features/model/spec/data/spec-domain-mapper';
import { getSpecValidators } from './features/model/spec/spec-validators';
import { getVariableDomainMapper } from './features/model/variable/data/variable-domain-mapper';
import { getVariableValidators } from './features/model/variable/variable-validators';

export const appDefaultInjectionContext: Injected = {
  importers: {
    json: getJsonImporter(),
  },
  exporters: {
    json: getJsonExporter(),
    dragonfly: getDragonflyExporter(),
  },
  validators: {
    action: [...getActionValidators(), ...getSendKeyValidators()],
    command: getCommandValidators(),
    context: getContextValidators(),
    roleKey: getRoleKeyValidators(),
    spec: getSpecValidators(),
    variable: getVariableValidators(),
  },
  mappers: {
    selector: getSelectorDomainMapper(),
    spec: getSpecDomainMapper(),
    variable: getVariableDomainMapper(),
  },
};
