import React, { useContext, useState } from 'react';
import { Form, FormText } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSaveSpell } from '../../../../../app/custom-hooks/use-save-spell-hook';
import { UNSELECTED_ID, WIZARD_PATH } from '../../../../../core/common/consts';
import { MouseKey } from '../../../../../data/model/action/mouse/mouse-key';
import { ClickSpell } from '../../../../../data/wizard/spell';
import { SpellType } from '../../../../../data/wizard/spell-types';
import { Tokens } from '../../../../../di/config/brandi-tokens';
import { InjectionContext } from '../../../../../di/injector-context';
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
  setButton: React.Dispatch<React.SetStateAction<MouseKey.Type>>;
};

export const WizardClickSpellComponent: React.FC<{}> = () => {
  const [contextId, setContextId] = useState(UNSELECTED_ID);
  const [selector, setSelector] = useState('');
  const [button, setButton] = useState<MouseKey.Type>(MouseKey.Enum.LEFT);
  const container = useContext(InjectionContext);

  const specValidator = container.get(Tokens.ClickSpellSpecValidator);
  const actionValidator = container.get(Tokens.ClickSpellActionValidator);
  const commandValidator = container.get(Tokens.ClickSpellCommandValidator);

  const spell: ClickSpell = {
    type: SpellType.Enum.CLICK,
    contextId,
    selector,
    button,
  };

  return (
    <ValidationComponent<ClickSpell>
      validators={[commandValidator, specValidator, actionValidator]}
      editing={spell}
    >
      <WizardClickSpellChildComponent
        spell={spell}
        dispatches={{ setContextId, setSelector, setButton }}
      />
    </ValidationComponent>
  );
};

const WizardClickSpellChildComponent: React.FC<{
  spell: ClickSpell;
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
      const spellMapper = container.get(Tokens.ClickSpellMapper);
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
            <PanelComponent header="Click Wizard">
              <SpellContextSelectionComponent
                field={Field.WIZ_MC_CONTEXT}
                contextId={props.spell.contextId}
                setContextId={props.dispatches.setContextId}
              />
              <SpellSpecSelectionComponent
                field={Field.WIZ_MC_SPEC}
                selector={props.spell.selector}
                setSelector={props.dispatches.setSelector}
              />
              <FormGroupRowComponent
                labelText="Mouse Button Selection"
                errorMessage={errorResults(Field.WIZ_MC_BTN)}
              >
                <Form.Select
                  aria-label={Field[Field.WIZ_MC_BTN]}
                  role="list"
                  onChange={(e) => {
                    props.dispatches.setButton(e.target.value as MouseKey.Type);
                    validationContext.touch(Field.WIZ_MC_BTN);
                  }}
                  onBlur={() => validationContext.touch(Field.WIZ_MC_BTN)}
                  value={props.spell.button}
                >
                  {MouseKey.values().map((btn) => (
                    <option key={btn} value={btn} role="listitem">
                      {btn}
                    </option>
                  ))}
                </Form.Select>
                <FormText className="text-muted">
                  which mouse action should this command perform?
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
            header="Click Wizard: Complete"
            createdElements={created}
          />
        }
      />
    </Routes>
  );
};
