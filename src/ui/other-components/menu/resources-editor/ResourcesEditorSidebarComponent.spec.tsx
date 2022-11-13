import { render, screen, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { import01 } from '../../../../test/resources/import-fn-01.json';
import { import02 } from '../../../../test/resources/import-fn-02.json';
import { ResourceType } from '../../../../data/model/resource-types';
import { Field } from '../../../../validation/validation-field';
import { TEXT_BOX } from '../../../../core/common/accessibility-roles';
import { saveFn, setFns } from '../../../../core/reducers/fn-reducers';
import {
  saveAction,
  setActions,
} from '../../../../core/reducers/action-reducers';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { act } from 'react-dom/test-utils';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { fieldName } from '../../../../validation/field-name';

const FN1_NAME = 'fn1';
const FN2_NAME = 'fn2';
const formatMapper = container.get(Tokens.FormatMapper);
let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  await setupTestData(import01);
  await setupTestData(import02);
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await clickToGoToResourceEditor();
});

afterEach(async () => {
  store.dispatch(setActions({}));
  store.dispatch(setFns({}));
});

describe('resources editor sidebar tests', () => {
  it('should handle create new fn', async () => {
    await clickToCreateNew(ResourceType.Enum.FN);
    const header = screen.getByText('Create/Edit Function');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: fieldName(Field.FN_NAME),
    });
    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select fn', async () => {
    await clickToSelect(ResourceType.Enum.FN, FN1_NAME);
    const header = screen.getByText('Create/Edit Function');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: fieldName(Field.FN_NAME),
    });
    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(FN1_NAME);
  });

  it('should handle select and then create new fn', async () => {
    await clickToSelect(ResourceType.Enum.FN, FN1_NAME);
    const createButton = screen.getByText('Create New Function');
    await user.click(createButton);
    const header = screen.getByText('Create/Edit Function');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: fieldName(Field.FN_NAME),
    });
    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved fn', async () => {
    await clickToCreateNew(ResourceType.Enum.FN);
    const savedName = 'fn3';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.FN_NAME),
    });
    const importPathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.FN_IMPORT_PATH),
    });

    // minimal info to save
    await user.type(nameField, savedName);
    await user.type(importPathField, 'some.path');

    // save
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);
    const sidebarSavedItem = getResourceSelectButton(
      ResourceType.Enum.FN,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete fn w/ confirm', async () => {
    await clickToSelect(ResourceType.Enum.FN, FN1_NAME);
    const deleteButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE),
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE_MODAL_DELETE),
    });
    await user.click(deleteConfirmButton);
    const header = screen.queryByText('Create/Edit Function');
    const sidebarSavedItem = queryResourceSelectButton(
      ResourceType.Enum.FN,
      FN1_NAME
    );
    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete fn w/ cancel', async () => {
    await clickToSelect(ResourceType.Enum.FN, FN1_NAME);
    const deleteButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE),
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE_MODAL_CANCEL),
    });
    await user.click(deleteCancelButton);
    const header = screen.queryByText('Create/Edit Function');
    const sidebarSavedItem = queryResourceSelectButton(
      ResourceType.Enum.FN,
      FN1_NAME
    );
    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete fn validation', async () => {
    // can't delete fn if still attached to an action
    await clickToSelect(ResourceType.Enum.FN, FN2_NAME);
    const deleteButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE),
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: fieldName(Field.FN_DELETE_MODAL_DELETE),
    });
    const errorText = screen.getByText(getFnDeletionErrorRegex());
    expect(deleteConfirmButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });
});

const getFnDeletionErrorRegex = () =>
  /cannot delete: this function is used in call function action\(s\): ".+"/;

const clickToCreateNew = async (type: ResourceType.Type): Promise<void> => {
  const sidebarSection = screen.getByText<HTMLButtonElement>(`${type}s`);
  await user.click(sidebarSection);
  const createButton = screen.getByText(`Create New ${type}`);
  await user.click(createButton);
};

const clickToGoToResourceEditor = async () => {
  const menuView = screen.getByText('View');
  await user.click(menuView);
  const menuResourceEditor = screen.getByText('Resource Editor');
  await user.click(menuResourceEditor);
};

const clickToSelect = async (
  type: ResourceType.Type,
  resourceName: string
): Promise<void> => {
  const sidebarSection = screen.getByText<HTMLButtonElement>(`${type}s`);
  await user.click(sidebarSection);
  const selectButton = screen.getByRole('button', { name: resourceName });
  await user.click(selectButton);
};

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

/** Get saved item which is in the same sidebar/accordion group as the "create" button.
 * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
 * It's still "as your user would access it", so still RTL philosophy kind of.
 *
 * TODO: do this better, but the RTL way, if there is one
 */
const getResourceSelectButton = (
  resourceType: ResourceType.Type,
  savedName: string
): HTMLElement => {
  const createButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Create New ' + resourceType,
  });
  const section = createButton.parentElement as HTMLElement;
  const sidebarSavedItem = within(section).getByRole('button', {
    name: savedName,
  });
  return sidebarSavedItem;
};
/** see notes on `getResourceSelectButton`: also applicable here */
const queryResourceSelectButton = (
  resourceType: ResourceType.Type,
  savedName: string
) => {
  const createButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Create New ' + resourceType,
  });
  const section = createButton.parentElement as HTMLElement;
  const sidebarSavedItem = within(section).queryByRole('button', {
    name: savedName,
  });
  return sidebarSavedItem;
};
