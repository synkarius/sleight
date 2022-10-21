import { ElementType } from '../../data/model/element-types';

interface AbstractOpenGridItem {
  type: ElementType.Type;
  commandId: string;
}

interface EditActionOpenGridItem extends AbstractOpenGridItem {
  type: typeof ElementType.Enum.ACTION;
  actionId: string;
}

interface EditCommandOpenGridItem extends AbstractOpenGridItem {
  type: typeof ElementType.Enum.COMMAND;
}

interface EditContextOpenGridItem extends AbstractOpenGridItem {
  type: typeof ElementType.Enum.CONTEXT;
  contextId: string;
}

interface EditSpecOpenGridItem extends AbstractOpenGridItem {
  type: typeof ElementType.Enum.SPEC;
  specId: string;
}

interface EditVariableOpenGridItem extends AbstractOpenGridItem {
  type: typeof ElementType.Enum.VARIABLE;
  variableId: string;
}

/** Absence of `OpenGridItem` indicates that everything is closed. */
export type OpenGridItem =
  | EditActionOpenGridItem
  | EditCommandOpenGridItem
  | EditContextOpenGridItem
  | EditSpecOpenGridItem
  | EditVariableOpenGridItem;
