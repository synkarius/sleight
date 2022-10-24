import React, { useContext, useState } from 'react';
import { Button, FormControl, FormText } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  UNSELECTED_ENUM,
  WIZARD_PATH,
} from '../../../../../core/common/consts';
import { Steps } from '../../../../../data/wizard/steps';
import { ValidationContext } from '../../../../../validation/validation-context';
import { Field } from '../../../../../validation/validation-field';
import { getSimplePath } from '../../../../navigation/router-fns';
import { FormGroupRowComponent } from '../../../FormGroupRowComponent';
import { PanelComponent } from '../../../PanelComponent';
import { SpellButtonsComponent } from './SpellButtonsComponent';

export const WizardKeyPressSpellComponent: React.FC<{}> = (props) => {
  const [selector, setSelector] = useState('');
  const [key, setKey] = useState(UNSELECTED_ENUM);
  const navigate = useNavigate();
  const validationContext = useContext(ValidationContext);

  /**
   * Context has to be determined first, because without context, we can't
   * decide if the spec selection is valid.
   */
  const cancel = () => navigate(WIZARD_PATH);
  const goToStep1 = () => {
    // TODO: validation here
    navigate(Steps.Enum.STEP_1);
  };
  const goToStep2 = () => {
    // TODO: validation here
    navigate(Steps.Enum.STEP_2);
  };
  const goToStep3 = () => {
    // TODO: validation here
    navigate(Steps.Enum.STEP_3);
  };
  const goToComplete = () => {
    // TODO: validation here
    navigate(Steps.Enum.COMPLETE);
  };

  return (
    <Routes>
      <Route
        path={getSimplePath(Steps.Enum.STEP_1)}
        element={
          <PanelComponent header="Key Press Wizard: Step 1">
            <p>TODO: context selection</p>
            <SpellButtonsComponent cancel={cancel} next={goToStep2} />
          </PanelComponent>
        }
      />
      <Route
        path={getSimplePath(Steps.Enum.STEP_2)}
        element={
          <PanelComponent header="Key Press Wizard: Step 2">
            <FormGroupRowComponent labelText="Spec Selection">
              <FormControl
                aria-label={Field[Field.WIZ_SK_SPEC]}
                type="text"
                onChange={(e) => setSelector(e.target.value)}
                onBlur={() => validationContext.touch(Field.WIZ_SK_SPEC)}
                //   isInvalid={!!nameError}
                value={selector}
              />
              <FormText className="text-muted">
                what would you like to say to trigger this keypress?
              </FormText>
            </FormGroupRowComponent>

            <SpellButtonsComponent
              cancel={cancel}
              back={goToStep1}
              next={goToStep3}
            />
          </PanelComponent>
        }
      />
      <Route
        path={getSimplePath(Steps.Enum.STEP_3)}
        element={
          <PanelComponent header="Key Press Wizard: Step 3">
            <p>TODO: key selection</p>
            <SpellButtonsComponent
              cancel={cancel}
              back={goToStep2}
              next={goToComplete}
            />
          </PanelComponent>
        }
      />
      <Route
        path={getSimplePath(Steps.Enum.COMPLETE)}
        element={
          <PanelComponent header="Key Press Wizard: Complete">
            <p>TODO: completion</p>
            <Button onClick={() => navigate(WIZARD_PATH)}>Go to Wizards</Button>
          </PanelComponent>
        }
      />
    </Routes>
  );
};
