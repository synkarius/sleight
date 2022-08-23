import { SleightDataInternalFormat } from '../../data/data-formats';
import { Command } from '../../features/model/command/command';
import { Context } from '../../features/model/context/context';

export type DataTransformFunction<T> = (
  t: T,
  data: SleightDataInternalFormat
) => SleightDataInternalFormat;

type Mutable<T> = { -readonly [P in keyof T]: Mutable<T[P]> };

export const addEditingCommandToDataCopy: DataTransformFunction<Command> = (
  editing,
  data
) => {
  const dataDeepCopy: Mutable<SleightDataInternalFormat> =
    structuredClone(data);
  dataDeepCopy.commands[editing.id] = editing;
  return dataDeepCopy;
};

export const addEditingContextToDataCopy: DataTransformFunction<Context> = (
  editing,
  data
) => {
  const dataDeepCopy: Mutable<SleightDataInternalFormat> =
    structuredClone(data);
  dataDeepCopy.contexts[editing.id] = editing;
  return dataDeepCopy;
};
