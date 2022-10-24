import React from 'react';
import { Keyboard, Mouse, Pencil } from 'react-bootstrap-icons';
import { WizardCardComponent } from '../menu/wizard/WizardCardComponent';

export const WizardViewComponent: React.FC<{}> = (props) => {
  const fontSize = '12vw';
  const iconStyle = { fontSize: fontSize };
  return (
    <>
      <div className="text-center">
        <WizardCardComponent
          icon={<Keyboard style={iconStyle} />}
          description={'send key press'}
        />
        <WizardCardComponent
          icon={<Pencil style={iconStyle} />}
          description={'send text'}
        />
        <WizardCardComponent
          icon={<Mouse style={iconStyle} />}
          description={'click mouse'}
        />
      </div>
    </>
  );
};
