import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { WIZARD_PATH } from '../../../../../core/common/consts';
import { PanelComponent } from '../../../PanelComponent';

export const SpellCompletionComponent: React.FC<{
  header: string;
  createdElements: string[];
}> = (props) => {
  const navigate = useNavigate();
  return (
    <PanelComponent header={props.header}>
      <p>
        The following elements were created as a part of this command. They can
        be viewed/edited in the editor and list views.
      </p>
      <ListGroup className="mb-3">
        {props.createdElements.map((created) => (
          <ListGroup.Item variant="info" key={created}>
            {created}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={() => navigate(WIZARD_PATH)}>Go to Wizards</Button>
    </PanelComponent>
  );
};
