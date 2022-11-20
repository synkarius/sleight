import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { ActionType } from '../../../data/model/action/action-types';
import { ActionComponent } from './ActionComponent';
import { InjectionContext } from '../../../di/injector-context';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { LIST } from '../../../core/common/accessibility-roles';
import { container } from '../../../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';
import { fieldName } from '../../../validation/field-name';
import { import10 } from '../../../test/resources/import-10.json';
import { import11 } from '../../../test/resources/import-11.json';
import { loadTestData } from '../../../test/utils/import-test-json-util';

const VARIABLE_NAME_1 = 'range-var-88f81806-3540';
const NEGATIVE_MIN_RANGE_VAR_NAME = 'range-var-a8796494-2f92';
const ACTION_WITH_VARS_ID = 'ca469202-4fe4-4768-a27b-7ed99a315874';
const ACTION_NO_VARS_ID = '981fcb99-c5ed-4000-8561-56541ea2733a';
const ROLE_KEY = 'rk-38190';
const SAVE = 'Save';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-save actions before each test b/c some tests dirty the data */
  loadTestData(import10);
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
      name: fieldName(Field.AC_NAME),
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
      name: fieldName(Field.AC_SK_KEY_TO_SEND_VALUE),
    });
    await user.click(select);
    await user.tab();
    // is invalid at this point
    const actionTypeSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_TYPE),
    });
    await user.selectOptions(actionTypeSelect, ActionType.Enum.PAUSE);
    // should be valid again

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate an already taken role key', async () => {
    doRender();

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.AC_ROLE_KEY),
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
    doRender(ACTION_NO_VARS_ID);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate action w/ vars in command w/ spec w/ vars', async () => {
    doRender(ACTION_WITH_VARS_ID);

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
    doRender(ACTION_NO_VARS_ID);

    // change action to have vars
    const variableRadio = screen.getByLabelText('Use (Range) Variable');
    await user.click(variableRadio);
    const variableSelect = screen.getByRole(LIST, {
      name: fieldName(Field.AC_PAUSE_SECONDS_VAR),
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
    doRender(ACTION_WITH_VARS_ID);

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

  it('should invalidate range-inappropriate variable selection', async () => {
    loadTestData(import11);
    doRender();

    const actionTypeSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_TYPE),
    });
    await user.selectOptions(actionTypeSelect, ActionType.Enum.PAUSE);

    const variableRadio = screen.getByLabelText('Use (Range) Variable');
    await user.click(variableRadio);
    const variableSelect = screen.getByRole(LIST, {
      name: fieldName(Field.AC_PAUSE_SECONDS_VAR),
    });
    await user.selectOptions(variableSelect, NEGATIVE_MIN_RANGE_VAR_NAME);

    const errorText = screen.getByText(
      'numeric variables must have an appropriate range for their usage; this variable has a negative minimum'
    );
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });

    expect(variableSelect).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this action is used in the command ".+" which, due to spec/;
