import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { ActionType } from './action-types';
import { ActionParentComponent } from './ActionParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { saveAction } from './action-reducers';
import { EnterValueType } from './action-value/action-value';
import { createPauseAction, PauseAction } from './pause/pause';
import { ActionValueType } from './action-value/action-value-type';
import { VariableType } from '../variable/variable-types';
import { createRangeVariable } from '../variable/data/variable';
import { saveEditingVariable } from '../variable/variable-reducers';
import { createSpecItem, Spec, SpecItem } from '../spec/data/spec-domain';
import { SpecItemType } from '../spec/spec-item-type';
import {
  createSelector,
  createSelectorItem,
} from '../selector/data/selector-domain';
import { saveEditingSpec } from '../spec/spec-reducers';
import { saveSelector } from '../selector/selector-reducers';
import { Command, createCommand } from '../command/command';
import { CommandSpecType } from '../command/command-spec-type';
import { saveEditingCommand } from '../command/command-reducers';
import { LIST } from '../common/accessibility-roles';
import { act } from 'react-dom/test-utils';

const SPEC_WITH_SELECTOR_ID = 'spec-id-1';
const SPEC_WITH_SELECTOR_NAME = 'spec-name-1';
const SPEC_WITH_VARIABLE_ID = 'spec-id-2';
const SPEC_WITH_VARIABLE_NAME = 'spec-name-2';
const VARIABLE_ID_1 = 'variable-id-1';
const VARIABLE_NAME_1 = 'variable-name-1';
const ACTION_WITH_VARS = 'action-id-1';
const ACTION_NAME_1 = 'action-name-1';
const ACTION_NO_VARS = 'action-id-2';
const SAVE = 'Save';

let user: UserEvent;

beforeAll(() => {
  const injected = getDefaultInjectionContext();
  const selectorMapper = injected.mappers.selector;
  const specMapper = injected.mappers.spec;
  const variableMapper = injected.mappers.variable;

  // save variable
  const rangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_ID_1,
    name: VARIABLE_NAME_1,
  };
  const rangeVariableDTO = variableMapper.mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));

  // save specs
  const selectorSpecItem: SpecItem = {
    ...createSpecItem(),
    itemType: SpecItemType.Enum.SELECTOR,
    selector: {
      ...createSelector(),
      items: [{ ...createSelectorItem(), value: 'asdf' }],
    },
  };
  const specWithSelector: Spec = {
    id: SPEC_WITH_SELECTOR_ID,
    name: SPEC_WITH_SELECTOR_NAME,
    items: [selectorSpecItem],
  };
  const specDTO1 = specMapper.mapFromDomain(specWithSelector);
  store.dispatch(saveEditingSpec(specDTO1));
  const selectorDTO1 = selectorMapper.mapFromDomain(selectorSpecItem.selector);
  store.dispatch(saveSelector(selectorDTO1));
  const specWithVariable: Spec = {
    id: SPEC_WITH_VARIABLE_ID,
    name: SPEC_WITH_VARIABLE_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: VARIABLE_ID_1,
      },
    ],
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariable);
  store.dispatch(saveEditingSpec(specDTO2));

  // save commands
  const command1: Command = {
    ...createCommand(),
    specType: CommandSpecType.Enum.SPEC,
    specId: SPEC_WITH_SELECTOR_ID,
    actionIds: [ACTION_NO_VARS],
  };
  store.dispatch(saveEditingCommand(command1));
  const command2: Command = {
    ...createCommand(),
    specType: CommandSpecType.Enum.SPEC,
    specId: SPEC_WITH_VARIABLE_ID,
    actionIds: [ACTION_WITH_VARS],
  };
  store.dispatch(saveEditingCommand(command2));

  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-save actions before each test b/c some tests dirty the data */

  // save actions
  const action1: PauseAction = {
    ...createPauseAction(),
    id: ACTION_WITH_VARS,
    name: ACTION_NAME_1,
    centiseconds: {
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.RANGE,
      variableId: VARIABLE_ID_1,
    },
  };
  store.dispatch(saveAction(action1));
  const action2: PauseAction = {
    ...createPauseAction(),
    id: ACTION_NO_VARS,
    centiseconds: {
      actionValueType: ActionValueType.Enum.ENTER_VALUE,
      enteredValueType: EnterValueType.NUMERIC,
      value: 789,
    },
  };
  store.dispatch(saveAction(action2));
});

const doRender = (actionId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <ActionParentComponent actionId={actionId} />
      </InjectionContext.Provider>
    </Provider>
  );
};

describe('action component tests', () => {
  it('should have a placeholder name', () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/send-key-act-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    doRender();

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should reset valid status on change action type', async () => {
    doRender();

    const select = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.click(select);
    await user.tab();
    // is invalid at this point
    const actionTypeSelect = screen.getByRole('list', {
      name: Field[Field.AC_TYPE],
    });
    await user.selectOptions(actionTypeSelect, ActionType.Enum.PAUSE);
    // should be valid again

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate an already taken name', async () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, ACTION_NAME_1);

    expect(nameField).toHaveClass('is-invalid');
  });

  it('should validate action w/ no vars in command w/ spec w/ no vars', async () => {
    doRender(ACTION_NO_VARS);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate action w/ vars in command w/ spec w/ vars', async () => {
    doRender(ACTION_WITH_VARS);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate action w/ no vars in command w/ spec w/ vars', async () => {
    // originally: spec has no vars, action has no vars
    doRender(ACTION_NO_VARS);

    // change action to have vars
    const variableRadio = screen.getByLabelText(
      ActionValueType.Enum.USE_VARIABLE
    );
    await user.click(variableRadio);
    const variableSelect = screen.getByRole(LIST, {
      name: Field[Field.AC_CENTISECONDS_VAR],
    });
    await user.selectOptions(variableSelect, VARIABLE_NAME_1);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.getByText(getSpecAdequacyErrorRegex());

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate action w/ no vars in command w/ spec w/ vars', async () => {
    // originally: spec has vars, action has vars
    doRender(ACTION_WITH_VARS);

    // change action to have no vars
    const enterValueRadio = screen.getByLabelText(
      ActionValueType.Enum.ENTER_VALUE
    );
    await user.click(enterValueRadio);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this action is used in the command ".+" which, due to spec/;
