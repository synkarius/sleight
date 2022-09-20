import {
  DeserializationResult,
  DeserializationResultType,
} from './deserialization-result';
import { SleightDataExportFormat } from '../data-formats';
import { getDefaultInjectionContext } from '../../di/app-default-injection-context';

/** Parses external format; converts to internal format. */
export type Deserializer = {
  deserialize: (data: string) => DeserializationResult;
};

export const getJsonDeserializer: () => Deserializer = () => ({
  deserialize: (data: string): DeserializationResult => {
    const injected = getDefaultInjectionContext();
    const formatMapper = injected.mappers.dataFormat;
    try {
      const parsed = JSON.parse(data) as SleightDataExportFormat;
      const internalFormat = formatMapper.externalFormatToInternal(parsed);
      return {
        type: DeserializationResultType.VALID,
        version: parsed.version,
        data: internalFormat,
      };
    } catch (e: unknown) {
      return {
        type: DeserializationResultType.INVALID,
      };
    }
  },
});
