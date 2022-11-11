import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { ActionType } from '../../../data/model/action/action-types';
import { ActionComponent } from './ActionComponent';
import { InjectionContext } from '../../../di/injector-context';
import { saveAction } from '../../../core/reducers/action-reducers';
import {
  createPauseAction,
  PauseAction,
} from '../../../data/model/action/pause/pause';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { VariableType } from '../../../data/model/variable/variable-types';
import { createRangeVariable } from '../../../data/model/variable/variable';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import {
  createSpecItem,
  Spec,
  SpecItem,
} from '../../../data/model/spec/spec-domain';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import {
  createSelector,
  createSelectorItem,
} from '../../../data/model/selector/selector-domain';
import { saveSpec } from '../../../core/reducers/spec-reducers';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import { Command, createCommand } from '../../../data/model/command/command';
import { saveCommand } from '../../../core/reducers/command-reducers';
import { LIST } from '../../../core/common/accessibility-roles';
import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { BrowserRouter } from 'react-router-dom';

const SPEC_WITH_SELECTOR_ID = 'spec-id-1';
const SPEC_WITH_SELECTOR_NAME = 'spec-name-1';
const SPEC_WITH_VARIABLE_ID = 'spec-id-2';
const SPEC_WITH_VARIABLE_NAME = 'spec-name-2';
const VARIABLE_ID_1 = 'variable-id-1';
const VARIABLE_NAME_1 = 'variable-name-1';
const ACTION_WITH_VARS = 'action-id-1';
const ACTION_NAME_1 = 'action-name-1';
const ACTION_NO_VARS = 'action-id-2';
const ROLE_KEY = 'rk-38190';
const SAVE = 'Save';

let user: UserEvent;

beforeAll(() => {
  const selectorMapper = container.get(Tokens.DomainMapper_Selector);
  const specMapper = container.get(Tokens.DomainMapper_Spec);
  const variableMapper = container.get(Tokens.DomainMapper_Variable);

  // save variable
  const rangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_ID_1,
    name: VARIABLE_NAME_1,
  };
  const rangeVariableDTO = variableMapper.mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));

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
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO1 = specMapper.mapFromDomain(specWithSelector);
  store.dispatch(saveSpec(specDTO1));
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
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariable);
  store.dispatch(saveSpec(specDTO2));

  // save commands
  const command1: Command = {
    ...createCommand(),
    specId: SPEC_WITH_SELECTOR_ID,
    actionIds: [ACTION_NO_VARS],
    roleKey: '',
  };
  store.dispatch(saveCommand(command1));
  const command2: Command = {
    ...createCommand(),
    specId: SPEC_WITH_VARIABLE_ID,
    actionIds: [ACTION_WITH_VARS],
    roleKey: '',
  };
  store.dispatch(saveCommand(command2));

  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-save actions before each test b/c some tests dirty the data */

  // save actions
  const action1: PauseAction = {
    ...createPauseAction(),
    id: ACTION_WITH_VARS,
    name: ACTION_NAME_1,
    roleKey: ROLE_KEY,
    seconds: {
      id: '123',
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.NUMBER,
      variableId: VARIABLE_ID_1,
    },
  };
  store.dispatch(saveAction(action1));
  const action2: PauseAction = {
    ...createPauseAction(),
    id: ACTION_NO_VARS,
    seconds: {
      id: '234',
      actionValueType: ActionValueType.Enum.ENTER_VALUE,
      enteredValueType: VariableType.Enum.NUMBER,
      value: 789,
    },
  };
  store.dispatch(saveAction(action2));
});

const doRender = (actionId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <ActionComponent actionId={actionId} />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
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
      name: Field[Field.AC_SK_KEY_TO_SEND_VALUE],
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

  it('should invalidate an already taken role key', async () => {
    doRender();

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, ROLE_KEY);

    const errorText = screen.getByText(
      'an action already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
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
    const variableRadio = screen.getByLabelText('Use (Range) Variable');
    await user.click(variableRadio);
    const variableSelect = screen.getByRole(LIST, {
      name: Field[Field.AC_SECONDS_VAR],
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

  it('should update enabled', async () => {
    doRender();

    const enabledSwitch = screen.getByLabelText('Enabled');
    expect(enabledSwitch).toBeChecked();
    await user.click(enabledSwitch);

    expect(enabledSwitch).not.toBeChecked();
  });

  it('should update locked', async () => {
    doRender();

    const lockedSwitch = screen.getByLabelText('Locked');
    expect(lockedSwitch).not.toBeChecked();
    await user.click(lockedSwitch);

    expect(lockedSwitch).toBeChecked();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this action is used in the command ".+" which, due to spec/;
