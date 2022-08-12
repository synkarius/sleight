import { Exporter } from './exporter';
import { SCHEMA_VERSION } from './schema-version';

export const jsonExporter: Exporter = {
  export: (
    actions,
    commands,
    contexts,
    roleKeys,
    selectors,
    specs,
    variables
  ) => [
    JSON.stringify({
      version: SCHEMA_VERSION,
      actions: Object.values(actions),
      commands: Object.values(commands),
      contexts: Object.values(contexts),
      roleKeys: Object.values(roleKeys),
      selectors: Object.values(selectors),
      specs: Object.values(specs),
      variables: Object.values(variables),
    }),
  ],
};
