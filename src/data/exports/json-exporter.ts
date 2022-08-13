import { Exporter } from './exporter';
import { SCHEMA_VERSION } from './schema-version';

export const jsonExporter: Exporter = {
  export: (data) => [
    JSON.stringify({
      version: SCHEMA_VERSION,
      ...data,
    }),
  ],
};
