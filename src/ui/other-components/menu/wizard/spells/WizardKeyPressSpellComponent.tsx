import React, { useContext, useState } from 'react';
import { Button, Col, Form, FormControl, FormText } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  UNSELECTED_ENUM,
  UNSELECTED_ID,
  WIZARD_PATH,
} from '../../../../../core/common/consts';
import { Key } from '../../../../../data/model/action/send-key/key';
import { KeyPressSpell } from '../../../../../data/wizard/spell';
import { SpellType } from '../../../../../data/wizard/spell-types';
import { Steps } from '../../../../../data/wizard/steps';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../../../di/injector-context';
import { ValidationContext } from '../../../../../validation/validation-context';
import { Field } from '../../../../../validation/validation-field';
import { processErrorResults } from '../../../../../validation/validation-result-processing';
import { ValidationComponent } from '../../../../../validation/ValidationComponent';
import { ContextDropdownComponent } from '../../../../model/context/ContextDropdownComponent';
import { getSimplePath } from '../../../../navigation/router-fns';
import { FormGroupRowComponent } from '../../../FormGroupRowComponent';
import { PanelComponent } from '../../../PanelComponent';
import { SpellButtonsComponent } from './SpellButtonsComponent';

type Dispatches = {
  setContextId: React.Dispatch<React.SetStateAction<string>>;
  setSelector: React.Dispatch<React.SetStateAction<string>>;
  setKey: React.Dispatch<React.SetStateAction<string>>;
};

export const WizardKeyPressSpellComponent: React.FC<{}> = (props) => {
  const [contextId, setContextId] = useState(UNSELECTED_ID);
  const [selector, setSelector] = useState('');
  const [key, setKey] = useState(UNSELECTED_ENUM);
  const container = useContext(InjectionContext);

  const specValidator = container.get(Tokens.KeyPressSpellSpecValidator);
  const actionValidator = container.get(Tokens.KeyPressSpellActionValidator);
  const commandValidator = container.get(Tokens.KeyPressSpellCommandValidator);

  const spell: KeyPressSpell = {
    type: SpellType.Enum.KEY_PRESS,
    contextId,
    selector,
    key,
  };

  return (
    <ValidationComponent<KeyPressSpell>
      validators={[commandValidator, specValidator, actionValidator]}
      editing={spell}
    >
      <WizardKeyPressSpellChildComponent
        spell={spell}
        dispatches={{ setContextId, setSelector, setKey }}
      />
    </ValidationComponent>
  );
};

const WizardKeyPressSpellChildComponent: React.FC<{
  spell: KeyPressSpell;
  dispatches: Dispatches;
}> = (props) => {
  const navigate = useNavigate();
  const validationContext = useContext(ValidationContext);

  /**
   * Context has to be determined first, because without context, we can't
   * decide if the spec selection is valid.
   */
  const cancel = () => navigate(WIZARD_PATH);
  const goToStep1 = () => {
    if (validationContext.validateForSave()) {
      navigate(Steps.Enum.STEP_1);
    }
  };
  const goToStep2 = () => {
    // TODO: submit validation here
    navigate(Steps.Enum.STEP_2);
  };
  const goToStep3 = () => {
    // TODO: submit validation here
    navigate(Steps.Enum.STEP_3);
  };
  const goToComplete = () => {
    // TODO: submit validation here
    navigate(Steps.Enum.COMPLETE);
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <Routes>
      <Route
        path={getSimplePath(Steps.Enum.STEP_1)}
        element={
          <PanelComponent header="Key Press Wizard: Step 1">
            <FormGroupRowComponent labelText="Context Selection">
              <ContextDropdownComponent
                field={Field.WIZ_SK_CONTEXT}
                contextId={props.spell.contextId}
                onChange={(e) => {
                  props.dispatches.setContextId(e.target.value);
                  validationContext.touch(Field.WIZ_SK_CONTEXT);
                }}
                onBlur={() => validationContext.touch(Field.WIZ_SK_CONTEXT)}
              />
              <FormText className="text-muted">
                when do you want this command to be active?
              </FormText>
              <FormText as={Col} className="text-info">
                hint 1: leave empty for global
              </FormText>
              <FormText as={Col} className="text-info">
                hint 2: add contexts in the Element Editor
              </FormText>
            </FormGroupRowComponent>
            <SpellButtonsComponent cancel={cancel} next={goToStep2} />
          </PanelComponent>
        }
      />
      <Route
        path={getSimplePath(Steps.Enum.STEP_2)}
        element={
          <PanelComponent header="Key Press Wizard: Step 2">
            {/* // TODO: this spec editing thing should become a component */}
            <FormGroupRowComponent
              labelText="Spec Selection"
              errorMessage={errorResults([Field.WIZ_SK_SPEC])}
            >
              <FormControl
                aria-label={Field[Field.WIZ_SK_SPEC]}
                type="text"
                onChange={(e) => {
                  props.dispatches.setSelector(e.target.value);
                  validationContext.touch(Field.WIZ_SK_SPEC);
                }}
                onBlur={() => validationContext.touch(Field.WIZ_SK_SPEC)}
                isInvalid={!!errorResults([Field.WIZ_SK_SPEC])}
                value={props.spell.selector}
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
            <FormGroupRowComponent labelText="Key Selection">
              <Form.Select
                aria-label={Field[Field.WIZ_SK_KEY]}
                role="list"
                onChange={(e) => {
                  props.dispatches.setKey(e.target.value);
                  validationContext.touch(Field.WIZ_SK_KEY);
                }}
                onBlur={() => validationContext.touch(Field.WIZ_SK_KEY)}
                value={props.spell.key}
              >
                {Key.values().map((key) => (
                  <option key={key} value={key} role="listitem">
                    {key}
                  </option>
                ))}
              </Form.Select>
              <FormText className="text-muted">
                what key should this command press?
              </FormText>
            </FormGroupRowComponent>
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
