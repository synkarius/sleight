import { FormatMapper } from '../data-format-mapper';
import { SleightDataInternalFormat } from '../data-formats';
import { Preferences } from '../preferences/preferences';
import { Exporter } from './exporter';

export class JsonExporter implements Exporter {
  constructor(private formatMapper: FormatMapper) {}

  export(data: SleightDataInternalFormat, _prefs: Preferences): string[] {
    return [JSON.stringify(this.formatMapper.internalFormatToExternal(data))];
  }
}
