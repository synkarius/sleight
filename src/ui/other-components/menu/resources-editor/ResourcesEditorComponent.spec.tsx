import { ResourceType } from '../../../../data/model/resource-types';
import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { Field } from '../../../../validation/validation-field';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await clickToGoToResourceEditor();
});

describe('resources editor tests', () => {
  it('fn should clear on save', async () => {
    await clickToCreateNew(ResourceType.Enum.FN);
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_NAME],
    });
    const importPathField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.FN_IMPORT_PATH],
    });

    // minimal info to save
    await user.type(nameField, 'fn1');
    await user.type(importPathField, 'some.path');

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('fn should clear on cancel', async () => {
    await clickToCreateNew(ResourceType.Enum.FN);
    const cancelButton = screen.getByText<HTMLButtonElement>('Cancel');
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });
});

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
