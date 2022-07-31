import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../App';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { SELECT_DEFAULT_VALUE } from '../common/consts';
import { createRoleKey } from '../role-key/role-key';
import { saveRoleKey } from '../role-key/role-key-reducers';
import { createSelector, Selector } from '../selector/data/selector-domain';
import { saveSelector } from '../selector/selector-reducers';
import { saveEditingSpec } from '../spec/spec-reducers';
import { createSpec, createSpecItem } from '../spec/data/spec-domain';
import { specDomainMapper } from '../spec/data/spec-domain-mapper';
import { selectorDomainMapper } from '../selector/data/selector-domain-mapper';

const SPEC_NAME = 'asdf-spec';
const ROLE_KEY_NAME = 'asdf-rk';

let user: UserEvent;

beforeAll(() => {
  // save a spec
  const selector = createSelector();
  const selectorRedux = selectorDomainMapper.mapFromDomain(selector);
  store.dispatch(saveSelector(selectorRedux));
  const spec = createTestReduxSpec(selector);
  store.dispatch(
    saveEditingSpec({
      ...spec,
      name: SPEC_NAME,
    })
  );
  // save a role key
  store.dispatch(
    saveRoleKey({
      ...createRoleKey(),
      value: ROLE_KEY_NAME,
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // open commands editor
  const roleKeysSidebarSection =
    screen.getByText<HTMLButtonElement>('Commands');
  await user.click(roleKeysSidebarSection);
  const createNewRoleKeyButton = screen.getByText('Create New Command');
  await user.click(createNewRoleKeyButton);
});

describe('role key component tests', () => {
  it('should handle create new', () => {
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_VAR],
    });

    expect(variableSelect.value).toBe(SELECT_DEFAULT_VALUE);
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate unselected spec variable', async () => {
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_VAR],
    });
    await user.click(variableSelect);
    await user.tab();

    expect(variableSelect).toHaveClass('is-invalid');
  });

  it('should validate selected spec variable', async () => {
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_VAR],
    });
    await user.selectOptions(variableSelect, [SPEC_NAME]);
    await user.tab();

    expect(variableSelect).not.toHaveClass('is-invalid');
  });
});

const createTestReduxSpec = (selector: Selector) => {
  const spec = createSpec();
  const specItem = createSpecItem();
  return specDomainMapper.mapFromDomain({
    ...spec,
    items: [{ ...specItem, selector: selector }],
  });
};
