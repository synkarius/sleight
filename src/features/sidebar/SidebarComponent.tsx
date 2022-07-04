import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
import {
  clearEditingAction,
  createNewEditingAction,
  selectAction,
} from '../model/action/action-reducers';
import { createSendKeyPressAction } from '../model/action/send-key/send-key';
import { createCommand } from '../model/command/command';
import {
  createNewEditingCommand,
  selectCommand,
} from '../model/command/command-reducers';
import { ElementType } from '../model/common/element-types';
import {
  clearEditingContext,
  createNewEditingContext,
  selectContext,
} from '../model/context/context-reducers';
import {
  clearEditingVariable,
  createNewEditingVariable,
  selectVariable,
} from '../model/variable/variable-reducers';
import { createText } from '../model/variable/text/text';
import {
  clearEditingRoleKey,
  createNewEditingRoleKey,
  selectRoleKey,
} from '../model/role-key/role-key-reducers';
import { createSelector } from '../model/selector/selector';
import { createNewSelector } from '../model/selector/selector-reducers';
import { createSpec } from '../model/spec/spec';
import {
  clearEditingSpec,
  createNewEditingSpec,
  selectSpec,
} from '../model/spec/spec-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';
import { createContext } from '../model/context/context';
import { createRoleKey } from '../model/role-key/role-key';

interface Item extends Named, Ided {}

export interface ItemGroup {
  type: string;
  items: Item[];
  createFn: () => void;
  selectFn: (variableId: string) => void;
  clearFn: () => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const commandsSaved = useAppSelector((state) => state.context.saved);
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const roleKeysSaved = useAppSelector((state) => state.roleKey.saved);
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const actions = Object.values(actionsSaved);
  const commands = Object.values(commandsSaved);
  const contexts = Object.values(contextsSaved);
  const specs = Object.values(specsSaved);
  const roleKeys = Object.values(roleKeysSaved).map((rk) => {
    return { id: rk.id, name: rk.value };
  });
  const variables = Object.values(variablesSaved);

  // TODO: move these elsewhere & restructure
  const groups: ItemGroup[] = [
    {
      type: ElementType.ACTION,
      items: actions,
      createFn: () =>
        dispatch(createNewEditingAction(createSendKeyPressAction())),
      selectFn: (id) => dispatch(selectAction(id)),
      clearFn: () => dispatch(clearEditingAction()),
    },
    {
      type: ElementType.COMMAND,
      items: commands,
      createFn: () => dispatch(createNewEditingCommand(createCommand())),
      selectFn: (id) => dispatch(selectCommand(id)),
      clearFn: () => dispatch(clearEditingContext()),
    },
    {
      type: ElementType.CONTEXT,
      items: contexts,
      createFn: () => dispatch(createNewEditingContext(createContext())),
      selectFn: (id) => dispatch(selectContext(id)),
      clearFn: () => dispatch(clearEditingContext()),
    },
    {
      type: ElementType.ROLE_KEY,
      items: roleKeys,
      createFn: () => dispatch(createNewEditingRoleKey(createRoleKey())),
      selectFn: (id) => dispatch(selectRoleKey(id)),
      clearFn: () => dispatch(clearEditingRoleKey()),
    },
    {
      type: ElementType.SPEC,
      items: specs,
      createFn: () => {
        // TODO: this way creates orphan selectors - clean them up
        const selector = createSelector();
        const spec = createSpec(selector.id);
        dispatch(createNewSelector(selector));
        dispatch(createNewEditingSpec(spec));
      },
      selectFn: (id) => dispatch(selectSpec(id)),
      clearFn: () => dispatch(clearEditingSpec()),
    },
    {
      type: ElementType.VARIABLE,
      items: variables,
      createFn: () => dispatch(createNewEditingVariable(createText())),
      selectFn: (variableId) => dispatch(selectVariable(variableId)),
      clearFn: () => dispatch(clearEditingVariable()),
    },
  ];

  const clearAllWorkspaces = () => groups.forEach((group) => group.clearFn());

  return (
    <Accordion defaultActiveKey={['2']} flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type}
          eventKey={'' + index}
          group={group}
          clearAllFn={clearAllWorkspaces}
        />
      ))}
    </Accordion>
  );
};
