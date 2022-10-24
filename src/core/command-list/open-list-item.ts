import { ElementType } from '../../data/model/element-types';

interface AbstractOpenCommandListItem {
  type: ElementType.Type;
  commandId: string;
}

interface EditActionOpenCommandListItem extends AbstractOpenCommandListItem {
  type: typeof ElementType.Enum.ACTION;
  actionId: string;
}

interface EditCommandOpenCommandListItem extends AbstractOpenCommandListItem {
  type: typeof ElementType.Enum.COMMAND;
}

interface EditContextOpenCommandListItem extends AbstractOpenCommandListItem {
  type: typeof ElementType.Enum.CONTEXT;
  contextId: string;
}

interface EditSpecOpenCommandListItem extends AbstractOpenCommandListItem {
  type: typeof ElementType.Enum.SPEC;
  specId: string;
}

interface EditVariableOpenCommandListItem extends AbstractOpenCommandListItem {
  type: typeof ElementType.Enum.VARIABLE;
  variableId: string;
}

/** Absence of `OpenCommandListItem` indicates that everything is closed. */
export type OpenCommandListItem =
  | EditActionOpenCommandListItem
  | EditCommandOpenCommandListItem
  | EditContextOpenCommandListItem
  | EditSpecOpenCommandListItem
  | EditVariableOpenCommandListItem;
