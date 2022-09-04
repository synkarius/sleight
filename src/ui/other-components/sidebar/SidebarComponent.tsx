import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAction } from '../../model/action/action-reducers';
import { selectCommand } from '../../model/command/command-reducers';
import { ElementType } from '../../../common/element-types';
import { selectContext } from '../../model/context/context-reducers';
import { selectVariable } from '../../model/variable/variable-reducers';
import { selectSpec } from '../../model/spec/spec-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';
import { SidebarSection } from './sidebar';
import { setEditorFocus } from '../../other-components/menu/editor/editor-focus-reducers';

export const SidebarComponent = () => {
  const reduxDispatch = useAppDispatch();
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const commandsSaved = useAppSelector((state) => state.command.saved);
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const actionSection: SidebarSection = {
    type: ElementType.Enum.ACTION,
    items: Object.values(actionsSaved),
    createFn: () => {
      reduxDispatch(selectAction());
      reduxDispatch(setEditorFocus(ElementType.Enum.ACTION));
    },
    selectFn: (id) => {
      reduxDispatch(selectAction(id));
      reduxDispatch(setEditorFocus(ElementType.Enum.ACTION));
    },
  };
  const commandSection: SidebarSection = {
    type: ElementType.Enum.COMMAND,
    items: Object.values(commandsSaved),
    createFn: () => {
      reduxDispatch(selectCommand());
      reduxDispatch(setEditorFocus(ElementType.Enum.COMMAND));
    },
    selectFn: (id) => {
      reduxDispatch(selectCommand(id));
      reduxDispatch(setEditorFocus(ElementType.Enum.COMMAND));
    },
  };
  const contextSection: SidebarSection = {
    type: ElementType.Enum.CONTEXT,
    items: Object.values(contextsSaved),
    createFn: () => {
      reduxDispatch(selectContext());
      reduxDispatch(setEditorFocus(ElementType.Enum.CONTEXT));
    },
    selectFn: (id) => {
      reduxDispatch(selectContext(id));
      reduxDispatch(setEditorFocus(ElementType.Enum.CONTEXT));
    },
  };
  const specSection: SidebarSection = {
    type: ElementType.Enum.SPEC,
    items: Object.values(specsSaved),
    createFn: () => {
      reduxDispatch(selectSpec());
      reduxDispatch(setEditorFocus(ElementType.Enum.SPEC));
    },
    selectFn: (id) => {
      reduxDispatch(selectSpec(id));
      reduxDispatch(setEditorFocus(ElementType.Enum.SPEC));
    },
  };
  const variableSection: SidebarSection = {
    type: ElementType.Enum.VARIABLE,
    items: Object.values(variablesSaved),
    createFn: () => {
      reduxDispatch(selectVariable());
      reduxDispatch(setEditorFocus(ElementType.Enum.VARIABLE));
    },
    selectFn: (id) => {
      reduxDispatch(selectVariable(id));
      reduxDispatch(setEditorFocus(ElementType.Enum.VARIABLE));
    },
  };

  const groups: SidebarSection[] = [
    actionSection,
    commandSection,
    contextSection,
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
        />
      ))}
    </Accordion>
  );
};
