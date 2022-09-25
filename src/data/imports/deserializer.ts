import {
  DeserializationResult,
  DeserializationResultType,
} from './deserialization-result';
import { SleightDataExportFormat } from '../data-formats';
import { FormatMapper } from '../data-format-mapper';

/** Parses external format; converts to internal format. */
export type Deserializer = {
  deserialize: (data: string) => DeserializationResult;
};

export class JsonDeserializer implements Deserializer {
  constructor(private formatMapper: FormatMapper) {}

  deserialize(data: string): DeserializationResult {
    try {
      const parsed = JSON.parse(data) as SleightDataExportFormat;
      const internalFormat = this.formatMapper.externalFormatToInternal(parsed);
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
  }
}
