import { Accordion } from 'react-bootstrap';
import { useAppSelector } from '../../../app/hooks';
import { ElementType } from '../../../data/model/element-types';
import { SideBarGroupComponent } from './SideBarGroupComponent';
import { SidebarSection } from './sidebar';

export const SidebarComponent: React.FC<{}> = () => {
  const actionsSaved = useAppSelector((state) => state.action.saved);
  const commandsSaved = useAppSelector((state) => state.command.saved);
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const variablesSaved = useAppSelector((state) => state.variable.saved);

  const actionSection: SidebarSection = {
    type: ElementType.Enum.ACTION,
    elements: Object.values(actionsSaved),
  };
  const commandSection: SidebarSection = {
    type: ElementType.Enum.COMMAND,
    elements: Object.values(commandsSaved),
  };
  const contextSection: SidebarSection = {
    type: ElementType.Enum.CONTEXT,
    elements: Object.values(contextsSaved),
  };
  const specSection: SidebarSection = {
    type: ElementType.Enum.SPEC,
    elements: Object.values(specsSaved),
  };
  const variableSection: SidebarSection = {
    type: ElementType.Enum.VARIABLE,
    elements: Object.values(variablesSaved),
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
