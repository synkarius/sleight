import { SCHEMA_VERSION } from './schema-version';

type ExportType = {
  name: string;
  extension: string;
};

export const DRAGONFLY: ExportType = {
  name: 'dragonfly',
  extension: 'py',
};
export const JSON: ExportType = {
  name: 'sleight',
  extension: 'json',
};

export const getExportFileName = (exportType: ExportType): string => {
  return (
    exportType.name +
    '-export-v' +
    SCHEMA_VERSION +
    '-' +
    Date.now() +
    '.' +
    exportType.extension
  );
};
