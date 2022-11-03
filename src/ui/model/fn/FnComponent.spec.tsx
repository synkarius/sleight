import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { BrowserRouter } from 'react-router-dom';
import { InjectionContext } from '../../../di/injector-context';
import { NotImplementedError } from '../../../error/not-implemented-error';
import { FnComponent } from './FnComponent';
import { container } from '../../../di/config/brandi-config';
import { Field } from '../../../validation/validation-field';
import { act } from 'react-dom/test-utils';
import { import01 } from '../../../test/resources/import-fn-01.json';
import { import02 } from '../../../test/resources/import-fn-02.json';
import { Tokens } from '../../../di/config/brandi-tokens';
import { saveFn, setFns } from '../../../core/reducers/fn-reducers';
import { castJsonForTest } from '../../../test/utils/import-test-json-util';
import { FnType } from '../../../data/model/fn/fn-types';
import { saveAction } from '../../../core/reducers/action-reducers';
import { VariableType } from '../../../data/model/variable/variable-types';

const formatMapper = container.get(Tokens.FormatMapper);
const import01fnId = '8ff8432b-25e3-4085-a6ec-e43412e3c2fd';
const import02fnId = '5483ac97-9ea8-4ca2-94db-d89fdb94182d';
let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

afterEach(async () => {
  // clear any saved data
  store.dispatch(setFns({}));
});

