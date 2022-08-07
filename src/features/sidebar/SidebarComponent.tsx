import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAction } from '../model/action/action-reducers';
import { selectCommand } from '../model/command/command-reducers';
import { ElementType } from '../model/common/element-types';
import { selectContext } from '../model/context/context-reducers';
import { selectVariable } from '../model/variable/variable-reducers';
import { selectRoleKey } from '../model/role-key/role-key-reducers';
import { selectSpec } from '../model/spec/spec-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';
import { SidebarSection } from './sidebar';
import { setFocus } from '../menu/focus/focus-reducers';

export const SidebarComponent = () => {
  const reduxDispatch = useAppDispatch();
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const commandsSaved = useAppSelector((state) => state.command.saved);
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const roleKeysSaved = useAppSelector((state) => state.roleKey.saved);
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const actionSection: SidebarSection = {
    type: ElementType.Enum.ACTION,
    items: Object.values(actionsSaved),
    createFn: () => {
      reduxDispatch(selectAction());
      reduxDispatch(setFocus(ElementType.Enum.ACTION));
    },
    selectFn: (id) => {
      reduxDispatch(selectAction(id));
      reduxDispatch(setFocus(ElementType.Enum.ACTION));
    },
  };
  const commandSection: SidebarSection = {
    type: ElementType.Enum.COMMAND,
    items: Object.values(commandsSaved),
    createFn: () => {
      reduxDispatch(selectCommand());
      reduxDispatch(setFocus(ElementType.Enum.COMMAND));
    },
    selectFn: (id) => {
      reduxDispatch(selectCommand(id));
      reduxDispatch(setFocus(ElementType.Enum.COMMAND));
    },
  };
  const contextSection: SidebarSection = {
    type: ElementType.Enum.CONTEXT,
    items: Object.values(contextsSaved),
    createFn: () => {
      reduxDispatch(selectContext());
      reduxDispatch(setFocus(ElementType.Enum.CONTEXT));
    },
    selectFn: (id) => {
      reduxDispatch(selectContext(id));
      reduxDispatch(setFocus(ElementType.Enum.CONTEXT));
    },
  };
  const roleKeySection: SidebarSection = {
    type: ElementType.Enum.ROLE_KEY,
    items: Object.values(roleKeysSaved).map((rk) => {
      return { id: rk.id, name: rk.value };
    }),
    createFn: () => {
      reduxDispatch(selectRoleKey());
      reduxDispatch(setFocus(ElementType.Enum.ROLE_KEY));
    },
    selectFn: (id) => {
      reduxDispatch(selectRoleKey(id));
      reduxDispatch(setFocus(ElementType.Enum.ROLE_KEY));
    },
  };
  const specSection: SidebarSection = {
    type: ElementType.Enum.SPEC,
    items: Object.values(specsSaved),
    createFn: () => {
      reduxDispatch(selectSpec());
      reduxDispatch(setFocus(ElementType.Enum.SPEC));
    },
    selectFn: (id) => {
      reduxDispatch(selectSpec(id));
      reduxDispatch(setFocus(ElementType.Enum.SPEC));
    },
  };
  const variableSection: SidebarSection = {
    type: ElementType.Enum.VARIABLE,
    items: Object.values(variablesSaved),
    createFn: () => {
      reduxDispatch(selectVariable());
      reduxDispatch(setFocus(ElementType.Enum.VARIABLE));
    },
    selectFn: (id) => {
      reduxDispatch(selectVariable(id));
      reduxDispatch(setFocus(ElementType.Enum.VARIABLE));
    },
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
          clearAllFn={() => reduxDispatch(setFocus())}
        />
      ))}
    </Accordion>
  );
};
