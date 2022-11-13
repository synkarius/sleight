import React, { useContext, useState } from 'react';
import { FormControl, FormText } from 'react-bootstrap';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSaveSpell } from '../../../../../app/custom-hooks/use-save-spell-hook';
import { UNSELECTED_ID, WIZARD_PATH } from '../../../../../core/common/consts';
import { TextSpell } from '../../../../../data/wizard/spell';
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
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export const WizardTextSpellComponent: React.FC<{}> = () => {
  const [contextId, setContextId] = useState(UNSELECTED_ID);
  const [selector, setSelector] = useState('');
  const [text, setText] = useState('');
  const container = useContext(InjectionContext);

  const specValidator = container.get(Tokens.TextSpellSpecValidator);
  const actionValidator = container.get(Tokens.TextSpellActionValidator);
  const commandValidator = container.get(Tokens.TextSpellCommandValidator);

  const spell: TextSpell = {
    type: SpellType.Enum.TEXT,
    contextId,
    selector,
    text,
  };

  return (
    <ValidationComponent<TextSpell>
      validators={[commandValidator, specValidator, actionValidator]}
      editing={spell}
    >
      <WizardTextSpellChildComponent
        spell={spell}
        dispatches={{ setContextId, setSelector, setText }}
      />
    </ValidationComponent>
  );
};

const WizardTextSpellChildComponent: React.FC<{
  spell: TextSpell;
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
      const spellMapper = container.get(Tokens.TextSpellMapper);
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
            <PanelComponent header="Text Wizard">
              <SpellContextSelectionComponent
                field={Field.WIZ_ST_CONTEXT}
                contextId={props.spell.contextId}
                setContextId={props.dispatches.setContextId}
              />
              <SpellSpecSelectionComponent
                field={Field.WIZ_ST_SPEC}
                selector={props.spell.selector}
                setSelector={props.dispatches.setSelector}
              />
              <FormGroupRowComponent
                labelText="Text Selection"
                errorMessage={errorResults(Field.WIZ_ST_TEXT)}
              >
                <FormControl
                  type="text"
                  value={props.spell.text}
                  onChange={(e) => {
                    props.dispatches.setText(e.target.value);
                    validationContext.touch(Field.WIZ_ST_TEXT);
                  }}
                  onBlur={() => validationContext.touch(Field.WIZ_ST_TEXT)}
                  isInvalid={!!errorResults(Field.WIZ_ST_TEXT)}
                  role="textbox"
                  aria-label={fieldName(Field.WIZ_ST_TEXT)}
                />
                <FormText className="text-muted">
                  what text should this command send?
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
            header="Text Wizard: Complete"
            createdElements={created}
          />
        }
      />
    </Routes>
  );
};
