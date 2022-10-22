import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { saveSpec } from '../../../core/reducers/spec-reducers';
import { CommandParentComponent } from './CommandParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import { saveAction } from '../../../core/reducers/action-reducers';
import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { BrowserRouter } from 'react-router-dom';
import { castJsonForTest } from '../../../test/utils/import-test-json-util';
import { act } from 'react-dom/test-utils';
import { import01 } from '../../../test/resources/command-setup-01.json';
import { import02 } from '../../../test/resources/command-setup-02.json';
import { import03 } from '../../../test/resources/command-setup-03.json';
import { import04 } from '../../../test/resources/command-setup-04.json';
import { import05 } from '../../../test/resources/command-setup-05.json';
import { import06 } from '../../../test/resources/command-setup-06.json';
import { import07 } from '../../../test/resources/command-setup-07.json';
import { import08 } from '../../../test/resources/command-setup-08.json';
import { import09 } from '../../../test/resources/command-setup-09.json';
import { import10 } from '../../../test/resources/command-setup-10.json';
import { import11 } from '../../../test/resources/command-setup-11.json';
import { saveCommand } from '../../../core/reducers/command-reducers';
import { saveContext } from '../../../core/reducers/context-reducers';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <CommandParentComponent />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
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

    const errorText = screen.getByText('spec must be selected');

    expect(errorText).toBeInTheDocument();
    expect(specSelect).toHaveClass('is-invalid');
  });

  it('should validate selected spec', async () => {
    const data = import06;
    loadTestData(data);
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    await user.selectOptions(specSelect, [specName]);
    await user.tab();

    const errorText = screen.queryByText('spec must be selected');

    expect(errorText).not.toBeInTheDocument();
    expect(specSelect).not.toHaveClass('is-invalid');
  });

  it('selected context should stick', async () => {
    loadTestData(import09);
    const contextName = Object.values(import09.contexts)[0].name;
    const contextId = Object.values(import09.contexts)[0].id;

    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_CONTEXT],
    });
    await user.selectOptions(contextSelect, [contextName]);
    await user.tab();

    expect(contextSelect).toHaveValue(contextId);
  });

  it('should invalidate an already taken role key', async () => {
    loadTestData(import08);

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, 'rk1');

    const errorText = screen.getByText(
      'a command already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate on save if spec has no variables and actions are empty', async () => {
    const data = import05;
    loadTestData(data);
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [specName]);
    // then just save
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });

  it('should validate on save if spec has unused variables and actions are empty', async () => {
    const data = import07;
    loadTestData(data);
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [specName]);
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
    const data = import04;
    loadTestData(data);
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, actionName);
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
    const data = import03;
    loadTestData(data);
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, actionName);
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
    const data = import02;
    loadTestData(data);
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    // select an action with no variables
    await user.selectOptions(actionSelect, actionName);
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
    const data = import01;
    loadTestData(data);
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: Field[Field.CMD_ACTION_SELECT],
    });
    await user.selectOptions(actionSelect, actionName);
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

  it('should invalidate if spec is used in another command', async () => {
    const data = import10;
    loadTestData(data);
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select an already-used spec
    await user.selectOptions(specSelect, [specName]);

    const saveButton = screen.getByText('Save');
    const errorText = screen.getByText(
      /commands must have unique specs per context, but this spec is used in command ".+"/
    );

    expect(saveButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  it('should validate if spec is used in another command with a different context', async () => {
    const data = import11;
    loadTestData(data);
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // select an already-used spec
    await user.selectOptions(specSelect, [specName]);

    const saveButton = screen.getByText('Save');
    const errorText = screen.queryByText(
      /commands must have unique specs per context, but this spec is used in command ".+"/
    );

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
  });
});

const getInadequateSpecsRegex = () =>
  /this command's spec \(.*\) does not provide variables adequate/;

const loadTestData = (json: unknown) => {
  const formatMapper = container.get(Tokens.FormatMapper);
  const data = formatMapper.externalFormatToInternal(castJsonForTest(json));
  act(() => {
    Object.values(data.actions).forEach((action) =>
      store.dispatch(saveAction(action))
    );
    Object.values(data.commands).forEach((command) =>
      store.dispatch(saveCommand(command))
    );
    Object.values(data.contexts).forEach((context) =>
      store.dispatch(saveContext(context))
    );
    Object.values(data.specs).forEach((spec) => store.dispatch(saveSpec(spec)));
    Object.values(data.variables).forEach((variable) =>
      store.dispatch(saveVariable(variable))
    );
  });
};
