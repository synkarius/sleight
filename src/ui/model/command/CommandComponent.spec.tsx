import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { createSelector, Selector } from '../selector/data/selector-domain';
import { saveSelector } from '../selector/selector-reducers';
import { saveSpec } from '../spec/spec-reducers';
import { createSpec, createSpecItem } from '../spec/data/spec-domain';
import { CommandParentComponent } from './CommandParentComponent';
import { saveContext } from '../context/context-reducers';
import { createContext } from '../context/context';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';
import { getSelectorDomainMapper } from '../selector/data/selector-domain-mapper';
import { getSpecDomainMapper } from '../spec/data/spec-domain-mapper';
import { saveCommand } from './command-reducers';
import { createCommand } from './command';
import { createRangeVariable } from '../variable/data/variable';
import { getVariableDomainMapper } from '../variable/data/variable-domain-mapper';
import { saveVariable } from '../variable/variable-reducers';
import { SpecItemType } from '../spec/spec-item-type';
import { SpecDTO } from '../spec/data/spec-dto';
import { createPauseAction, PauseAction } from '../action/pause/pause';
import { saveAction } from '../action/action-reducers';
import { EnterValueType } from '../action/action-value/action-value';
import { ActionValueType } from '../action/action-value/action-value-type';
import { VariableType } from '../variable/variable-types';

const ACTION_NO_VAR_NAME = 'asdf-action-1';
const ACTION_WITH_VAR_NAME = 'asdf-action-2';
const SPEC_NO_VAR_NAME = 'asdf-spec-1';
const SPEC_WITH_VAR_NAME = 'asdf-spec-2';
const CONTEXT_ID = 'asdf-ctx-id';
const CONTEXT_NAME = 'asdf-ctx-name';
const COMMAND_NAME = 'asdf-cmd-name';
const ROLE_KEY = 'rk-1087';

let user: UserEvent;

beforeAll(() => {
  // save variable
  const rangeVariable = createRangeVariable();
  const rangeVariableDTO =
    getVariableDomainMapper().mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));
  // save specs
  const selector = createSelector();
  const selectorRedux = getSelectorDomainMapper().mapFromDomain(selector);
  store.dispatch(saveSelector(selectorRedux));
  const specWithNoVar = createTestReduxSpec(selector);
  store.dispatch(
    saveSpec({
      ...specWithNoVar,
      name: SPEC_NO_VAR_NAME,
    })
  );
  const specWithVar: SpecDTO = {
    ...createSpec(),
    name: SPEC_WITH_VAR_NAME,
    items: [
      {
        id: '923dh2d9823jd98j',
        itemType: SpecItemType.Enum.VARIABLE,
        itemId: rangeVariable.id,
        grouped: false,
        optional: false,
      },
    ],
  };
  store.dispatch(saveSpec(specWithVar));
  // save a context
  store.dispatch(
    saveContext({
      ...createContext(),
      id: CONTEXT_ID,
      name: CONTEXT_NAME,
    })
  );
  // save actions
  const actionWithNoVar: PauseAction = {
    ...createPauseAction(),
    name: ACTION_NO_VAR_NAME,
    centiseconds: {
      actionValueType: ActionValueType.Enum.ENTER_VALUE,
      enteredValueType: EnterValueType.NUMERIC,
      value: 0,
    },
  };
  store.dispatch(saveAction(actionWithNoVar));
  const actionWithVar: PauseAction = {
    ...createPauseAction(),
    name: ACTION_WITH_VAR_NAME,
    centiseconds: {
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.RANGE,
      variableId: rangeVariable.id,
    },
  };
  store.dispatch(saveAction(actionWithVar));
  // save a command
  store.dispatch(
    saveCommand({
      ...createCommand(),
      name: COMMAND_NAME,
      roleKey: ROLE_KEY,
      specId: specWithNoVar.id,
      actionIds: [actionWithNoVar.id],
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <CommandParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('command component tests', () => {
  it('should have a placeholder name', () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/com-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate unselected spec', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    await user.click(specSelect);
    await user.tab();

    expect(specSelect).toHaveClass('is-invalid');
  });

  it('should validate selected spec', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    await user.selectOptions(specSelect, [SPEC_NO_VAR_NAME]);
    await user.tab();

    expect(specSelect).not.toHaveClass('is-invalid');
  });

  it('selected context should stick', async () => {
    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_CONTEXT],
    });
    await user.selectOptions(contextSelect, [CONTEXT_NAME]);
    await user.tab();

    expect(contextSelect).toHaveValue(CONTEXT_ID);
  });

  it('should invalidate an already taken name', async () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, COMMAND_NAME);

    const errorText = screen.getByText(
      'a command already exists with this name'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken role key', async () => {
    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, ROLE_KEY);

    const errorText = screen.getByText(
      'a command already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate on save if spec has no variables and actions are empty', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [SPEC_NO_VAR_NAME]);
    // then just save
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  it('should validate on save if spec has unused variables and actions are empty', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [SPEC_WITH_VAR_NAME]);
    // then just save
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  /*
   * Scenario:
   * - spec: provides no var
   * - action: requires var
   */
  it('should invalidate on save if spec var coverage of actions is inadequate', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [SPEC_NO_VAR_NAME]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, ACTION_WITH_VAR_NAME);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.getByText(getInadequateSpecsRegex());

    expect(saveButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  /*
   * Scenario:
   * - spec: provides var
   * - action: requires var
   */
  it('should validate on save if spec var coverage of actions is adequate', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [SPEC_WITH_VAR_NAME]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, ACTION_WITH_VAR_NAME);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  /*
   * Scenario:
   * - spec: provides var
   * - action: requires no var
   */
  it('should validate on save if spec has unused variables and actions require no variables', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [SPEC_WITH_VAR_NAME]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    // select an action with no variables
    await user.selectOptions(actionSelect, ACTION_NO_VAR_NAME);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  /*
   * Scenario:
   * - spec: provides no var
   * - action: requires no var
   */
  it('should validate on save if spec and action both have no vars', async () => {
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [SPEC_NO_VAR_NAME]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, ACTION_NO_VAR_NAME);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  it('should update enabled', async () => {
    const enabledSwitch = screen.getByLabelText('Enabled');
    expect(enabledSwitch).toBeChecked();
    await user.click(enabledSwitch);

    expect(enabledSwitch).not.toBeChecked();
  });

  it('should update locked', async () => {
    const lockedSwitch = screen.getByLabelText('Locked');
    expect(lockedSwitch).not.toBeChecked();
    await user.click(lockedSwitch);

    expect(lockedSwitch).toBeChecked();
  });
});

const getInadequateSpecsRegex = () =>
  /this command's spec \(.*\) does not provide variables adequate/;

const createTestReduxSpec = (selector: Selector) => {
  const spec = createSpec();
  const specItem = createSpecItem();
  return getSpecDomainMapper().mapFromDomain({
    ...spec,
    items: [{ ...specItem, selector: selector }],
  });
};
