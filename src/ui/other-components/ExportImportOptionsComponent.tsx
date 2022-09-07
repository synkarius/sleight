import React, { useId } from 'react';
import { FormCheck } from 'react-bootstrap';
import { Enablable, Lockable } from '../../data/model/domain';
import { FormGroupRowComponent } from './FormGroupRowComponent';

type EnablableAndLockable = Enablable & Lockable;

export const ExportImportOptionsComponent: React.FC<{
  element: EnablableAndLockable;
  toggleEnabledFn: () => void;
  toggleLockedFn: () => void;
}> = (props) => {
  const enabledToggleId = useId();
  const lockedToggleId = useId();

  return (
    <FormGroupRowComponent labelText="Import/Export Options">
      <FormCheck
        type="switch"
        id={enabledToggleId}
        label="Enabled"
        checked={props.element.enabled}
        onChange={props.toggleEnabledFn}
      />
      <FormCheck
        type="switch"
        id={lockedToggleId}
        label="Locked"
        checked={props.element.locked}
        onChange={props.toggleLockedFn}
      />
    </FormGroupRowComponent>
  );
};
