import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { CommandComponent } from './CommandComponent';
import { InjectionContext } from '../../../di/injector-context';
import { container } from '../../../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';
import { loadTestData } from '../../../test/utils/import-test-json-util';
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
import { import12 } from '../../../test/resources/command-setup-12.json';
import { fieldName } from '../../../validation/field-name';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

const doRender = (commandId?: string): void => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <CommandComponent commandId={commandId} />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
};

describe('command component tests', () => {
  it('should have a placeholder name', () => {
    doRender();
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.CMD_NAME),
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/com-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    doRender();
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate unselected spec', async () => {
    doRender();
    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
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
    doRender();
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    await user.selectOptions(specSelect, [specName]);
    await user.tab();

    const errorText = screen.queryByText('spec must be selected');

    expect(errorText).not.toBeInTheDocument();
    expect(specSelect).not.toHaveClass('is-invalid');
  });

  it('selected context should stick', async () => {
    loadTestData(import09);
    doRender();
    const contextName = Object.values(import09.contexts)[0].name;
    const contextId = Object.values(import09.contexts)[0].id;

    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_CONTEXT),
    });
    await user.selectOptions(contextSelect, [contextName]);
    await user.tab();

    expect(contextSelect).toHaveValue(contextId);
  });

  it('should invalidate an already taken role key', async () => {
    loadTestData(import08);
    doRender();

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.CMD_ROLE_KEY),
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
    doRender();
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
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
    doRender();
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
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
    doRender();
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: fieldName(Field.CMD_ACTION_SELECT),
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
    doRender();
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: fieldName(Field.CMD_ACTION_SELECT),
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
    doRender();
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    // select a spec with variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    const actionSelect = screen.getByRole('list', {
      name: fieldName(Field.CMD_ACTION_SELECT),
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
    doRender();
    const actionName = Object.values(data.actions)[0].name;
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    // select a spec with no variables
    await user.selectOptions(specSelect, [specName]);
    const addActionButton = screen.getByText<HTMLButtonElement>('Add Action');
    await user.click(addActionButton);
    // select an action with variables
    const actionSelect = screen.getByRole('list', {
      name: fieldName(Field.CMD_ACTION_SELECT),
    });
    await user.selectOptions(actionSelect, actionName);
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    const errorText = screen.queryByText(getInadequateSpecsRegex());

    expect(saveButton).not.toBeDisabled();
    expect(errorText).not.toBeInTheDocument();
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

  it("should invalidate if new command's spec is used in another command", async () => {
    const data = import10;
    loadTestData(data);
    doRender();
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    // select an already-used spec
    await user.selectOptions(specSelect, [specName]);

    const saveButton = screen.getByText('Save');
    const errorText = screen.getByText(getNonUniqueSpecRegex());

    expect(specSelect).toHaveClass('is-invalid');
    expect(saveButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  it('should validate if spec is used in another command with a different context', async () => {
    const data = import11;
    loadTestData(data);
    doRender();
    const specName = Object.values(data.specs)[0].name;

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
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

  it('should invalidate changing context from global to app such that there will be spec/context pair dupe', async () => {
    const data = import12;
    const contextName = Object.values(data.contexts)[0].name;
    const commandId = Object.values(data.commands)[0].id;
    loadTestData(data);
    doRender(commandId);

    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_CONTEXT),
    });
    await user.selectOptions(contextSelect, [contextName]);
    await user.tab();

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    const saveButton = screen.getByText('Save');
    const errorText = screen.getByText(getNonUniqueSpecRegex());

    expect(saveButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
    expect(specSelect).toHaveClass('is-invalid');
  });

  it('should invalidate changing context from app to global such that there will be spec/context pair dupe', async () => {
    const data = import12;
    const commandId = Object.values(data.commands)[1].id;
    loadTestData(data);
    doRender(commandId);

    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_CONTEXT),
    });
    const globalContextSelectOption = screen.getAllByRole<HTMLOptionElement>(
      'listitem',
      { name: '' }
    )[0];
    await user.selectOptions(contextSelect, globalContextSelectOption);
    await user.tab();

    const specSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: fieldName(Field.CMD_SPEC_SELECT),
    });
    const saveButton = screen.getByText('Save');
    const errorText = screen.getByText(getNonUniqueSpecRegex());

    expect(saveButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
    expect(specSelect).toHaveClass('is-invalid');
  });
});

const getInadequateSpecsRegex = () =>
  /this command's spec \(.*\) does not provide variables adequate/;

const getNonUniqueSpecRegex = () =>
  /commands must have unique specs per context, but this spec is used in command ".+"/;
