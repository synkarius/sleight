import { getDefaultInjectionContext } from '../../di/app-default-injection-context';
import { Exporter } from './exporter';

export const getJsonExporter: () => Exporter = () => ({
  export: (data) => {
    const injected = getDefaultInjectionContext();
    const formatMapper = injected.mappers.dataFormat;
    //
    return [JSON.stringify(formatMapper.internalFormatToExternal(data))];
  },
});
