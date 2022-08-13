import { dragonflyExporter } from './data/exports/dragonfly/dragonfly-exporter';
import { jsonExporter } from './data/exports/json-exporter';
import { jsonImporter } from './data/imports/json-importer';
import { Injected } from './di/injector-context';
import { sendKeyValidators } from './features/model/action/send-key/send-key-validators';
import { commandValidators } from './features/model/command/command-validators';
import { contextValidators } from './features/model/context/context-validation';
import { roleKeyValidators } from './features/model/role-key/role-key-validation';
import { specValidators } from './features/model/spec/spec-validators';
import { variableValidators } from './features/model/variable/variable-validators';

export const appDefaultInjectionContext: Injected = {
  importers: {
    json: jsonImporter,
  },
  exporters: {
    json: jsonExporter,
    dragonfly: dragonflyExporter,
  },
  validators: {
    action: sendKeyValidators,
    command: commandValidators,
    context: contextValidators,
    roleKey: roleKeyValidators,
    spec: specValidators,
    variable: variableValidators,
  },
};
