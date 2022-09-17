import React from 'react';
import { WaitForWindowAction } from '../../../../data/model/action/wait-for-window/wait-for-window';
import { ActionValueComponent } from '../ActionValueComponent';
import {
  wfwExecutableGroup,
  wfwTitleGroup,
  wfwWaitSecondsGroup,
} from './wait-for-window-action-value-field-group';

export const WaitForWindowComponent: React.FC<{
  wfwAction: WaitForWindowAction;
}> = (props) => {
  return (
    <>
      <ActionValueComponent
        labelText="Window Executable"
        descriptionText="the executable name of the window to wait for"
        actionValue={props.wfwAction.executable}
        fields={wfwExecutableGroup}
      />
      <ActionValueComponent
        labelText="Window Title"
        descriptionText="the title of the window to wait for"
        actionValue={props.wfwAction.title}
        fields={wfwTitleGroup}
      />
      <ActionValueComponent
        labelText="Wait Duration"
        descriptionText="the maximum time to wait, in seconds"
        actionValue={props.wfwAction.waitSeconds}
        fields={wfwWaitSecondsGroup}
      />
    </>
  );
};
