import { ActionValue } from '../model/action/action-value';

export const enum PrintableValueType {
  ACTION_VALUE,
  STRING_VALUE,
}

type PrintableActionValue = {
  type: PrintableValueType.ACTION_VALUE;
  actionValue: ActionValue;
};

export const isPrintableActionValue = (
  pv: PrintableValue
): pv is PrintableActionValue => pv.type === PrintableValueType.ACTION_VALUE;

type PrintableStringValue = {
  type: PrintableValueType.STRING_VALUE;
  value: string;
};

export const isPrintableStringValue = (
  pv: PrintableValue
): pv is PrintableStringValue => pv.type === PrintableValueType.STRING_VALUE;

export type PrintableValue = PrintableActionValue | PrintableStringValue;
