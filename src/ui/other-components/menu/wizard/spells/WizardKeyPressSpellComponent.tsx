import React, { useContext, useState } from 'react';
import { Form, FormText } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSaveSpell } from '../../../../../app/custom-hooks/use-save-spell-hook';
import { UNSELECTED_ID, WIZARD_PATH } from '../../../../../core/common/consts';
import { Key } from '../../../../../data/model/action/send-key/key';
import { KeyPressSpell } from '../../../../../data/wizard/spell';
import { SpellType } from '../../../../../data/wizard/spell-types';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../../../di/injector-context';
import { fieldName } from '../../../../../validation/field-name';
import { ValidationContext } from '../../../../../validation/validation-context';
import { Field } from '../../../../../validation/validation-field';
import { processErrorResults } from '../../../../../validation/validation-result-processing';
import { ValidationComponent } from '../../../../../validation/ValidationComponent';
import { getSimplePath } from '../../../../navigation/router-fns';
import { FormGroupRowComponent } from '../../../FormGroupRowComponent';
import { PanelComponent } from '../../../PanelComponent';
import { SpellButtonsComponent } from './SpellButtonsComponent';
import { SpellCompletionComponent } from './SpellCompletionComponent';
import { SpellContextSelectionComponent } from './SpellContextSelectionComponent';
import { SpellSpecSelectionComponent } from './SpellSpecSelectionComponent';

const EDITING = '';
const COMPLETE = 'complete';

type Dispatches = {
  setContextId: React.Dispatch<React.SetStateAction<string>>;
  setSelector: React.Dispatch<React.SetStateAction<string>>;
  setKey: React.Dispatch<React.SetStateAction<Key.Type>>;
};

export const WizardKeyPressSpellComponent: React.FC<{}> = () => {
  const [contextId, setContextId] = useState(UNSELECTED_ID);
  const [selector, setSelector] = useState('');
  const [key, setKey] = useState<Key.Type>(Key.Enum.ALPHA);
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
  const container = useContext(InjectionContext);
  const [created, setCreated] = useState<string[]>([]);
  const saveSpell = useSaveSpell();

  /**
   * Context has to be determined first, because without context, we can't
   * decide if the spec selection is valid.
   */
  const cancel = () => navigate(WIZARD_PATH);
  const finalize = () => {
    if (validationContext.validateForSave()) {
      const spellMapper = container.get(Tokens.KeyPressSpellMapper);
      const spellData = spellMapper.mapSpell(props.spell);

      setCreated([
        spellData.command.name,
        spellData.action.name,
        spellData.spec.name,
      ]);
      saveSpell(spellData);
      navigate(COMPLETE);
    }
  };

  const fullErrorResults = validationContext.getErrorResults();
  const errorResults = processErrorResults(fullErrorResults);

  return (
    <Routes>
      <Route
        path={getSimplePath(EDITING)}
        element={
          <>
            <PanelComponent header="Key Press Wizard">
              <SpellContextSelectionComponent
                field={Field.WIZ_SK_CONTEXT}
                contextId={props.spell.contextId}
                setContextId={props.dispatches.setContextId}
              />
              <SpellSpecSelectionComponent
                field={Field.WIZ_SK_SPEC}
                selector={props.spell.selector}
                setSelector={props.dispatches.setSelector}
              />
              <FormGroupRowComponent
                labelText="Key Selection"
                errorMessage={errorResults(Field.WIZ_SK_KEY)}
              >
                <Form.Select
                  aria-label={fieldName(Field.WIZ_SK_KEY)}
                  role="list"
                  onChange={(e) => {
                    props.dispatches.setKey(e.target.value as Key.Type);
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
                finalize={finalize}
                finalizeDisabled={!!fullErrorResults.length}
              />
            </PanelComponent>
          </>
        }
      />
      <Route
        path={getSimplePath(COMPLETE)}
        element={
          <SpellCompletionComponent
            header="Key Press Wizard: Complete"
            createdElements={created}
          />
        }
      />
    </Routes>
  );
};