describe('fn component tests', () => {
  it('should not save if validation errors', async () => {
    doRender();
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate blank fn name', async () => {
    doRender();
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    await user.click(nameField);
    await user.tab();

    const errorText = screen.getByText('function name must not be empty');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate non-blank fn name', async () => {
    doRender();
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    await user.type(nameField, 'asdf');
    await user.tab();

    const errorText = screen.queryByText('function name must not be empty');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate fn name that starts with digit', async () => {
    doRender();
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    await user.type(nameField, '123a');

    const errorText = screen.getByText(
      'function name must not start with a number'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate taken role key', async () => {
    doRender();
    await setupTestData(import01);

    const rkField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_ROLE_KEY],
    });
    await user.type(rkField, 'rk1');

    const errorText = screen.getByText(
      'a function already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(rkField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate non-taken role key', async () => {
    doRender();
    await setupTestData(import01);

    const rkField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_ROLE_KEY],
    });
    await user.type(rkField, 'rk2');

    const errorText = screen.queryByText(
      'a function already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(rkField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate blank parameter name', async () => {
    doRender();
    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    await user.click(addBtn);

    const paramField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_PARAMETER_NAME],
    });
    await user.click(paramField);
    await user.tab();

    const errorText = screen.getByText('parameter names may not be empty');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(paramField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate non-blank parameter name', async () => {
    doRender();
    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    await user.click(addBtn);

    const paramField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_PARAMETER_NAME],
    });
    await user.type(paramField, 'asdf');

    const errorText = screen.queryByText('parameter names may not be empty');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(paramField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate parameter name that starts with digit', async () => {
    doRender();
    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    await user.click(addBtn);

    const paramField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_PARAMETER_NAME],
    });
    await user.type(paramField, '3a');

    const errorText = screen.getByText(
      'parameter names may not start with a number'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(paramField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate python fn name with invalid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    await user.type(nameField, '$lkjh');

    const errorText = screen.getByText(
      'function name can only use alphanumeric characters and the underscore character'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate python fn name with valid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    await user.type(nameField, 'akjh');

    const errorText = screen.queryByText(
      'function name can only use alphanumeric characters and the underscore character'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate python fn path with invalid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, '$lkjh');

    const errorText = screen.getByText(
      'import path may only include alphanumeric chars and dots'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate python fn path with valid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, 'akjh');

    const errorText = screen.queryByText(
      'import path may only include alphanumeric chars and dots'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate python fn path with invalid format (starts with dot)', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, '.some.path');

    const errorText = screen.getByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate python fn path with invalid format (includes double dot)', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, 'some..path');

    const errorText = screen.getByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate python fn path with invalid format (ends with dot)', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, 'some.path.');

    const errorText = screen.getByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate python fn path with invalid format (dot number)', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, 'some.0.path');

    const errorText = screen.getByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate python fn path with invalid format (starts with number)', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, '0.some.path');

    const errorText = screen.getByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate python fn path with valid format', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const pathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });
    await user.type(pathField, 'some.path');

    const errorText = screen.queryByText(
      'import path must follow python import format'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(pathField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate python fn parameter with invalid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    // add two; error should only appear on first
    await user.click(addBtn);
    await user.click(addBtn);

    const paramFields = screen.getAllByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_PARAMETER_NAME],
    });
    await user.type(paramFields[0], '$a');

    const errorText = screen.getByText(
      'parameter names may only use alphanumeric characters and the underscore character'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(paramFields[0]).toHaveClass('is-invalid');
    expect(paramFields[1]).not.toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate python fn parameter with valid characters', async () => {
    doRender();
    const fnTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_TYPE],
    });
    await user.selectOptions(fnTypeSelect, FnType.Enum.PYTHON);

    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    await user.click(addBtn);

    const paramField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_PARAMETER_NAME],
    });
    await user.type(paramField, 'aaa');

    const errorText = screen.queryByText(
      'parameter names may only use alphanumeric characters and the underscore character'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(paramField).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it.skip('should invalidate used fn type change', async () => {
    // can't test this because there isn't a second fn type yet
    throw new NotImplementedError('fn functional test');
  });

  it.skip('should validate non-used fn type change', async () => {
    // can't test this because there isn't a second fn type yet
    throw new NotImplementedError('fn functional test');
  });

  it('should invalidate used python fn num params change via add', async () => {
    await setupTestData(import02);
    doRender(import02fnId);

    const addBtn = screen.getByRole('button', {
      name: Field[Field.FN_ADD_NEW_PARAMETER],
    });
    await user.click(addBtn);

    const errorText = screen.getByText(getNumParamsChangedErrorRegex());
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate used python fn num params change via delete', async () => {
    await setupTestData(import02);
    doRender(import02fnId);

    const deleteBtn = screen.getByRole('button', {
      name: Field[Field.FN_DELETE_PARAMETER],
    });
    await user.click(deleteBtn);

    const errorText = screen.getByText(getNumParamsChangedErrorRegex());
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate non-used python fn num params change via delete', async () => {
    await setupTestData(import01);
    doRender(import01fnId);

    const deleteBtn = screen.getAllByRole('button', {
      name: Field[Field.FN_DELETE_PARAMETER],
    })[0];
    await user.click(deleteBtn);

    const errorText = screen.queryByText(getNumParamsChangedErrorRegex());
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate used python fn parameter type change', async () => {
    await setupTestData(import02);
    doRender(import02fnId);

    const fnParamTypeSelect = screen.getByRole('list', {
      name: Field[Field.FN_PARAMETER_TYPE],
    });
    await user.selectOptions(fnParamTypeSelect, VariableType.Enum.NUMBER);
    const errorText = screen.getByText(getParamTypeChangedErrorRegex());
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate non-used python fn parameter type change', async () => {
    await setupTestData(import01);
    doRender(import01fnId);

    const fnParamTypeSelect = screen.getAllByRole('list', {
      name: Field[Field.FN_PARAMETER_TYPE],
    })[0];
    await user.selectOptions(fnParamTypeSelect, VariableType.Enum.NUMBER);
    const errorText = screen.queryByText(getParamTypeChangedErrorRegex());
    const saveButton = screen.getByRole('button', { name: 'Save' });

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

const getNumParamsChangedErrorRegex = () =>
  /cannot change number of parameters since function is already used in Call Function Action\(s\): ".+"/;

const getParamTypeChangedErrorRegex = () =>
  /cannot change parameter type since function is already used in Call Function Action\(s\): ".+"/;

const setupTestData = async (jsonData: unknown) => {
  act(() => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(jsonData)
    );
    Object.values(data.fns).forEach((fn) => store.dispatch(saveFn(fn)));
    Object.values(data.actions).forEach((action) =>
      store.dispatch(saveAction(action))
    );
  });
};

const doRender = (fnId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <FnComponent fnId={fnId} />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
};
