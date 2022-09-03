import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../App';
import { store } from '../../../app/store';
import { ElementType } from '../../model/common/element-types';
import { Field } from '../../../validation/validation-field';
import { createSpec, Spec } from '../../model/spec/data/spec-domain';
import { SpecDTO } from '../../model/spec/data/spec-dto';
import { getSpecDomainMapper } from '../../model/spec/data/spec-domain-mapper';
import { saveSpec } from '../../model/spec/spec-reducers';

let user: UserEvent;

const SPEC_NAME_1 = 'spec-name-1';

beforeAll(() => {
  const spec: Spec = {
    ...createSpec(),
    name: SPEC_NAME_1,
  };
  const specDTO: SpecDTO = getSpecDomainMapper().mapFromDomain(spec);
  store.dispatch(saveSpec(specDTO));
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

const clickToCreateNew = async (type: ElementType.Type): Promise<void> => {
  const sidebarSection = screen.getByText<HTMLButtonElement>(`${type}s`);
  await user.click(sidebarSection);
  const createButton = screen.getByText(`Create New ${type}`);
  await user.click(createButton);
};

const SAVE = 'Save';
const CANCEL = 'Cancel';

describe('editor mode focus tests', () => {
  // action

  it('action should clear on save', async () => {
    await clickToCreateNew(ElementType.Enum.ACTION);
    const keyToSendField = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    // minimal info to save
    await user.selectOptions(keyToSendField, 'b (bravo)');
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('action should clear on cancel', async () => {
    await clickToCreateNew(ElementType.Enum.ACTION);
    const cancelButton = screen.getByText<HTMLButtonElement>(CANCEL);
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });

  // command

  it('command should clear on save', async () => {
    await clickToCreateNew(ElementType.Enum.COMMAND);
    const specSelect = screen.getByRole('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    // minimal info to save
    await user.selectOptions(specSelect, SPEC_NAME_1);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('command should clear on cancel', async () => {
    await clickToCreateNew(ElementType.Enum.COMMAND);
    const cancelButton = screen.getByText<HTMLButtonElement>(CANCEL);
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });

  // context

  it('context should clear on save', async () => {
    await clickToCreateNew(ElementType.Enum.CONTEXT);
    const matcherField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_MATCHER],
    });
    // minimal info to save
    await user.type(matcherField, 'c');
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('context should clear on cancel', async () => {
    await clickToCreateNew(ElementType.Enum.CONTEXT);
    const cancelButton = screen.getByText<HTMLButtonElement>(CANCEL);
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });

  // spec

  it('spec should clear on save', async () => {
    await clickToCreateNew(ElementType.Enum.SPEC);
    const addNewButton = screen.getByRole<HTMLButtonElement>('button', {
      name: Field[Field.SP_ADD_ITEM_BUTTON],
    });
    await user.click(addNewButton);
    const selectorItemField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    // minimal info to save
    await user.type(selectorItemField, 'f');
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('spec should clear on cancel', async () => {
    await clickToCreateNew(ElementType.Enum.SPEC);
    const cancelButton = screen.getByText<HTMLButtonElement>(CANCEL);
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });

  // variable

  it('variable should clear on save', async () => {
    await clickToCreateNew(ElementType.Enum.VARIABLE);
    // minimal info to save = nothing
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).not.toBeInTheDocument();
  });

  it('variable should clear on cancel', async () => {
    await clickToCreateNew(ElementType.Enum.VARIABLE);
    const cancelButton = screen.getByText<HTMLButtonElement>(CANCEL);
    await user.click(cancelButton);

    expect(cancelButton).not.toBeInTheDocument();
  });
});
