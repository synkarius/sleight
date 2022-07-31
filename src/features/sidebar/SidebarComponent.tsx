import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAction } from '../model/action/action-reducers';
import { selectCommand } from '../model/command/command-reducers';
import { ElementType } from '../model/common/element-types';
import { selectContext } from '../model/context/context-reducers';
import {
  clearEditingVariable,
  createNewEditingVariable,
  selectVariable,
} from '../model/variable/variable-reducers';
import { createText } from '../model/variable/text/text';
import { selectRoleKey } from '../model/role-key/role-key-reducers';
import { selectSpec } from '../model/spec/spec-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';
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
    type: ElementType.Enum.ACTION,
    items: Object.values(actionsSaved),
    createFn: () => dispatch(setFocus(ElementType.Enum.ACTION)),
    selectFn: (id) => {
      dispatch(selectAction(id));
      dispatch(setFocus(ElementType.Enum.ACTION));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const commandSection: SidebarSection = {
    type: ElementType.Enum.COMMAND,
    items: Object.values(commandsSaved),
    createFn: () => dispatch(setFocus(ElementType.Enum.COMMAND)),
    selectFn: (id) => {
      dispatch(selectCommand(id));
      dispatch(setFocus(ElementType.Enum.COMMAND));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const contextSection: SidebarSection = {
    type: ElementType.Enum.CONTEXT,
    items: Object.values(contextsSaved),
    createFn: () => dispatch(setFocus(ElementType.Enum.CONTEXT)),
    selectFn: (id) => {
      dispatch(selectContext(id));
      dispatch(setFocus(ElementType.Enum.CONTEXT));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const roleKeySection: SidebarSection = {
    type: ElementType.Enum.ROLE_KEY,
    items: Object.values(roleKeysSaved).map((rk) => {
      return { id: rk.id, name: rk.value };
    }),
    createFn: () => dispatch(setFocus(ElementType.Enum.ROLE_KEY)),
    selectFn: (id) => {
      dispatch(selectRoleKey(id));
      dispatch(setFocus(ElementType.Enum.ROLE_KEY));
    },
    clearFn: () => dispatch(selectRoleKey(undefined)),
  };
  const specSection: SidebarSection = {
    type: ElementType.Enum.SPEC,
    items: Object.values(specsSaved),
    createFn: () => dispatch(setFocus(ElementType.Enum.SPEC)),
    selectFn: (id) => {
      dispatch(selectSpec(id));
      dispatch(setFocus(ElementType.Enum.SPEC));
    },
    clearFn: () => dispatch(setFocus(undefined)),
  };
  const variableSection: SidebarSection = {
    type: ElementType.Enum.VARIABLE,
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
