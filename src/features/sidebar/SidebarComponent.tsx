import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAction } from '../model/action/action-reducers';
import { createCommand } from '../model/command/command';
import { selectCommand } from '../model/command/command-reducers';
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
import { selectRoleKey } from '../model/role-key/role-key-reducers';
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
import { SidebarSection } from './sidebar';
import { setFocus } from '../menu/focus/focus-reducers';

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const commandsSaved = useAppSelector((state) => state.command.saved);
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const roleKeysSaved = useAppSelector((state) => state.roleKey.saved);
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const actionSection: SidebarSection = {
    type: ElementType.ACTION,
    items: Object.values(actionsSaved),
    createFn: () => dispatch(setFocus(ElementType.ACTION)),
    selectFn: (id) => {
      dispatch(selectAction(id));
      dispatch(setFocus(ElementType.ACTION));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const commandSection: SidebarSection = {
    type: ElementType.COMMAND,
    items: Object.values(commandsSaved),
    createFn: () => dispatch(setFocus(ElementType.COMMAND)),
    selectFn: (id) => {
      dispatch(selectCommand(id));
      dispatch(setFocus(ElementType.COMMAND));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const contextSection: SidebarSection = {
    type: ElementType.CONTEXT,
    items: Object.values(contextsSaved),
    createFn: () => dispatch(createNewEditingContext(createContext())),
    selectFn: (id) => dispatch(selectContext(id)),
    clearFn: () => dispatch(clearEditingContext()),
  };
  const roleKeySection: SidebarSection = {
    type: ElementType.ROLE_KEY,
    items: Object.values(roleKeysSaved).map((rk) => {
      return { id: rk.id, name: rk.value };
    }),
    createFn: () => dispatch(setFocus(ElementType.ROLE_KEY)),
    selectFn: (id) => {
      dispatch(selectRoleKey(id));
      dispatch(setFocus(ElementType.ROLE_KEY));
    },
    clearFn: () => dispatch(selectRoleKey(undefined)),
  };
  const specSection: SidebarSection = {
    type: ElementType.SPEC,
    items: Object.values(specsSaved),
    createFn: () => {
      // TODO: this way creates orphan selectors - clean them up --> will get cleaned up by new (local) validators
      const selector = createSelector();
      const spec = createSpec(selector.id);
      dispatch(createNewSelector(selector));
      dispatch(createNewEditingSpec(spec));
    },
    selectFn: (id) => dispatch(selectSpec(id)),
    clearFn: () => dispatch(clearEditingSpec()),
  };
  const variableSection: SidebarSection = {
    type: ElementType.VARIABLE,
    items: Object.values(variablesSaved),
    createFn: () => dispatch(createNewEditingVariable(createText())),
    selectFn: (variableId) => dispatch(selectVariable(variableId)),
    clearFn: () => dispatch(clearEditingVariable()),
  };

  const groups: SidebarSection[] = [
    actionSection,
    commandSection,
    contextSection,
    roleKeySection,
    specSection,
    variableSection,
  ];

  return (
    <Accordion /*defaultActiveKey={['2']}*/ flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type}
          eventKey={'' + index}
          group={group}
          clearAllFn={() => {
            dispatch(setFocus(undefined));
            groups.forEach((group) => group.clearFn());
          }}
        />
      ))}
    </Accordion>
  );
};
