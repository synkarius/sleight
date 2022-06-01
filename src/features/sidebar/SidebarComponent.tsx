import { Accordion } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Ided, Named } from '../domain';
import { ElementType } from '../model/common/element-types';
import {
  clearEditingContext,
  createNewEditingContext,
  selectContext,
} from '../model/context/context-reducers';
import {
  clearEditingExtra,
  createNewEditingExtra,
  selectExtra,
} from '../model/extra/extra-reducers';
import { createText } from '../model/extra/text/text';
import {
  clearEditingRoleKey,
  createNewEditingRoleKey,
  selectRoleKey,
} from '../model/role-key/role-key-reducers';
import { createSelector } from '../model/selector/selector';
import { createNewSelector } from '../model/selector/selector-reducers';
import { createSpec } from '../model/spec/spec';
import {
  clearEditingSpec,
  createNewEditingSpec,
  selectSpec,
} from '../model/spec/spec-reducers';
import { SideBarGroupComponent } from './SideBarGroupComponent';

interface Item extends Named, Ided {}

export interface ItemGroup {
  type: string;
  items: Item[];
  createFn: () => void;
  selectFn: (variableId: string) => void;
  clearFn: () => void;
}

export const SidebarComponent = () => {
  const dispatch = useAppDispatch();
  const contextsSaved = useAppSelector((state) => state.context.saved);
  const roleKeysSaved = useAppSelector((state) => state.roleKey.saved);
  const roleKeysNamed = Object.values(roleKeysSaved).map((rk) => {
    return { id: rk.id, name: rk.value };
  });
  const specsSaved = useAppSelector((state) => state.spec.saved);
  const specs = Object.values(specsSaved);
  const variablesSaved = useAppSelector((state) => state.extra.saved);

  // TODO: move these elsewhere & restructure
  const groups: ItemGroup[] = [
    {
      type: ElementType.ACTION,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.COMMAND,
      items: [],
      createFn: () => {},
      selectFn: (id) => {},
      clearFn: () => {},
    },
    {
      type: ElementType.CONTEXT,
      items: contextsSaved,
      createFn: () => dispatch(createNewEditingContext()),
      selectFn: (id) => dispatch(selectContext(id)),
      clearFn: () => dispatch(clearEditingContext()),
    },
    {
      type: ElementType.ROLE_KEY,
      items: roleKeysNamed,
      createFn: () => dispatch(createNewEditingRoleKey()),
      selectFn: (id) => dispatch(selectRoleKey(id)),
      clearFn: () => dispatch(clearEditingRoleKey()),
    },
    {
      type: ElementType.SPEC,
      items: specs,
      createFn: () => {
        // TODO: this way creates orphan selectors - clean them up
        const selector = createSelector();
        const spec = createSpec(selector.id);
        dispatch(createNewSelector(selector));
        dispatch(createNewEditingSpec(spec));
      },
      selectFn: (id) => dispatch(selectSpec(id)),
      clearFn: () => dispatch(clearEditingSpec()),
    },
    {
      type: ElementType.VARIABLE,
      items: variablesSaved,
      createFn: () => dispatch(createNewEditingExtra(createText())),
      selectFn: (variableId) => dispatch(selectExtra(variableId)),
      clearFn: () => dispatch(clearEditingExtra()),
    },
  ];

  const clearAllWorkspaces = () => groups.forEach((group) => group.clearFn());

  return (
    <Accordion defaultActiveKey={['2']} flush alwaysOpen>
      {groups.map((group, index) => (
        <SideBarGroupComponent
          key={group.type}
          eventKey={'' + index}
          group={group}
          clearAllFn={clearAllWorkspaces}
        />
      ))}
    </Accordion>
  );
};
